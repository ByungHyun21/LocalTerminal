'use strict';

const api = window.terminal;
const FitAddon = window.FitAddon.FitAddon;

// ---------- themes ----------

const THEMES = {
  nord: {
    label: 'Nord',
    term: {
      background: '#2e3440', foreground: '#d8dee9', cursor: '#d8dee9', cursorAccent: '#2e3440',
      selectionBackground: '#434c5e',
      black: '#3b4252', red: '#bf616a', green: '#a3be8c', yellow: '#ebcb8b',
      blue: '#81a1c1', magenta: '#b48ead', cyan: '#88c0d0', white: '#e5e9f0',
      brightBlack: '#4c566a', brightRed: '#bf616a', brightGreen: '#a3be8c', brightYellow: '#ebcb8b',
      brightBlue: '#81a1c1', brightMagenta: '#b48ead', brightCyan: '#8fbcbb', brightWhite: '#eceff4',
    },
    app: {
      '--bg': '#242933', '--panel': '#2e3440', '--panel2': '#353d4d', '--border': '#3b4252',
      '--text': '#d8dee9', '--muted': '#7b88a1', '--accent': '#88c0d0', '--accent-text': '#2e3440',
      '--input': '#232834', '--danger': '#bf616a', '--term-bg': '#2e3440',
    },
  },
  dracula: {
    label: 'Dracula',
    term: {
      background: '#282a36', foreground: '#f8f8f2', cursor: '#f8f8f2', cursorAccent: '#282a36',
      selectionBackground: '#44475a',
      black: '#21222c', red: '#ff5555', green: '#50fa7b', yellow: '#f1fa8c',
      blue: '#bd93f9', magenta: '#ff79c6', cyan: '#8be9fd', white: '#f8f8f2',
      brightBlack: '#6272a4', brightRed: '#ff6e6e', brightGreen: '#69ff94', brightYellow: '#ffffa5',
      brightBlue: '#d6acff', brightMagenta: '#ff92df', brightCyan: '#a4ffff', brightWhite: '#ffffff',
    },
    app: {
      '--bg': '#21222c', '--panel': '#282a36', '--panel2': '#343746', '--border': '#44475a',
      '--text': '#f8f8f2', '--muted': '#6272a4', '--accent': '#bd93f9', '--accent-text': '#282a36',
      '--input': '#21222c', '--danger': '#ff5555', '--term-bg': '#282a36',
    },
  },
  'tokyo-night': {
    label: 'Tokyo Night',
    term: {
      background: '#1a1b26', foreground: '#a9b1d6', cursor: '#c0caf5', cursorAccent: '#1a1b26',
      selectionBackground: '#33467c',
      black: '#32344a', red: '#f7768e', green: '#9ece6a', yellow: '#e0af68',
      blue: '#7aa2f7', magenta: '#ad8ee6', cyan: '#7dcfff', white: '#a9b1d6',
      brightBlack: '#444b6a', brightRed: '#ff7a93', brightGreen: '#b9f27c', brightYellow: '#ff9e64',
      brightBlue: '#7da6ff', brightMagenta: '#bb9af7', brightCyan: '#0db9d7', brightWhite: '#c0caf5',
    },
    app: {
      '--bg': '#16161e', '--panel': '#1a1b26', '--panel2': '#1f2335', '--border': '#292e42',
      '--text': '#a9b1d6', '--muted': '#565f89', '--accent': '#7aa2f7', '--accent-text': '#1a1b26',
      '--input': '#101014', '--danger': '#f7768e', '--term-bg': '#1a1b26',
    },
  },
  'catppuccin-mocha': {
    label: 'Catppuccin Mocha',
    term: {
      background: '#1e1e2e', foreground: '#cdd6f4', cursor: '#f5e0dc', cursorAccent: '#1e1e2e',
      selectionBackground: '#45475a',
      black: '#45475a', red: '#f38ba8', green: '#a6e3a1', yellow: '#f9e2af',
      blue: '#89b4fa', magenta: '#f5c2e7', cyan: '#94e2d5', white: '#bac2de',
      brightBlack: '#585b70', brightRed: '#f38ba8', brightGreen: '#a6e3a1', brightYellow: '#f9e2af',
      brightBlue: '#89b4fa', brightMagenta: '#f5c2e7', brightCyan: '#94e2d5', brightWhite: '#a6e8d5',
    },
    app: {
      '--bg': '#181825', '--panel': '#1e1e2e', '--panel2': '#262637', '--border': '#313244',
      '--text': '#cdd6f4', '--muted': '#6c7086', '--accent': '#cba6f7', '--accent-text': '#1e1e2e',
      '--input': '#11111b', '--danger': '#f38ba8', '--term-bg': '#1e1e2e',
    },
  },
  'gruvbox-dark': {
    label: 'Gruvbox Dark',
    term: {
      background: '#282828', foreground: '#ebdbb2', cursor: '#ebdbb2', cursorAccent: '#282828',
      selectionBackground: '#32302f',
      black: '#282828', red: '#cc241d', green: '#98971a', yellow: '#d79921',
      blue: '#458588', magenta: '#b16286', cyan: '#689d6a', white: '#a89984',
      brightBlack: '#928374', brightRed: '#fb4934', brightGreen: '#b8bb26', brightYellow: '#fabd2f',
      brightBlue: '#83a598', brightMagenta: '#d3869b', brightCyan: '#8ec07c', brightWhite: '#fbf1c7',
    },
    app: {
      '--bg': '#1d2021', '--panel': '#282828', '--panel2': '#32302f', '--border': '#3c3836',
      '--text': '#ebdbb2', '--muted': '#928374', '--accent': '#fabd2f', '--accent-text': '#282828',
      '--input': '#1d2021', '--danger': '#fb4934', '--term-bg': '#282828',
    },
  },
  'one-dark': {
    label: 'One Dark',
    term: {
      background: '#282c34', foreground: '#abb2bf', cursor: '#abb2bf', cursorAccent: '#282c34',
      selectionBackground: '#3e4451',
      black: '#282c34', red: '#e06c75', green: '#98c379', yellow: '#e5c07b',
      blue: '#61afef', magenta: '#c678dd', cyan: '#56b6c2', white: '#abb2bf',
      brightBlack: '#5c6370', brightRed: '#e06c75', brightGreen: '#98c379', brightYellow: '#e5c07b',
      brightBlue: '#61afef', brightMagenta: '#c678dd', brightCyan: '#56b6c2', brightWhite: '#ffffff',
    },
    app: {
      '--bg': '#21252b', '--panel': '#282c34', '--panel2': '#333842', '--border': '#3e4451',
      '--text': '#abb2bf', '--muted': '#5c6370', '--accent': '#61afef', '--accent-text': '#282c34',
      '--input': '#21252b', '--danger': '#e06c75', '--term-bg': '#282c34',
    },
  },
  monokai: {
    label: 'Monokai',
    term: {
      background: '#272822', foreground: '#f8f8f2', cursor: '#f8f8f2', cursorAccent: '#272822',
      selectionBackground: '#49483e',
      black: '#272822', red: '#f92672', green: '#a6e22e', yellow: '#f4bf75',
      blue: '#66d9ef', magenta: '#ae81ff', cyan: '#a1efe4', white: '#f8f8f2',
      brightBlack: '#75715e', brightRed: '#f92672', brightGreen: '#a6e22e', brightYellow: '#f4bf75',
      brightBlue: '#66d9ef', brightMagenta: '#ae81ff', brightCyan: '#a1efe4', brightWhite: '#f9f8f5',
    },
    app: {
      '--bg': '#1e1f1c', '--panel': '#272822', '--panel2': '#31322c', '--border': '#49483e',
      '--text': '#f8f8f2', '--muted': '#75715e', '--accent': '#66d9ef', '--accent-text': '#272822',
      '--input': '#1e1f1c', '--danger': '#f92672', '--term-bg': '#272822',
    },
  },
  'solarized-dark': {
    label: 'Solarized Dark',
    term: {
      background: '#002b36', foreground: '#839496', cursor: '#93a1a1', cursorAccent: '#002b36',
      selectionBackground: '#073642',
      black: '#073642', red: '#dc322f', green: '#859900', yellow: '#b58900',
      blue: '#268bd2', magenta: '#d33682', cyan: '#2aa198', white: '#eee8d5',
      brightBlack: '#586e75', brightRed: '#cb4b16', brightGreen: '#586e75', brightYellow: '#657b83',
      brightBlue: '#839496', brightMagenta: '#6c71c4', brightCyan: '#93a1a1', brightWhite: '#fdf6e3',
    },
    app: {
      '--bg': '#00212a', '--panel': '#002b36', '--panel2': '#073642', '--border': '#0b4a5a',
      '--text': '#93a1a1', '--muted': '#586e75', '--accent': '#268bd2', '--accent-text': '#002b36',
      '--input': '#001f27', '--danger': '#dc322f', '--term-bg': '#002b36',
    },
  },
  'kanagawa': {
    label: 'Kanagawa',
    term: {
      background: '#1f1f28', foreground: '#dcd7ba', cursor: '#c8c093', cursorAccent: '#1f1f28',
      selectionBackground: '#2a2a37',
      black: '#090618', red: '#c34043', green: '#76946a', yellow: '#c0a36e',
      blue: '#7e9cd8', magenta: '#957fb8', cyan: '#6a9589', white: '#c8c093',
      brightBlack: '#727169', brightRed: '#e82424', brightGreen: '#98bc6a', brightYellow: '#e6c384',
      brightBlue: '#7fb4ca', brightMagenta: '#d3869b', brightCyan: '#7aa89f', brightWhite: '#dcd7ba',
    },
    app: {
      '--bg': '#16161d', '--panel': '#1f1f28', '--panel2': '#25252e', '--border': '#2a2a37',
      '--text': '#dcd7ba', '--muted': '#727169', '--accent': '#7e9cd8', '--accent-text': '#1f1f28',
      '--input': '#16161d', '--danger': '#c34043', '--term-bg': '#1f1f28',
    },
  },
  'everforest': {
    label: 'Everforest Dark',
    term: {
      background: '#2d353b', foreground: '#d3c6aa', cursor: '#d3c6aa', cursorAccent: '#2d353b',
      selectionBackground: '#3d484d',
      black: '#4f585e', red: '#e67e80', green: '#a7c080', yellow: '#dbbc7f',
      blue: '#7fbbb3', magenta: '#d699b6', cyan: '#83c092', white: '#d3c6aa',
      brightBlack: '#9da9a0', brightRed: '#e67e80', brightGreen: '#a7c080', brightYellow: '#dbbc7f',
      brightBlue: '#7fbbb3', brightMagenta: '#d699b6', brightCyan: '#83c092', brightWhite: '#fdf6e3',
    },
    app: {
      '--bg': '#272e33', '--panel': '#2d353b', '--panel2': '#343f44', '--border': '#3d484d',
      '--text': '#d3c6aa', '--muted': '#859289', '--accent': '#a7c080', '--accent-text': '#2d353b',
      '--input': '#222829', '--danger': '#e67e80', '--term-bg': '#2d353b',
    },
  },
  'ayu-dark': {
    label: 'Ayu Dark',
    term: {
      background: '#0b0e14', foreground: '#bfbdb6', cursor: '#e6b673', cursorAccent: '#0b0e14',
      selectionBackground: '#1f2430',
      black: '#01060e', red: '#d95757', green: '#6ad67a', yellow: '#ffb454',
      blue: '#6caaef', magenta: '#d285c6', cyan: '#4dc9b0', white: '#bfbdb6',
      brightBlack: '#686868', brightRed: '#f26d78', brightGreen: '#a3e2a3', brightYellow: '#ffd479',
      brightBlue: '#92c9f1', brightMagenta: '#ffa7f3', brightCyan: '#74e6d4', brightWhite: '#ffffff',
    },
    app: {
      '--bg': '#0d1017', '--panel': '#0b0e14', '--panel2': '#131721', '--border': '#1d2432',
      '--text': '#bfbdb6', '--muted': '#565b66', '--accent': '#ffb454', '--accent-text': '#0b0e14',
      '--input': '#0b0e14', '--danger': '#d95757', '--term-bg': '#0b0e14',
    },
  },
  'solarized-light': {
    label: 'Solarized Light',
    term: {
      background: '#fdf6e3', foreground: '#586e75', cursor: '#586e75', cursorAccent: '#fdf6e3',
      selectionBackground: '#eee8d5',
      black: '#eee8d5', red: '#dc322f', green: '#859900', yellow: '#b58900',
      blue: '#268bd2', magenta: '#d33682', cyan: '#2aa198', white: '#073642',
      brightBlack: '#93a1a1', brightRed: '#cb4b16', brightGreen: '#586e75', brightYellow: '#657b83',
      brightBlue: '#839496', brightMagenta: '#6c71c4', brightCyan: '#93a1a1', brightWhite: '#002b36',
    },
    app: {
      '--bg': '#eee8d5', '--panel': '#fdf6e3', '--panel2': '#f2ecd9', '--border': '#ddd6c1',
      '--text': '#586e75', '--muted': '#93a1a1', '--accent': '#268bd2', '--accent-text': '#fdf6e3',
      '--input': '#f5efdc', '--danger': '#dc322f', '--term-bg': '#fdf6e3',
    },
  },
};

