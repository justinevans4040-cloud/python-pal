const { app, BrowserWindow, shell, Menu } = require('electron');
const path = require('path');
const isDev = !app.isPackaged;

function openExternal(url) {
  try {
    const target = new URL(url);
    if (['https:', 'http:', 'mailto:'].includes(target.protocol)) {
      shell.openExternal(url);
    }
  } catch {
    // Ignore malformed external URLs.
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 900,
    minHeight: 640,
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    icon: path.join(__dirname, '../dist/icon.ico'),
    backgroundColor: '#0a0a0a',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  win.setMenuBarVisibility(false);

  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  win.webContents.setWindowOpenHandler(({ url }) => {
    openExternal(url);
    return { action: 'deny' };
  });

  win.webContents.on('will-navigate', (event, url) => {
    try {
      const current = new URL(win.webContents.getURL());
      const target = new URL(url);
      const sameFileApp = current.protocol === 'file:' && target.protocol === 'file:';
      const sameOrigin = current.origin === target.origin && current.protocol === target.protocol;

      if (!sameFileApp && !sameOrigin) {
        event.preventDefault();
        openExternal(url);
      }
    } catch {
      event.preventDefault();
    }
  });
}

function buildMenu() {
  const template = [
    ...(process.platform === 'darwin' ? [{ role: 'appMenu' }] : []),
    { role: 'fileMenu' },
    { role: 'editMenu' },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        ...(isDev ? [{ type: 'separator' }, { role: 'toggleDevTools' }] : []),
      ],
    },
    { role: 'windowMenu' },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(() => {
  buildMenu();
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
