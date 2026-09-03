'use strict';
// Minimal ssh2 test server: password auth (testuser / testpass123), fake shell.
const { Server } = require('ssh2');
const fs = require('fs');
const os = require('os');
const path = require('path');

const HOST_KEY = (() => {
  // generate once and cache
  const cache = path.join(os.tmpdir(), 'lt-test-hostkey');
  if (fs.existsSync(cache)) return fs.readFileSync(cache);
  const { generateKeyPairSync } = require('crypto');
  const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048, privateKeyEncoding: { type: 'pkcs1', format: 'pem' }, publicKeyEncoding: { type: 'spki', format: 'pem' } });
  fs.writeFileSync(cache, privateKey);
  return privateKey;
})();

const server = new Server({
  hostKeys: [HOST_KEY],
}, (client) => {
  client.on('error', (err) => console.log('[server] client error:', err.message));
  client.on('authentication', (ctx) => {
    if (ctx.method === 'password' && ctx.username === 'testuser' && ctx.password === 'testpass123') ctx.accept();
    else ctx.reject(['password']);
  });
  client.on('ready', () => {
    client.on('session', (accept) => {
      const session = accept();
      let ptyInfo = { cols: 80, rows: 24 };
      session.on('pty', (accept2, reject, info) => { ptyInfo = info; accept2 && accept2(); });
      session.on('shell', (accept2) => {
        const stream = accept2();
        stream.write('Welcome to LocalTerminal TEST server\r\n');
        stream.write('cols=' + ptyInfo.cols + ' rows=' + ptyInfo.rows + ' term=' + ptyInfo.term + '\r\n');
        stream.write('$ ');
        stream.on('data', (d) => {
          const text = d.toString('utf8');
          console.log('[server] received input:', JSON.stringify(text));
          if (text.trim() === 'hello') stream.write('WORLD-REPLY\r\n$ ');
          else if (text.trim() === 'exit') { stream.write('bye\r\n'); stream.end(); stream.close(); }
          else stream.write('echo:' + text.replace(/\r?\n$/, '') + '\r\n$ ');
        });
      });
      session.on('window-change', (accept2, reject, info) => {
        console.log('[server] window-change cols=' + info.cols + ' rows=' + info.rows);
      });
    });
  });
});

server.listen(2222, '127.0.0.1', () => console.log('TEST SSH SERVER listening on 127.0.0.1:2222'));