const DEFAULT_FONT_SIZE = 14;
const MIN_FONT = 8;
const MAX_FONT = 32;
const FONT_STACK = '"Cascadia Mono", Consolas, "Courier New", monospace';

// ---------- state ----------

let sessions = [];
let settings = { theme: 'nord', fontSize: DEFAULT_FONT_SIZE };
let paneRoot = null; // {kind:'pane',paneId} | {kind:'split',dir:'h'|'v',children:[],sizes:[]}
let activePaneId = null;
let paneSeq = 0;
let lang = 'ko';
const panes = new Map(); // paneId -> pane

// ---------- dom ----------

const $ = (id) => document.getElementById(id);
const els = {
  list: $('sessionList'),
  btnNew: $('btnNew'),
  statusDot: $('statusDot'),
  statusText: $('statusText'),
  themeSelect: $('themeSelect'),
  fontMinus: $('fontMinus'),
  fontPlus: $('fontPlus'),
  fontSizeLabel: $('fontSizeLabel'),
  btnDisconnect: $('btnDisconnect'),
  paneArea: $('paneArea'),
  panes: $('panes'),
  overlay: $('overlay'),
  overlayMsg: $('overlayMsg'),
  langFlag: $('langFlag'),
  ctxMenu: $('ctxMenu'),
  ctxCopy: $('ctxCopy'),
  ctxPaste: $('ctxPaste'),
  btnHideSidebar: $('btnHideSidebar'),
  btnShowSidebar: $('btnShowSidebar'),
  langMenu: $('langMenu'),
  btnLang: $('btnLang'),
  backdrop: $('dialogBackdrop'),
  form: $('sessionForm'),
  dialogTitle: $('dialogTitle'),
  authMethod: $('authMethod'),
  passwordField: $('passwordField'),
  keyFields: $('keyFields'),
  btnBrowse: $('btnBrowse'),
  btnCancel: $('btnCancel'),
};

