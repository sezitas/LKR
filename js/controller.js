const { electron } = require('electron')
const LicenceList = require('./licenceList');

var myLicences = null;

document.getElementById('loadButton').addEventListener('click', _ => {
  // getLicences('./res/LicenseKeyLog.txt', './res/adapters.txt');
  getLicences('//vms2/FileShare/MC/KeyGenerator/LicenseKeyLog.txt', './res/adapters.txt');
})

function insertTh(row, value, size) {
  var cell = document.createElement('th')
  cell.innerHTML = value
  row.appendChild(cell)
}

function insertTd(row, value, size) {
  var cell = document.createElement('td')
  cell.innerHTML = value
  row.appendChild(cell)
}

function loadTable() {
  let rowCursor = 0
  let licenseTable = document.getElementById('license-table')
  licenseTable.innerHTML = ""

  let head = document.createElement('thead')
  head.classList.add('thead-dark');
  let row = document.createElement('tr')
  insertTh(row, 'Client', 2)
  insertTh(row, 'Ver', 1)
  insertTh(row, 'Start Date', 2)
  insertTh(row, 'End Date', 2)
  insertTh(row, 'Adapter ID', 1)
  // insertTh(row, 'idk', 0)
  insertTh(row, 'License Key', 4)
  head.appendChild(row)
  licenseTable.appendChild(head)

  let body = document.createElement('tbody')
  licenseTable.appendChild(document.createElement('tbody'))
  myLicences.licences.forEach((licence, index) => {
    let row = document.createElement('tr')
    insertTd(row, licence.companyName, 2)
    insertTd(row, licence.version, 1)
    insertTd(row, licence.beginDate, 2)
    insertTd(row, licence.endDate, 2)
    insertTd(row, licence.adapters, 1)
    // insertTd(row, licence.idkWhatThisis, 0)
    insertTd(row, licence.licence, 4)
    body.appendChild(row)
    // myLicences.adapters[8].checkLicence('256')
    // setTimeout(_ => {
    //   console.log('license ' + index + ': ' + myLicences.adapters[8].isInLicence)
    // }, 500)
  })
  licenseTable.appendChild(body)
}

function logAdapters() {
  myLicences.adapters.forEach((adapter) => {
    console.log(adapter.name + ': ' + adapter.isInLicence)
  })
}


function getLicences(licenceFile, adaptersFile) {
  myLicences = new LicenceList(loadTable)
  myLicences.loadAdapters(adaptersFile, _ => {
    myLicences.loadLicences(licenceFile, loadTable)
  })
  myLicences.checkAdapters('256', logAdapters)
  setTimeout(_ => {
    console.log(myLicences)
  }, 500)
}


