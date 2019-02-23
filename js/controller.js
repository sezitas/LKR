window.$ = window.jQuery = require('jquery')
window.Tether = require('popper.js')
window.Bootstrap = require('bootstrap')
const LicenseList = require('./licenseList')

var myLicenses = null
var tBody = document.getElementById('license-tbody')
var aBody = document.getElementById('adapter-tbody')

var loadButton = document.getElementById('loadButton')
loadButton.addEventListener('click', _ => {
  getLicenses('./res/LicenseKeyLog.txt', './res/adapters.txt')
  // getLicenses('//vms2/FileShare/MC/KeyGenerator/LicenseKeyLog.txt', './res/adapters.txt');
})

function licenseSelected (e) {
  let adapterID = e.path[1].cells[4].innerHTML
  myLicenses.checkAdapters(adapterID, updateAdapterTable)
}

function insertTd (row, value) {
  var cell = document.createElement('td')
  cell.innerHTML = value
  row.appendChild(cell)
  return cell
}

function updateLicenseTable () {
  tBody.innerHTML = ''
  myLicenses.licenses.forEach((licence, index) => {
    let row = document.createElement('tr')
    insertTd(row, licence.companyName)
    insertTd(row, licence.version)
    insertTd(row, licence.beginDate)
    insertTd(row, licence.endDate)
    insertTd(row, licence.adapters)
    insertTd(row, licence.license)
    row.classList.add('text-nowrap')
    row.addEventListener('click', licenseSelected)
    tBody.appendChild(row)
  })
}

function updateAdapterTable () {
  aBody.innerHTML = ''
  myLicenses.adapters.forEach((adapter) => {
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

function getLicenses (licensesFile, adaptersFile) {
  myLicenses = new LicenseList()
  myLicenses.licenseUpdated = updateLicenseTable
  myLicenses.adapterUpdated = updateAdapterTable
  myLicenses.loadLicenses(licensesFile)
  myLicenses.loadAdapters(adaptersFile)
}