// ---------- theme / font ----------

function applyThemeVars(name) {
  const theme = THEMES[name] || THEMES.nord;
  const root = document.documentElement.style;
  for (const [key, value] of Object.entries(theme.app)) root.setProperty(key, value);
}

function applyTheme(name) {
  const key = THEMES[name] ? name : 'nord';
  applyThemeVars(key);
  settings.theme = key;
  for (const p of panes.values()) {
    if (p.term) p.term.options.theme = THEMES[key].term;
  }
  els.themeSelect.value = key;
  api.saveSettings({ theme: key }).catch(console.error);
}

function setFontSize(size) {
  const clamped = Math.min(MAX_FONT, Math.max(MIN_FONT, size));
  settings.fontSize = clamped;
  for (const p of panes.values()) {
    if (!p.term) continue;
    p.term.options.fontSize = clamped;
    try { p.fit && p.fit.fit(); } catch { /* not in DOM yet */ }
    if (p.connId) api.resize(p.connId, p.term.cols, p.term.rows).catch(console.error);
  }
  els.fontSizeLabel.textContent = String(clamped);
  api.saveSettings({ fontSize: clamped }).catch(console.error);
}

function adjustFont(delta) {
  setFontSize(settings.fontSize + delta);
}

// ---------- pane tree ----------

// ---------- i18n ----------

