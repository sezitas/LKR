const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
let mainWindow = null

ipcMain.on('open-license-file', (event) => {
  dialog.showOpenDialog({
    title: 'Open License log file',
    properties: ['openFile']
  }, (file) => {
    if (file) event.sender.send('selected-license-file', file[0])
  })
})

ipcMain.on('open-adapter-file', (event) => {
  dialog.showOpenDialog({
    title: 'Open Adapter log file',
    properties: ['openFile']
  }, (file) => {
    if (file) event.sender.send('selected-adapter-file', file[0])
  })
})

app.on('ready', _ => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 695,
    // 'min-width': 700,
    // 'min-height': 550,
    'accept-first-mouse': true,
    'title-bar-style': 'hidden',
    webPreferences: {
      nodeIntegration: true
    }
  })

  // mainWindow.setMenu(null)
  // mainWindow.openDevTools()
  mainWindow.loadURL(path.join('file://', __dirname, '/index.html'))

  mainWindow.on('closed', _ => {
    mainWindow = null
  })
  
})

app.on('window-all-closed', _ => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
