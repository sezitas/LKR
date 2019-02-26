const { ipcRenderer } = require('electron')
const Model = require('./model')

let SETTINGS = null
let licenseArray = null
let adapterArray = null
const tBody = document.getElementById('license-tbody')
const aBody = document.getElementById('adapter-tbody')

const errorArea = document.getElementById('alertArea')
const searchInput = document.getElementById('license-search')

function init () {
  loadSettings()
    .then((someSettings) => {
      SETTINGS = someSettings
      getLicenses(SETTINGS.licensePath)
      getAdapters(SETTINGS.adapterPath)
    })
    .catch(_ => {
      SETTINGS = {}
      setErrorArea('Please load files')
    })
  setButtonListeners()
  searchInput.focus()
}

function loadSettings () {
  return new Promise((resolve, reject) => {
    let fs = require('fs')
    fs.readFile('./settings.json', (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(JSON.parse(data))
      }
    })
  })
}

function saveSettings () {
  console.log('Saving settings...')
  console.log(SETTINGS)
  let fs = require('fs')
  let data = JSON.stringify(SETTINGS)
  fs.writeFile('./settings.json', data, (err) => {
    if (err) {
      setErrorArea('Could not save user settings: ' + err)
    }
  })
}

function setButtonListeners () {
  let loadLicensesButton = document.getElementById('loadLicensesButton')
  loadLicensesButton.addEventListener('click', _ => {
    ipcRenderer.send('open-license-file')
  })
  let loadAdaptersButton = document.getElementById('loadAdaptersButton')
  loadAdaptersButton.addEventListener('click', _ => {
    ipcRenderer.send('open-adapter-file')
  })
}

ipcRenderer.on('selected-license-file', (event, path) => {
  hideErrorArea()
  SETTINGS.licensePath = path
  getLicenses(SETTINGS.licensePath)
  saveSettings()
})

ipcRenderer.on('selected-adapter-file', (event, path) => {
  hideErrorArea()
  SETTINGS.adapterPath = path
  getAdapters(SETTINGS.adapterPath)
  saveSettings()
})

function setErrorArea (msg) {
  errorArea.innerHTML = msg
  errorArea.classList.remove('d-none')
}

function hideErrorArea () {
  errorArea.classList.add('d-none')
}

function licenseSelected (e) {
  let adapterID = e.path[1].cells[4].innerHTML
  Model.checkAdapters(adapterID, adapterArray)
    .then((data) => {
      adapterArray = data
      updateAdapterTable()
    })
}

function insertTd (row, value) {
  let cell = document.createElement('td')
  cell.innerHTML = value
  row.appendChild(cell)
  return cell
}

function updateLicenseTable () {
  tBody.innerHTML = ''
  licenseArray.forEach((license, index) => {
    let row = document.createElement('tr')
    insertTd(row, license.companyName)
    insertTd(row, license.version)
    insertTd(row, license.beginDate)
    insertTd(row, license.endDate)
    insertTd(row, license.adapters)
    insertTd(row, license.license)
    row.classList.add('text-nowrap')
    row.addEventListener('click', licenseSelected)
    tBody.appendChild(row)
  })
}

function updateAdapterTable () {
  aBody.innerHTML = ''
  adapterArray.forEach((adapter) => {
    let row = document.createElement('tr')
    insertTd(row, adapter.name)
    let td = insertTd(row, adapter.isInLicense)
    if (td.innerHTML === 'true') {
      row.classList.add('text-center', 'text-nowrap')
      // row.classList.add('bg-success', 'text-white', 'text-center')
    } else {
      row.classList.add('d-none')
      // row.classList.add('bg-white', 'text-dark', 'text-center')
    }
    aBody.appendChild(row)
  })
}

async function getAdapters (file) {
  try {
    adapterArray = await Model.willLoadAdapters(file)
    updateAdapterTable()
  } catch (err) {
    setErrorArea(err.message)
  }
}

async function getLicenses (file) {
  try {
    licenseArray = await Model.willLoadLicenses(file)
    updateLicenseTable()
  } catch (err) {
    setErrorArea(err.message)
  }
}

init()
