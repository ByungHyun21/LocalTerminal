'use strict';
const { app, BrowserWindow, ipcMain, safeStorage, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { Client } = require('ssh2');

let win = null;

// connId -> { client, stream, sessionId }
const connections = new Map();

// ---------- persistence ----------

function dataFile(name) {
  return path.join(app.getPath('userData'), name);
}

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    if (err.code !== 'ENOENT') console.error(`[store] read ${file}:`, err.message);
    return fallback;
  }
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, file);
}

// Passwords/passphrases are encrypted with OS credentials (DPAPI on Windows).
function encryptSecret(plain) {
  if (!plain) return '';
  if (safeStorage.isEncryptionAvailable()) {
    return 'enc:' + safeStorage.encryptString(plain).toString('base64');
  }
  return 'plain:' + Buffer.from(plain, 'utf8').toString('base64');
}

function decryptSecret(stored) {
  if (!stored) return '';
  try {
    if (stored.startsWith('enc:')) {
      return safeStorage.decryptString(Buffer.from(stored.slice(4), 'base64'));
    }
    if (stored.startsWith('plain:')) {
      return Buffer.from(stored.slice(6), 'base64').toString('utf8');
    }
  } catch (err) {
    console.error('[store] decrypt failed:', err.message);
  }
  return '';
}

function loadSessions() {
  const list = readJson(dataFile('sessions.json'), []);
  return Array.isArray(list) ? list : [];
}

// Renderer never receives secrets back; only whether one is stored.
function publicSession(s) {
  return {
    id: s.id,
    name: s.name,
    host: s.host,
    port: s.port,
    username: s.username,
    authMethod: s.authMethod,
    keyPath: s.keyPath || '',
    hasPassword: !!s.password,
    hasPassphrase: !!s.passphrase,
  };
}

// ---------- ssh bridge (multi-connection) ----------

function sendStatus(connId, status, message) {
  if (win && !win.isDestroyed()) win.webContents.send('ssh-status', { connId, status, message });
}

function teardownConn(connId) {
  const c = connections.get(connId);
  if (!c) return;
  connections.delete(connId);
  try { c.stream && c.stream.end(); } catch { /* already closed */ }
  try { c.client && c.client.end(); } catch { /* already closed */ }
}

ipcMain.handle('ssh:connect', (_evt, { sessionId, cols, rows }) => {
  const s = loadSessions().find((x) => x.id === sessionId);
  const connId = crypto.randomUUID();

  if (!s) {
    sendStatus(connId, 'error', '세션을 찾을 수 없습니다.');
    return connId;
  }

  sendStatus(connId, 'connecting', `${s.username}@${s.host}:${s.port || 22}`);

  const opts = {
    host: s.host,
    port: s.port || 22,
    username: s.username,
    readyTimeout: 20000,
    keepaliveInterval: 15000,
  };

  let startupError = null;
  if (s.authMethod === 'key') {
    if (!s.keyPath) startupError = '개인 키 파일 경로가 설정되지 않았습니다.';
    else {
      try { opts.privateKey = fs.readFileSync(s.keyPath); }
      catch (err) { startupError = `키 파일을 읽을 수 없습니다: ${err.message}`; }
    }
    if (!startupError) {
      const passphrase = decryptSecret(s.passphrase);
      if (passphrase) opts.passphrase = passphrase;
    }
  } else {
    const password = decryptSecret(s.password);
    if (!password) startupError = '저장된 비밀번호가 없습니다. 세션을 편집해 주세요.';
    else opts.password = password;
  }

  if (startupError) {
    sendStatus(connId, 'error', startupError);
    return connId;
  }

  const client = new Client();
  connections.set(connId, { client, stream: null, sessionId });

  client.on('ready', () => {
    client.shell({ term: 'xterm-256color', cols: cols || 80, rows: rows || 24 }, (err, stream) => {
      if (err) {
        sendStatus(connId, 'error', err.message);
        teardownConn(connId);
        return;
      }
      const c = connections.get(connId);
      if (!c) { stream.end(); return; } // torn down meanwhile
      c.stream = stream;
      stream.on('data', (chunk) => {
        if (win && !win.isDestroyed()) win.webContents.send('ssh-data', connId, chunk);
      });
      stream.on('close', () => {
        if (connections.get(connId) && connections.get(connId).stream === stream) {
          teardownConn(connId);
          sendStatus(connId, 'closed', '연결이 닫혔습니다.');
        }
      });
      sendStatus(connId, 'connected', '');
    });
  });

  client.on('error', (err) => {
    sendStatus(connId, 'error', err.message);
    teardownConn(connId);
  });

  client.on('close', () => {
    if (connections.has(connId)) {
      teardownConn(connId);
      sendStatus(connId, 'closed', '연결이 닫혔습니다.');
    }
  });

  try {
    client.connect(opts);
  } catch (err) {
    sendStatus(connId, 'error', err.message);
    teardownConn(connId);
  }

  return connId;
});

