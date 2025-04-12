const fs = require('fs')

function loadSettings() {
	return new Promise((resolve, reject) => {
		fs.readFile('./settings.json', (err, data) => {
			if (err) {
				reject(err)
			} else {
				resolve(JSON.parse(data))
			}
		})
	})
}

function saveSettings(SETTINGS) {
	return new Promise((resolve, reject) => {
		const data = JSON.stringify(SETTINGS)
		fs.writeFile('./settings.json', data, (err) => {
			if (err) {
				reject(err)
			} else {
				resolve()
			}
		})
	})
}

module.exports = {
	loadSettings,
	saveSettings
}
