window.$ = window.jQuery = require('jquery')
window.Tether = require('popper.js')
window.Bootstrap = require('bootstrap')
const Model = require('./model')

var licenseArray = null
var adapterArray = null
const tBody = document.getElementById('license-tbody')
const aBody = document.getElementById('adapter-tbody')

const errorArea = document.getElementById('errorArea')
const loadButton = document.getElementById('loadButton')
loadButton.addEventListener('click', _ => {
  hideErrorArea()
  getLicenses('./res/LicenseKeyLog.txt')
  getAdapters('./res/adapters.txt')
  // getLicenses('//vms2/FileShare/MC/KeyGenerator/LicenseKeyLog.txt', './res/adapters.txt');
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
  var cell = document.createElement('td')
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
