const { electron } = require('electron')
const LicenceList = require('./licenceList');

var myLicences = null;

document.getElementById('loadButton').addEventListener('click', _ => {
  getLicences('./res/licenceKeyLog.txt', './res/adapters.txt');
})

function insertTh(row, value, size) {
  var cell = document.createElement('th')
  cell.classList.add('col-' + size)
  cell.innerHTML = value
  row.appendChild(cell)
}

function insertTd(row, value, size) {
  var cell = document.createElement('td')
  let temp = 'col-' + size
  cell.classList.add(temp)
  cell.innerHTML = value
  row.appendChild(cell)
}

function loadTable() {
  console.log("When is this called Worked?")
  let rowCursor = 0
  let licenseTable = document.getElementById('license-table')
  licenseTable.innerHTML = ""

  let head = document.createElement('thead')
  head.classList.add('thead-dark');
  let row = document.createElement('tr')
  row.classList.add('d-flex')
  insertTh(row, 'Client', 2) 
  insertTh(row, 'Ver', 1)
  insertTh(row, 'Start', 1)
  insertTh(row, 'End', 1)
  insertTh(row, 'Adapter ID', 1)
  // insertTh(row, 'idk', 0)
  insertTh(row, 'License Key', 10)
  head.appendChild(row)
  licenseTable.appendChild(head)

  let body = document.createElement('tbody')
  licenseTable.appendChild(document.createElement('tbody'))
  myLicences.licences.forEach((licence, index) => {
    let row = document.createElement('tr')
    row.classList.add('d-flex')
    insertTd(row, licence.companyName, 2)
    insertTd(row, licence.version, 1)
    insertTd(row, licence.beginDate, 1)
    insertTd(row, licence.endDate, 1)
    insertTd(row, licence.adapters, 1)
    // insertTd(row, licence.idkWhatThisis, 0)
    insertTd(row, licence.licence, 10)
    body.appendChild(row)
  })
  licenseTable.appendChild(body)
}


function getLicences(licenceFile, adaptersFile) {
  myLicences = new LicenceList(loadTable)
  myLicences.loadLicences(licenceFile, loadTable)
  myLicences.loadAdapters(adaptersFile, loadTable)
  setTimeout(_ => {
    console.log(myLicences)
  }, 1000)
}