const LOCALES = {
  en: {
    label: 'English', flag: 'flags/us.svg',
    strings: {
      'lang.title': 'Language',
      'sidebar.title': 'SSH Sessions',
      'sidebar.new': 'New session',
      'sidebar.hide': '« Hide sessions',
      'sidebar.show': 'Show sessions',
      'context.copy': 'Copy',
      'context.paste': 'Paste',
      'toolbar.theme': 'Theme',
      'toolbar.fontSize': 'Font size',
      'toolbar.fontMinus': 'Smaller (Ctrl + -)',
      'toolbar.fontPlus': 'Bigger (Ctrl + =)',
      'toolbar.disconnect': 'Disconnect active pane',
      'status.noConnection': 'Not connected',
      'status.connecting': '{name} connecting…',
      'status.connected': '{name} · connected',
      'status.emptyPane': 'Empty pane — double-click a session',
      'overlay.msg': '<b>Double-click</b> a session on the left to connect in the active pane.<br>If it is busy, a <b>new pane opens to the right</b>.',
      'pane.empty': 'Empty terminal',
      'pane.connectingSuffix': '…connecting',
      'pane.errorSuffix': '— error',
      'pane.splitH': 'Split right',
      'pane.splitV': 'Split down',
      'pane.close': 'Close pane',
      'dialog.new': 'New session',
      'dialog.edit': 'Edit session',
      'dialog.name': 'Name',
      'dialog.namePh': 'My server',
      'dialog.host': 'Host *',
      'dialog.hostPh': '192.168.0.10',
      'dialog.port': 'Port',
      'dialog.user': 'Username *',
      'dialog.userPh': 'root',
      'dialog.auth': 'Auth method',
      'dialog.authPassword': 'Password',
      'dialog.authKey': 'Private key',
      'dialog.password': 'Password *',
      'dialog.keyFile': 'Key file *',
      'dialog.keyFilePh': 'C:\\Users\\me\\.ssh\\id_rsa',
      'dialog.browse': 'Browse…',
      'dialog.passphrase': 'Passphrase',
      'dialog.passphrasePh': 'Leave empty if none',
      'dialog.savedPh': 'Saved — enter only to change',
      'dialog.cancel': 'Cancel',
      'dialog.save': 'Save',
      'dialog.pwRequired': 'Enter a password',
      'dialog.saveFailed': 'Save failed: ',
      'session.edit': 'Edit',
      'session.delete': 'Delete',
      'session.deleteConfirm': 'Delete session "{name}"?',
    },
  },
  ko: {
    label: '한국어', flag: 'flags/kr.svg',
    strings: {
      'lang.title': '언어',
      'sidebar.title': 'SSH 세션',
      'sidebar.new': '새 세션 추가',
      'sidebar.hide': '« 세션 목록 숨기기',
      'sidebar.show': '세션 목록 보이기',
      'context.copy': '복사',
      'context.paste': '붙여넣기',
      'toolbar.theme': '테마',
      'toolbar.fontSize': '글자 크기',
      'toolbar.fontMinus': '글자 작게 (Ctrl + -)',
      'toolbar.fontPlus': '글자 크게 (Ctrl + =)',
      'toolbar.disconnect': '활성 창 연결 끊기',
      'status.noConnection': '연결 없음',
      'status.connecting': '{name} 연결 중...',
      'status.connected': '{name} · 연결됨',
      'status.emptyPane': '빈 터미널 — 세션을 더블클릭하세요',
      'overlay.msg': '왼쪽에서 세션을 <b>더블클릭</b>하면 활성 창에 연결됩니다.<br>활성 창이 사용 중이면 <b>오른쪽에 새 창</b>을 만들어 연결합니다.',
      'pane.empty': '빈 터미널',
      'pane.connectingSuffix': '…연결 중',
      'pane.errorSuffix': '— 오류',
      'pane.splitH': '오른쪽으로 분할',
      'pane.splitV': '아래로 분할',
      'pane.close': '창 닫기',
      'dialog.new': '새 세션',
      'dialog.edit': '세션 편집',
      'dialog.name': '이름',
      'dialog.namePh': '내 서버',
      'dialog.host': '호스트 *',
      'dialog.hostPh': '192.168.0.10',
      'dialog.port': '포트',
      'dialog.user': '사용자 *',
      'dialog.userPh': 'root',
      'dialog.auth': '인증 방식',
      'dialog.authPassword': '비밀번호',
      'dialog.authKey': '개인 키',
      'dialog.password': '비밀번호 *',
      'dialog.keyFile': '키 파일 *',
      'dialog.keyFilePh': 'C:\\Users\\me\\.ssh\\id_rsa',
      'dialog.browse': '찾아보기',
      'dialog.passphrase': '패스프레이즈',
      'dialog.passphrasePh': '없으면 비워 두세요',
      'dialog.savedPh': '저장됨 — 변경할 때만 입력',
      'dialog.cancel': '취소',
      'dialog.save': '저장',
      'dialog.pwRequired': '비밀번호를 입력하세요',
      'dialog.saveFailed': '저장 실패: ',
      'session.edit': '편집',
      'session.delete': '삭제',
      'session.deleteConfirm': '"{name}" 세션을 삭제할까요?',
    },
  },
  ja: {
    label: '日本語', flag: 'flags/jp.svg',
    strings: {
      'lang.title': '言語',
      'sidebar.title': 'SSH セッション',
      'sidebar.new': '新しいセッション',
      'sidebar.hide': '« セッション一覧を隠す',
      'sidebar.show': 'セッション一覧を表示',
      'context.copy': 'コピー',
      'context.paste': '貼り付け',
      'toolbar.theme': 'テーマ',
      'toolbar.fontSize': '文字サイズ',
      'toolbar.fontMinus': '小さく (Ctrl + -)',
      'toolbar.fontPlus': '大きく (Ctrl + =)',
      'toolbar.disconnect': 'アクティブペーンを切断',
      'status.noConnection': '接続なし',
      'status.connecting': '{name} 接続中…',
      'status.connected': '{name} · 接続済み',
      'status.emptyPane': '空のペーン — セッションをダブルクリック',
      'overlay.msg': '左のセッションを<b>ダブルクリック</b>するとアクティブペーンに接続します。<br>使用中の場合は<b>右に新しいペーン</b>を作成して接続します。',
      'pane.empty': '空のターミナル',
      'pane.connectingSuffix': '…接続中',
      'pane.errorSuffix': '— エラー',
      'pane.splitH': '右に分割',
      'pane.splitV': '下に分割',
      'pane.close': 'ペーンを閉じる',
      'dialog.new': '新しいセッション',
      'dialog.edit': 'セッション編集',
      'dialog.name': '名前',
      'dialog.namePh': 'マイサーバー',
      'dialog.host': 'ホスト *',
      'dialog.hostPh': '192.168.0.10',
      'dialog.port': 'ポート',
      'dialog.user': 'ユーザー名 *',
      'dialog.userPh': 'root',
      'dialog.auth': '認証方式',
      'dialog.authPassword': 'パスワード',
      'dialog.authKey': '秘密鍵',
      'dialog.password': 'パスワード *',
      'dialog.keyFile': '鍵ファイル *',
      'dialog.keyFilePh': 'C:\\Users\\me\\.ssh\\id_rsa',
      'dialog.browse': '参照…',
      'dialog.passphrase': 'パスフレーズ',
      'dialog.passphrasePh': 'なければ空欄',
      'dialog.savedPh': '保存済み — 変更時のみ入力',
      'dialog.cancel': 'キャンセル',
      'dialog.save': '保存',
      'dialog.pwRequired': 'パスワードを入力してください',
      'dialog.saveFailed': '保存に失敗: ',
      'session.edit': '編集',
      'session.delete': '削除',
      'session.deleteConfirm': 'セッション「{name}」を削除しますか？',
    },
  },
  zh: {
    label: '中文', flag: 'flags/cn.svg',
    strings: {
      'lang.title': '语言',
      'sidebar.title': 'SSH 会话',
      'sidebar.new': '新建会话',
      'sidebar.hide': '« 隐藏会话列表',
      'sidebar.show': '显示会话列表',
      'context.copy': '复制',
      'context.paste': '粘贴',
      'toolbar.theme': '主题',
      'toolbar.fontSize': '字体大小',
      'toolbar.fontMinus': '缩小 (Ctrl + -)',
      'toolbar.fontPlus': '放大 (Ctrl + =)',
      'toolbar.disconnect': '断开当前窗格',
      'status.noConnection': '未连接',
      'status.connecting': '{name} 连接中…',
      'status.connected': '{name} · 已连接',
      'status.emptyPane': '空窗格 — 双击会话连接',
      'overlay.msg': '<b>双击</b>左侧会话即可连接到当前窗格。<br>若窗格正被占用，会在<b>右侧新建窗格</b>连接。',
      'pane.empty': '空终端',
      'pane.connectingSuffix': '…连接中',
      'pane.errorSuffix': '— 错误',
      'pane.splitH': '向右分割',
      'pane.splitV': '向下分割',
      'pane.close': '关闭窗格',
      'dialog.new': '新建会话',
      'dialog.edit': '编辑会话',
      'dialog.name': '名称',
      'dialog.namePh': '我的服务器',
      'dialog.host': '主机 *',
      'dialog.hostPh': '192.168.0.10',
      'dialog.port': '端口',
      'dialog.user': '用户名 *',
      'dialog.userPh': 'root',
      'dialog.auth': '认证方式',
      'dialog.authPassword': '密码',
      'dialog.authKey': '私钥',
      'dialog.password': '密码 *',
      'dialog.keyFile': '密钥文件 *',
      'dialog.keyFilePh': 'C:\\Users\\me\\.ssh\\id_rsa',
      'dialog.browse': '浏览…',
      'dialog.passphrase': '口令',
      'dialog.passphrasePh': '没有请留空',
      'dialog.savedPh': '已保存 — 仅修改时输入',
      'dialog.cancel': '取消',
      'dialog.save': '保存',
      'dialog.pwRequired': '请输入密码',
      'dialog.saveFailed': '保存失败：',
      'session.edit': '编辑',
      'session.delete': '删除',
      'session.deleteConfirm': '删除会话 “{name}”？',
    },
  },
};

