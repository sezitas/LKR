const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
var mainWindow = null

// Quit when all windows are closed.
app.on('window-all-closed', _ => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('openLicenseFile', _ => {
  console.log(dialog.showOpenDialog({
    title: 'Open License log file',
    defaultPath: '//vms2/FileShare/MC/KeyGenerator/LicenseKeyLog.txt',
    properties: ['openFile', 'multiSelections']
  }))
})

ipcMain.on('openAdapterFile', _ => {
  // TODO
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
})
