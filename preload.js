'use strict';
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('terminal', {
  // sessions
  getSessions: () => ipcRenderer.invoke('sessions:list'),
  saveSession: (session) => ipcRenderer.invoke('sessions:save', session),
  deleteSession: (id) => ipcRenderer.invoke('sessions:delete', id),
  // settings
  getSettings: () => ipcRenderer.invoke('settings:get'),
  saveSettings: (patch) => ipcRenderer.invoke('settings:save', patch),
  // ssh (multi-connection; connect returns connId, all events carry connId)
  connect: (sessionId, cols, rows) => ipcRenderer.invoke('ssh:connect', { sessionId, cols, rows }),
  write: (connId, data) => ipcRenderer.invoke('ssh:write', connId, data),
  resize: (connId, cols, rows) => ipcRenderer.invoke('ssh:resize', connId, cols, rows),
  disconnect: (connId) => ipcRenderer.invoke('ssh:disconnect', connId),
  // file dialog
  pickKeyFile: () => ipcRenderer.invoke('pickKeyFile'),
  // events
  onData: (cb) => {
    const handler = (_evt, connId, chunk) => cb(connId, chunk);
    ipcRenderer.on('ssh-data', handler);
    return () => ipcRenderer.removeListener('ssh-data', handler);
  },
  onStatus: (cb) => {
    const handler = (_evt, status) => cb(status);
    ipcRenderer.on('ssh-status', handler);
    return () => ipcRenderer.removeListener('ssh-status', handler);
  },
});