function T(key, vars) {
  const table = (LOCALES[lang] || LOCALES.ko).strings;
  let s = table[key] != null ? table[key] : (LOCALES.en.strings[key] != null ? LOCALES.en.strings[key] : key);
  if (vars) {
    for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v));
  }
  return s;
}

function setSidebar(hidden, { persist = true } = {}) {
  document.getElementById('sidebar').classList.toggle('collapsed', hidden);
  els.btnShowSidebar.hidden = !hidden;
  if (persist) api.saveSettings({ sidebarHidden: hidden }).catch(console.error);
  // pane ResizeObservers fire during/after the width transition and refit terminals
}

// ---------- right-click context menu (copy / paste) ----------

let ctxPaneId = null;

function hideCtxMenu() {
  els.ctxMenu.hidden = true;
  ctxPaneId = null;
}

function showCtxMenu(pane, x, y) {
  ctxPaneId = pane ? pane.id : null;
  els.ctxCopy.disabled = !pane || !pane.term || !pane.term.hasSelection();
  els.ctxPaste.disabled = !pane || !pane.connId;
  els.ctxMenu.hidden = false;
  const mw = els.ctxMenu.offsetWidth || 150;
  const mh = els.ctxMenu.offsetHeight || 66;
  els.ctxMenu.style.left = `${Math.max(4, Math.min(x, window.innerWidth - mw - 4))}px`;
  els.ctxMenu.style.top = `${Math.max(4, Math.min(y, window.innerHeight - mh - 4))}px`;
}

function ctxCopyAction() {
  const pane = panes.get(ctxPaneId);
  if (!pane || !pane.term) return;
  const text = pane.term.getSelection();
  if (text) api.writeClipboard(text).catch(console.error);
}

async function ctxPasteAction() {
  const pane = panes.get(ctxPaneId);
  if (!pane || !pane.connId) return;
  try {
    const text = await api.readClipboard();
    if (text) pane.term.paste(text);
  } catch (err) {
    console.error(err);
  }
}


function applyLang(l) {
  lang = LOCALES[l] ? l : 'ko';
  document.documentElement.lang = lang;
  els.langFlag.src = LOCALES[lang].flag;
  for (const el of document.querySelectorAll('[data-i18n]')) {
    el.textContent = T(el.dataset.i18n);
  }
  for (const el of document.querySelectorAll('[data-i18n-title]')) {
    el.title = T(el.dataset.i18nTitle);
  }
  for (const el of document.querySelectorAll('[data-i18n-ph]')) {
    el.placeholder = T(el.dataset.i18nPh);
  }
  els.overlayMsg.innerHTML = T('overlay.msg');
  renderList();
  for (const p of panes.values()) updatePaneHeader(p);
  updateToolbarStatus();
  els.langMenu.hidden = true;
  api.saveSettings({ lang }).catch(console.error);
}

function createPane() {
  const id = `p${++paneSeq}`;
  const el = document.createElement('div');
  el.className = 'pane';
  el.dataset.id = id;
  el.innerHTML = `
    <div class="pane-header">
      <span class="pane-dot dot"></span>
      <span class="pane-title"></span>
      <span class="pane-actions">
        <button type="button" class="icon-btn" data-act="split-h" data-i18n-title="pane.splitH" title="">◫</button>
        <button type="button" class="icon-btn" data-act="split-v" data-i18n-title="pane.splitV" title="">⊟</button>
        <button type="button" class="icon-btn" data-act="close" data-i18n-title="pane.close" title="">✕</button>
      </span>
    </div>
    <div class="pane-term"></div>`;

  const pane = {
    id, el,
    termEl: el.querySelector('.pane-term'),
    dotEl: el.querySelector('.pane-dot'),
    titleEl: el.querySelector('.pane-title'),
    term: null, fit: null, ro: null,
    sessionId: null, connId: null, status: 'idle', errorMsg: '',
  };

  el.querySelector('[data-act="split-h"]').title = T('pane.splitH');
  el.querySelector('[data-act="split-v"]').title = T('pane.splitV');
  el.querySelector('[data-act="close"]').title = T('pane.close');
  pane.titleEl.textContent = T('pane.empty');
  el.addEventListener('mousedown', () => setActive(id), true);
  el.querySelector('[data-act="split-h"]').addEventListener('click', () => splitPane('h'));
  el.querySelector('[data-act="split-v"]').addEventListener('click', () => splitPane('v'));
  el.querySelector('[data-act="close"]').addEventListener('click', () => closePane(id));
  pane.titleEl.addEventListener('dblclick', () => {
    if (pane.sessionId) connectPane(pane, pane.sessionId);
  });

  panes.set(id, pane);
  return pane;
}

function containsPane(node, paneId) {
  if (node.kind === 'pane') return node.paneId === paneId;
  return node.children.some((c) => containsPane(c, paneId));
}

function replaceInTree(node, targetPaneId, replacement) {
  if (node.kind === 'pane') return node.paneId === targetPaneId ? replacement : node;
  const idx = node.children.findIndex((c) => containsPane(c, targetPaneId));
  if (idx === -1) return node;
  node.children[idx] = replaceInTree(node.children[idx], targetPaneId, replacement);
  return node;
}

function removeFromTree(node, paneId) {
  if (node.kind === 'pane') return node.paneId === paneId ? null : node;
  const children = [];
  const sizes = [];
  node.children.forEach((c, i) => {
    const r = removeFromTree(c, paneId);
    if (r) { children.push(r); sizes.push(node.sizes[i]); }
  });
  if (children.length === 0) return null;
  if (children.length === 1) return children[0];
  return { kind: 'split', dir: node.dir, children, sizes };
}

