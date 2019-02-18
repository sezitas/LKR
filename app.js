const { app, BrowserWindow, ipcMain } = require('electron')
var mainWindow = null

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {

  mainWindow = new BrowserWindow({
    width: 1028,
    height: 798,
    'min-width': 500,
    'min-height': 200,
    'accept-first-mouse': true,
    'title-bar-style': 'hidden',
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadURL('file://' + __dirname + '/index.html')
  mainWindow.openDevTools()

  mainWindow.on('closed', function() {
    mainWindow = null
  });

});
