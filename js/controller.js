const { electron } = require('electron')
const LicenceList = require('./licenceList');

var myLicences = null;

document.getElementById('loadButton').addEventListener('click', _ => {
  getLicences('./res/licenceKeyLog.txt', './res/adapters.txt');
})

function insertTh(row, value, size) {
  var cell = document.createElement('th')
  // size === 0 ? temp = 'col-lg' : temp = 'col-lg-'
  // cell.classList.add(temp + size)
  cell.innerHTML = value
  row.appendChild(cell)
}

function insertTd(row, value, size) {
  var cell = document.createElement('td')
  // size === 0 ? temp = 'col-lg' : temp = 'col-lg-'
  // cell.classList.add(temp + size)
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
  // row.classList.add('row')
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
    // row.classList.add('row')
    insertTd(row, licence.companyName, 2)
    insertTd(row, licence.version, 1)
    insertTd(row, licence.beginDate, 2)
    insertTd(row, licence.endDate, 2)
    insertTd(row, licence.adapters, 1)
    // insertTd(row, licence.idkWhatThisis, 0)
    insertTd(row, licence.licence, 4)
    body.appendChild(row)
  })
  licenseTable.appendChild(body)
}


function getLicences(licenceFile, adaptersFile) {
  myLicences = new LicenceList(loadTable)
  myLicences.loadLicences(licenceFile, loadTable)
  myLicences.loadAdapters(adaptersFile, loadTable)
  // setTimeout(_ => {
  //   console.log(myLicences)
  // }, 1000)
}


