const { contextBridge, ipcRenderer } = require('electron/renderer')
const model = require('./model')
const settUtil = require('./settUtil')

contextBridge.exposeInMainWorld('electronAPI', {
	openFile: (fileType) => { ipcRenderer.invoke('open-file', fileType) },
	willLoadAdapters: (file) => { return model.willLoadAdapters(file) },
	willLoadLicenses: (file) => { return model.willLoadLicenses(file) },
	checkAdapters: (licenseCode, data) => { return model.checkAdapters(licenseCode, data) },
	loadSettings: () => { return settUtil.loadSettings() },
	saveSettings: (SETTINGS) => { return settUtil.saveSettings(SETTINGS) },
})