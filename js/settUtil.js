const fs = require('fs')
const path = require('path')

const settingsPath = path.join(__dirname, '..', 'settings.json')

const loadSettings = () => 
    fs.promises.readFile(settingsPath)
        .then(data => JSON.parse(data))
        .catch(() => ({}))

const saveSettings = settings =>
    fs.promises.writeFile(settingsPath, JSON.stringify(settings, null, 2))

module.exports = { loadSettings, saveSettings }
