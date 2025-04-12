const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')

async function openFile(fileType) {
	const { canceled, filePaths } = await dialog.showOpenDialog({
		title: `Open ${fileType} log file`,
		properties: ['openFile']
	})
	if (!canceled) {
		console.log('filePaths:', filePaths)
		return filePaths[0]
	}
}

function createWindow() {
	const mainWindow = new BrowserWindow({
		width: 1200,
		height: 695,
		// 'min-width': 700,
		// 'min-height': 550,
		'accept-first-mouse': true,
		'title-bar-style': 'hidden',
		webPreferences: {
			nodeIntegration: true,
			preload: path.join(__dirname, 'js/preload.js')
		}
	})

	mainWindow.loadFile('index.html')
	// mainWindow.setMenu(null)
	mainWindow.openDevTools()
}

app.whenReady().then(_ => {
	ipcMain.handle('open-file', (_, args) => openFile(args))
	createWindow()
	app.on('activate', _ => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow()
		}
	})
	app.on('window-all-closed', _ => {
		if (process.platform !== 'darwin') {
			app.quit()
		}
	})
})