ipcMain.handle('ssh:write', (_evt, connId, data) => {
  const c = connections.get(connId);
  if (c && c.stream) c.stream.write(data);
});

ipcMain.handle('ssh:resize', (_evt, connId, cols, rows) => {
  const c = connections.get(connId);
  if (c && c.stream) c.stream.setWindow(rows, cols, 0, 0);
});

ipcMain.handle('ssh:disconnect', (_evt, connId) => {
  teardownConn(connId);
  sendStatus(connId, 'closed', '연결을 종료했습니다.');
});

// ---------- session CRUD ----------

ipcMain.handle('sessions:list', () => loadSessions().map(publicSession));

ipcMain.handle('sessions:save', (_evt, input) => {
  const sessions = loadSessions();
  const { password, passphrase, ...pub } = input;

  const applySecrets = (rec) => {
    if (rec.authMethod === 'key') {
      rec.password = '';
      if (passphrase) rec.passphrase = encryptSecret(passphrase);
      rec.keyPath = pub.keyPath || '';
    } else {
      rec.keyPath = '';
      rec.passphrase = '';
      if (password) rec.password = encryptSecret(password);
    }
  };

  let rec;
  if (pub.id) {
    rec = sessions.find((x) => x.id === pub.id);
    if (!rec) throw new Error('세션을 찾을 수 없습니다.');
    Object.assign(rec, pub);
    applySecrets(rec);
  } else {
    rec = { ...pub, id: crypto.randomUUID() };
    applySecrets(rec);
    sessions.push(rec);
  }
  writeJson(dataFile('sessions.json'), sessions);
  return publicSession(rec);
});

ipcMain.handle('sessions:delete', (_evt, id) => {
  const sessions = loadSessions().filter((s) => s.id !== id);
  writeJson(dataFile('sessions.json'), sessions);
  return true;
});

// ---------- settings ----------

const DEFAULT_SETTINGS = { theme: 'nord', fontSize: 14 };

ipcMain.handle('settings:get', () => ({
  ...DEFAULT_SETTINGS,
  ...readJson(dataFile('settings.json'), {}),
}));

ipcMain.handle('settings:save', (_evt, patch) => {
  const settings = { ...DEFAULT_SETTINGS, ...readJson(dataFile('settings.json'), {}), ...patch };
  writeJson(dataFile('settings.json'), settings);
  return settings;
});

// ---------- misc ----------

ipcMain.handle('pickKeyFile', async () => {
  const result = await dialog.showOpenDialog(win, {
    title: '개인 키 파일 선택',
    properties: ['openFile'],
    filters: [{ name: '키 파일', extensions: ['pem', 'key', 'id_rsa', 'id_ed25519', 'ppk'] }],
  });
  return result.canceled || result.filePaths.length === 0 ? '' : result.filePaths[0];
});

// ---------- window ----------

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 750,
    minWidth: 760,
    minHeight: 480,
    backgroundColor: '#1b1e27',
    autoHideMenuBar: true,
    title: 'LocalTerminal',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  for (const connId of [...connections.keys()]) teardownConn(connId);
});