function buildNodeDom(node) {
  if (node.kind === 'pane') return panes.get(node.paneId).el;
  const div = document.createElement('div');
  div.className = `split ${node.dir}`;
  node.children.forEach((child, i) => {
    if (i > 0) div.appendChild(buildSplitter(node, i - 1));
    const childEl = buildNodeDom(child);
    const w = node.sizes[i];
    childEl.style.flex = `${w} ${w} 0`;
    div.appendChild(childEl);
  });
  return div;
}

function buildSplitter(node, i) {
  const s = document.createElement('div');
  s.className = `splitter ${node.dir}`;
  s.addEventListener('mousedown', (e) => startSplitDrag(e, node, i, s));
  return s;
}

function startSplitDrag(e, node, i, splitterEl) {
  e.preventDefault();
  const container = splitterEl.parentElement;
  const horizontal = node.dir === 'h';
  const total = horizontal ? container.clientWidth : container.clientHeight;
  const startPos = horizontal ? e.clientX : e.clientY;
  const startA = node.sizes[i];
  const startB = node.sizes[i + 1];
  const pairSum = startA + startB;
  const splitterSpace = 7 * (node.children.length - 1);
  const usable = Math.max(50, total - splitterSpace);
  const childEls = [...container.children].filter((el) => !el.classList.contains('splitter'));

  function onMove(ev) {
    const px = (horizontal ? ev.clientX : ev.clientY) - startPos;
    const delta = (px / usable) * pairSum;
    const a = Math.min(pairSum - 5, Math.max(5, startA + delta));
    node.sizes[i] = a;
    node.sizes[i + 1] = pairSum - a;
    childEls[i].style.flex = `${node.sizes[i]} ${node.sizes[i]} 0`;
    childEls[i + 1].style.flex = `${node.sizes[i + 1]} ${node.sizes[i + 1]} 0`;
  }
  function onUp() {
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseup', onUp);
  }
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
}

function renderLayout() {
  els.panes.innerHTML = '';
  if (paneRoot) {
    const rootEl = buildNodeDom(paneRoot);
    // Root must never fall back to content sizing (flex-basis auto makes the
    // pane width depend on the terminal's own rendered width -> shrink loop).
    rootEl.style.flex = '1 1 0';
    els.panes.appendChild(rootEl);
  }
  for (const p of panes.values()) createTerminalFor(p);
  updateOverlayVisibility();
}

function createTerminalFor(pane) {
  if (pane.term || !document.body.contains(pane.el)) return;
  const t = new window.Terminal({
    fontFamily: FONT_STACK,
    fontSize: settings.fontSize,
    theme: THEMES[settings.theme].term,
    cursorBlink: true,
    scrollback: 5000,
  });
  const f = new FitAddon();
  t.loadAddon(f);
  t.open(pane.termEl);
  pane.term = t;
  pane.fit = f;
  try { f.fit(); } catch { /* zero size during layout */ }

  t.onData((d) => {
    if (pane.connId) api.write(pane.connId, d).catch(console.error);
  });
  if (t.textarea) {
    t.textarea.addEventListener('focus', () => setActive(pane.id));
  }
  t.attachCustomKeyEventHandler((ev) => paneKeyHandler(pane, ev));

  pane.ro = new ResizeObserver(() => {
    if (!pane.fit) return;
    try { pane.fit.fit(); } catch { /* transient zero size */ }
    if (pane.connId && pane.term) api.resize(pane.connId, pane.term.cols, pane.term.rows).catch(console.error);
  });
  pane.ro.observe(pane.el);
}

function splitPane(dir) {
  if (!paneRoot) {
    const pane = createPane();
    paneRoot = { kind: 'pane', paneId: pane.id };
    renderLayout();
    setActive(pane.id);
    return pane;
  }
  const target = panes.get(activePaneId) || [...panes.values()][panes.size - 1];
  if (!target) return null;
  const newPane = createPane();
  const split = {
    kind: 'split', dir,
    children: [{ kind: 'pane', paneId: target.id }, { kind: 'pane', paneId: newPane.id }],
    sizes: [50, 50],
  };
  paneRoot = replaceInTree(paneRoot, target.id, split);
  renderLayout();
  setActive(newPane.id);
  return newPane;
}

function closePane(id) {
  const p = panes.get(id);
  if (!p) return;
  if (p.connId) api.disconnect(p.connId).catch(console.error);
  if (p.ro) p.ro.disconnect();
  if (p.term) p.term.dispose();
  panes.delete(id);
  if (paneRoot) paneRoot = removeFromTree(paneRoot, id);
  if (activePaneId === id || !panes.has(activePaneId)) {
    activePaneId = panes.size ? [...panes.keys()][panes.size - 1] : null;
  }
  renderLayout();
  if (activePaneId) setActive(activePaneId);
  else updateToolbarStatus();
}

function setActive(id) {
  activePaneId = id;
  for (const p of panes.values()) p.el.classList.toggle('active', p.id === id);
  updateToolbarStatus();
}

// ---------- focus navigation (Alt + arrows) ----------

function focusDirection(dir) {
  const cur = panes.get(activePaneId);
  if (!cur) return;
  const cr = cur.el.getBoundingClientRect();
  let best = null;
  let bestScore = Infinity;
  for (const p of panes.values()) {
    if (p.id === activePaneId) continue;
    const r = p.el.getBoundingClientRect();
    let main;
    let overlap;
    if (dir === 'right' || dir === 'left') {
      main = dir === 'right' ? r.left - cr.right : cr.left - r.right;
      overlap = Math.min(r.bottom, cr.bottom) - Math.max(r.top, cr.top);
    } else {
      main = dir === 'down' ? r.top - cr.bottom : cr.top - r.bottom;
      overlap = Math.min(r.right, cr.right) - Math.max(r.left, cr.left);
    }
    if (main < -2) continue;
    const score = Math.max(main, 0) + (overlap > 0 ? 0 : 10000) + Math.abs(main) * 0.001;
    if (score < bestScore) { bestScore = score; best = p; }
  }
  if (best) {
    setActive(best.id);
    if (best.term) best.term.focus();
  }
}

function paneKeyHandler(pane, ev) {
  if (ev.type !== 'keydown') return true;
  if (ev.altKey && !ev.ctrlKey && !ev.shiftKey
      && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(ev.key)) {
    ev.preventDefault();
    focusDirection(ev.key.replace('Arrow', '').toLowerCase());
    return false;
  }
  if (ev.ctrlKey && !ev.shiftKey && !ev.altKey
      && (ev.key === '=' || ev.key === '+' || ev.key === '-' || ev.key === '0')) {
    ev.preventDefault();
    if (ev.key === '0') setFontSize(DEFAULT_FONT_SIZE);
    else adjustFont(ev.key === '-' ? -1 : 1);
    return false;
  }
  return true;
}

