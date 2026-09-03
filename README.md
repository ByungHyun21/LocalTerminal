<div align="center">

# LocalTerminal

**A Windows SSH terminal client** — saved sessions · multiple simultaneous connections · free-form pane splitting

Electron · xterm.js · ssh2

![MIT](https://img.shields.io/badge/license-MIT-blue) ![Platform](https://img.shields.io/badge/platform-Windows-blueviolet) ![Languages](https://img.shields.io/badge/languages-EN%20%7C%20KO%20%7C%20JA%20%7C%20ZH-green)

</div>

---

![2x2 pane grid with 4 simultaneous SSH connections](docs/screenshot-2x2.webp)

## ✨ Features

### Session management
- **Double-click to connect** — store host, port, username and credentials, then launch a shell straight from the sidebar.
- **Password or private-key authentication** (key file browser picker, passphrase support).
- Passwords and passphrases are encrypted at rest with **Windows DPAPI** — never stored in plaintext.

### Multiple connections & pane splitting
- One pane = one SSH connection. Keep **several servers open at once**.
- Split any pane **right ◫ or down ⊟** recursively, tmux-style — 2x2 grids or any layout you like.
- **Drag splitters** to resize panes freely (PTY size updates in real time).
- Move between panes with `Alt + arrows`; double-click a pane title to reconnect.
- Double-clicking a session connects in the active pane, or **opens a new pane to the right** if it's busy.

### Terminal
- **12 themes** — Nord, Dracula, Tokyo Night, Catppuccin Mocha, Gruvbox Dark, One Dark, Monokai, Solarized Dark, Kanagawa, Everforest, Ayu Dark, Solarized Light. Terminal 16-color palette and UI chrome switch together.
- **Font size 8–32px** — buttons, `Ctrl + = / - / 0` or `Ctrl + wheel`, applied to every pane at once.
- xterm-256color, 5,000-line scrollback, keepalive.

### Languages
- **English · 한국어 ·日本語 · 中文** — pick a flag on the left side of the window. The entire UI switches instantly and remembers your choice.

## 🚀 Install & run

### From a release
- **`LocalTerminal-Portable-1.0.0.exe`** — single file, runs on double-click, no installation
- **`LocalTerminal-Setup-1.0.0.exe`** — NSIS installer

### From source
```bash
npm install
npm start        # run in dev
npm run dist     # build Windows exe (portable + installer)
```

> Requires Node.js 18+. With npm 12+ you may need to approve install scripts first: `npm install-scripts approve electron ssh2`.

## ⌨️ Shortcuts

| Action | Input |
|---|---|
| Connect a session | Double-click it in the sidebar (busy pane → new pane on the right) |
| Move between panes | `Alt + ←/→/↑/↓` |
| Font size | `Ctrl + =` / `Ctrl + -` / `Ctrl + 0`, or `Ctrl + wheel` |
| Reconnect a pane | Double-click its title |

## 🔒 Security

- **Credential storage**: Electron `safeStorage` → Windows DPAPI encryption (`enc:` prefix). Decryptable only by the same Windows account.
- **Process isolation**: `contextIsolation: true`, `nodeIntegration: false`; the renderer talks to a minimal preload API only.
- **CSP** enforced (`default-src 'self'`) — no external script or network loading.
- Secrets are never sent back to the renderer (only a "saved" flag).

## 🏗️ Project layout

```
main.js      main process — multi-connection SSH manager (connId map), session/settings
             persistence, DPAPI encryption
preload.js   contextBridge — the minimal IPC surface exposed to the renderer
renderer/
  index.html layout (sidebar / toolbar / pane area)
  app.js     pane tree (recursive splits), xterm instances, themes, i18n, session UI
  style.css  theme CSS variables, pane & splitter styles
  flags/     language flag icons (SVG)
test/
  sshd-test.js  local test SSH server (ssh2 server mode)
```

## 🧪 Testing

End-to-end testing against a local SSH server:

```bash
node test/sshd-test.js   # listens on 127.0.0.1:2222 — testuser / testpass123
```

## 📄 License

[MIT](LICENSE)
