const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
var mainWindow = null

// Quit when all windows are closed.
app.on('window-all-closed', _ => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('open-license-file', (event, defaultPath) => {
  dialog.showOpenDialog({
    title: 'Open License log file',
    defaultPath: defaultPath,
    properties: ['openFile']
  }, (file) => {
    if (file) event.sender.send('selected-license-file', file[0])
  })
})

ipcMain.on('open-adapter-file', (event, defaultPath) => {
  dialog.showOpenDialog({
    title: 'Open Adapter log file',
    defaultPath: defaultPath,
    properties: ['openFile']
  }, (file) => {
    if (file) event.sender.send('selected-adapter-file', file[0])
  })
})

ipcMain.on('invalidLicenseFormat', (event, err) => {
  console.log(err.m + ' at line: ' + err.lineCount)
})

app.on('ready', _ => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    // 'min-width': 700,
    // 'min-height': 550,
    'accept-first-mouse': true,
    'title-bar-style': 'hidden',
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadURL(path.join('file://', __dirname, '/index.html'))
  // mainWindow.openDevTools()

  mainWindow.on('closed', _ => {
    mainWindow = null
  })

  mainWindow.on('ready-to-show', _ => {
    ipcMain.send('init-tables')
  })
})