// ---------- pane status ----------

function sessionLabel(pane) {
  const s = sessions.find((x) => x.id === pane.sessionId);
  if (!s) return T('pane.empty');
  return s.name || s.host;
}

function updatePaneHeader(pane) {
  const label = sessionLabel(pane);
  let title = label;
  if (pane.status === 'connecting') title = label + ' ' + T('pane.connectingSuffix');
  else if (pane.status === 'error') title = label + ' ' + T('pane.errorSuffix');
  pane.titleEl.textContent = title;
  pane.titleEl.title = pane.errorMsg || label;
  pane.dotEl.className = `pane-dot dot${pane.status === 'connecting' ? ' connecting' : pane.status === 'connected' ? ' connected' : pane.status === 'error' ? ' error' : ''}`;
}

function updateToolbarStatus() {
  const pane = panes.get(activePaneId);
  els.btnDisconnect.hidden = !(pane && pane.connId);
  if (!pane) {
    els.statusDot.className = 'dot';
    els.statusText.textContent = T('status.noConnection');
    return;
  }
  const label = sessionLabel(pane);
  if (pane.status === 'connecting') {
    els.statusDot.className = 'dot connecting';
    els.statusText.textContent = T('status.connecting', { name: label });
  } else if (pane.status === 'connected') {
    els.statusDot.className = 'dot connected';
    els.statusText.textContent = T('status.connected', { name: label });
  } else if (pane.status === 'error') {
    els.statusDot.className = 'dot error';
    els.statusText.textContent = pane.errorMsg || T('status.error');
  } else {
    els.statusDot.className = 'dot';
    els.statusText.textContent = T('status.emptyPane');
  }
}

function updateOverlayVisibility() {
  els.overlay.hidden = panes.size > 0;
}

// ---------- connect ----------

async function connectPane(pane, sessionId) {
  const s = sessions.find((x) => x.id === sessionId);
  if (!s) return;
  if (pane.connId) {
    const old = pane.connId;
    pane.connId = null;
    api.disconnect(old).catch(console.error);
  }
  pane.sessionId = sessionId;
  pane.status = 'connecting';
  pane.errorMsg = '';
  updatePaneHeader(pane);
  setActive(pane.id);
  if (pane.term) pane.term.reset();
  if (pane.fit) { try { pane.fit.fit(); } catch { /* transient */ } }
  try {
    // always resolves; failures arrive via ssh-status events
    const connId = await api.connect(sessionId, pane.term ? pane.term.cols : 80, pane.term ? pane.term.rows : 24);
    if (panes.get(pane.id) !== pane) return; // closed meanwhile
    pane.connId = connId;
    updatePaneHeader(pane);
    updateToolbarStatus();
  } catch (err) {
    pane.status = 'error';
    pane.errorMsg = err.message || String(err);
    updatePaneHeader(pane);
    updateToolbarStatus();
  }
}

// 세션 더블클릭: 활성 창이 비어 있으면 그 창에, 아니면 오른쪽 새 창에 연결
async function connectSession(sessionId) {
  let pane = panes.get(activePaneId);
  if (!pane || pane.connId || pane.status === 'connecting') {
    pane = splitPane('h');
  }
  if (pane) await connectPane(pane, sessionId);
}

// ---------- session list ----------

function renderList() {
  els.list.innerHTML = '';
  if (sessions.length === 0) {
    const li = document.createElement('li');
    li.className = 'empty-list';
    li.style.whiteSpace = 'pre-line';
    li.textContent = T('sidebar.empty');
    els.list.appendChild(li);
    return;
  }
  for (const s of sessions) {
    const li = document.createElement('li');
    li.className = 'session-item';
    li.dataset.id = s.id;

    const main = document.createElement('div');
    main.className = 'session-main';
    const name = document.createElement('span');
    name.className = 'session-name';
    name.textContent = s.name || s.host;
    const host = document.createElement('span');
    host.className = 'session-host';
    host.textContent = `${s.username}@${s.host}:${s.port || 22}`;
    main.append(name, host);

    const actions = document.createElement('div');
    actions.className = 'session-actions';
    const edit = document.createElement('button');
    edit.title = T('session.edit');
    edit.textContent = '✎';
    edit.addEventListener('click', (e) => { e.stopPropagation(); openDialog(s); });
    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'icon-btn';
    del.title = T('session.delete');
    del.textContent = '✕';
    del.addEventListener('click', (e) => { e.stopPropagation(); removeSession(s); });
    actions.append(edit, del);

    li.append(main, actions);
    li.addEventListener('dblclick', () => connectSession(s.id));
    els.list.appendChild(li);
  }
}

// ---------- dialog ----------

let editingId = null;

function openDialog(session) {
  editingId = session ? session.id : null;
  els.dialogTitle.textContent = session ? T('dialog.edit') : T('dialog.new');
  els.form.reset();
  els.form.elements.name.value = session ? (session.name || '') : '';
  els.form.elements.host.value = session ? session.host : '';
  els.form.elements.port.value = session ? (session.port || 22) : 22;
  els.form.elements.username.value = session ? session.username : '';
  els.form.elements.authMethod.value = session ? session.authMethod : 'password';
  els.form.elements.keyPath.value = session ? (session.keyPath || '') : '';
  els.form.elements.password.placeholder =
    session && session.authMethod === 'password' && session.hasPassword
      ? T('dialog.savedPh')
      : '';
  els.form.elements.passphrase.placeholder =
    session && session.authMethod === 'key' && session.hasPassphrase
      ? T('dialog.savedPh')
      : T('dialog.passphrasePh');
  syncAuthFields();
  els.backdrop.hidden = false;
  els.form.elements.host.focus();
}

function closeDialog() {
  els.backdrop.hidden = true;
  editingId = null;
}

