window.$ = window.jQuery = require('jquery')
window.Tether = require('popper.js')
window.Bootstrap = require('bootstrap')
const Model = require('./licenseList')

// var myLicenses = null
var licenseArray = null
var adapterArray = null
const tBody = document.getElementById('license-tbody')
const aBody = document.getElementById('adapter-tbody')

var loadButton = document.getElementById('loadButton')
loadButton.addEventListener('click', _ => {
  getLicenses('./res/LicenseKeyLog.txt')
  getAdapters('./res/adapters.txt')
  // getLicenses('//vms2/FileShare/MC/KeyGenerator/LicenseKeyLog.txt', './res/adapters.txt');
})

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

function getAdapters (file) {
  Model.willLoadAdapters(file)
    .then((data) => {
      adapterArray = data
      updateAdapterTable()
    })
    .catch((err) => {
      console.log('getAdapters: ' + err.message)
    })
}

function getLicenses (file) {
  Model.willLoadLicenses(file)
    .then((data) => {
      licenseArray = data
      updateLicenseTable()
    })
    .catch((err) => {
      console.log('getLicenses: ', err.message)
    })
}
