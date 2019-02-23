const { app, BrowserWindow } = require('electron')
const path = require('path')
var mainWindow = null

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('ready', function () {
  mainWindow = new BrowserWindow({
    width: 1650,
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
  mainWindow.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
})