function syncAuthFields() {
  const keyAuth = els.form.elements.authMethod.value === 'key';
  els.passwordField.hidden = keyAuth;
  els.keyFields.hidden = !keyAuth;
  els.form.elements.keyPath.required = keyAuth;
  els.passwordField.querySelector('span').textContent = keyAuth ? T('dialog.authPassword') : T('dialog.password');
}
async function submitDialog(e) {
  e.preventDefault();
  const f = els.form.elements;
  const host = f.host.value.trim();
  const username = f.username.value.trim();
  const port = parseInt(f.port.value, 10) || 22;
  const authMethod = f.authMethod.value;
  const keyPath = f.keyPath.value.trim();

  if (!host || !username) return;
  if (authMethod === 'key' && !keyPath) {
    f.keyPath.focus();
    return;
  }
  if (authMethod === 'password' && !editingId && !f.password.value) {
    f.password.setCustomValidity(T('dialog.pwRequired'));
    f.password.reportValidity();
    f.password.setCustomValidity('');
    return;
  }

  const payload = {
    id: editingId || undefined,
    name: f.name.value.trim(),
    host,
    port,
    username,
    authMethod,
    password: authMethod === 'password' ? f.password.value : '',
    passphrase: authMethod === 'key' ? f.passphrase.value : '',
  };

  try {
    const saved = await api.saveSession(payload);
    const idx = sessions.findIndex((s) => s.id === saved.id);
    if (idx >= 0) sessions[idx] = saved;
    else sessions.push(saved);
    renderList();
    closeDialog();
  } catch (err) {
    alert(T('dialog.saveFailed') + (err.message || err));
  }
}

function removeSession(session) {
  const label = session.name || session.host;
  if (!confirm(T('session.deleteConfirm', { name: label }))) return;
  api.deleteSession(session.id).then(() => {
    sessions = sessions.filter((s) => s.id !== session.id);
    [...panes.values()]
      .filter((p) => p.sessionId === session.id)
      .forEach((p) => closePane(p.id));
    renderList();
    updateToolbarStatus();
  }).catch(console.error);
}

// ---------- init ----------

async function init() {
  settings = await api.getSettings();
  if (!LOCALES[settings.lang]) settings.lang = 'ko';
  lang = settings.lang;
  if (!THEMES[settings.theme]) settings.theme = 'nord';
  if (!Number.isInteger(settings.fontSize)) settings.fontSize = DEFAULT_FONT_SIZE;

  applyThemeVars(settings.theme);
  applyLang(lang);
  if (settings.sidebarHidden) setSidebar(true, { persist: false });
  els.fontSizeLabel.textContent = String(settings.fontSize);


  // ssh events
  api.onData((connId, chunk) => {
    for (const p of panes.values()) {
      if (p.connId === connId && p.term) { p.term.write(chunk); break; }
    }
  });
  api.onStatus((st) => {
    for (const p of panes.values()) {
      if (p.connId !== st.connId) continue;
      if (st.status === 'connecting') {
        p.status = 'connecting';
      } else if (st.status === 'connected') {
        p.status = 'connected';
        p.errorMsg = '';
        if (p.term) p.term.focus();
      } else if (st.status === 'error') {
        p.status = 'error';
        p.errorMsg = st.message || '오류';
      } else if (st.status === 'closed') {
        p.status = 'idle';
        p.connId = null;
        p.errorMsg = '';
      }
      updatePaneHeader(p);
      if (p.id === activePaneId) updateToolbarStatus();
      break;
    }
  });

  // font controls
  els.fontMinus.addEventListener('click', () => adjustFont(-1));
  els.fontPlus.addEventListener('click', () => adjustFont(1));
  els.paneArea.addEventListener('wheel', (e) => {
    if (!e.ctrlKey) return;
    e.preventDefault();
    adjustFont(e.deltaY < 0 ? 1 : -1);
  }, { passive: false });
  window.addEventListener('keydown', (e) => {
    if (e.altKey && !e.ctrlKey && !e.shiftKey
        && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.preventDefault();
      focusDirection(e.key.replace('Arrow', '').toLowerCase());
      return;
    }
    if (!e.ctrlKey || e.shiftKey || e.altKey) return;
    if (e.key === '=' || e.key === '+') { e.preventDefault(); adjustFont(1); }
    else if (e.key === '-') { e.preventDefault(); adjustFont(-1); }
    else if (e.key === '0') { e.preventDefault(); setFontSize(DEFAULT_FONT_SIZE); }
  });

  // theme select
  for (const [key, t] of Object.entries(THEMES)) {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = t.label;
    els.themeSelect.appendChild(opt);
  }
  els.themeSelect.value = settings.theme;
  els.themeSelect.addEventListener('change', () => applyTheme(els.themeSelect.value));

  // toolbar / sidebar actions
  els.btnDisconnect.addEventListener('click', () => {
    const pane = panes.get(activePaneId);
    if (pane && pane.connId) api.disconnect(pane.connId).catch(console.error);
  });
  els.btnNew.addEventListener('click', () => openDialog(null));
  els.btnHideSidebar.addEventListener('click', () => setSidebar(true));
  els.btnShowSidebar.addEventListener('click', () => setSidebar(false));
  els.ctxCopy.addEventListener('click', () => { ctxCopyAction(); hideCtxMenu(); });
  els.ctxPaste.addEventListener('click', () => { ctxPasteAction(); hideCtxMenu(); });
  document.addEventListener('click', (e) => {
    if (!els.ctxMenu.hidden && !e.target.closest('#ctxMenu')) hideCtxMenu();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hideCtxMenu(); });
  // language menu
  els.btnLang.addEventListener('click', (e) => {
    e.stopPropagation();
    els.langMenu.hidden = !els.langMenu.hidden;
  });
  // right-click menu anywhere in the terminal area (pane under cursor, or active pane)
  els.paneArea.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const paneEl = e.target.closest('.pane');
    const pane = (paneEl && panes.get(paneEl.dataset.id)) || panes.get(activePaneId) || [...panes.values()][0] || null;
    showCtxMenu(pane, e.clientX, e.clientY);
  });
  els.langMenu.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-lang]');
    if (btn) applyLang(btn.dataset.lang);
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.lang-wrap')) els.langMenu.hidden = true;
  });
  els.btnCancel.addEventListener('click', closeDialog);
  els.backdrop.addEventListener('click', (e) => {
    if (e.target === els.backdrop) closeDialog();
  });
  els.form.addEventListener('submit', submitDialog);
  els.authMethod.addEventListener('change', syncAuthFields);
  els.btnBrowse.addEventListener('click', async () => {
    const p = await api.pickKeyFile();
    if (p) els.form.elements.keyPath.value = p;
  });

  // sessions
  sessions = await api.getSessions();
  renderList();
  updateOverlayVisibility();
  updateToolbarStatus();
}

init().catch((err) => {
  document.body.innerHTML = `<pre style="color:#bf616a;padding:20px">초기화 실패: ${err.message || err}</pre>`;
});
