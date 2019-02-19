const { electron } = require('electron')
const LicenceList = require('./licenceList');

var myLicences = null;

document.getElementById('loadButton').addEventListener('click', _ => {
  getLicences('./res/licenceKeyLog.txt', './res/adapters.txt');
})

function loadTable() {
  console.log("When is this called Worked?")
  let rowCursor = 0
  let licenseTable = document.getElementById('license-table')
  licenseTable.innerHTML = ""

  let head = document.createElement('thead')  // let head = licenseTable.createTHead()
  let row = document.createElement('tr')
  myLicences.listHeaders.forEach((value, index) => {
    let cell = document.createElement('th')
    cell.innerHTML = value
    row.appendChild(cell);
  })
  head.appendChild(row)
  licenseTable.appendChild(head)

  let body = document.createElement('tbody')
  licenseTable.appendChild(document.createElement('tbody'))
  myLicences.licences.forEach((licence, index) => {
    let row = document.createElement('tr')
    insertCell(row, licence.companyName)
    insertCell(row, licence.version)
    insertCell(row, licence.beginDate)
    insertCell(row, licence.endDate)
    insertCell(row, licence.adapters)
    insertCell(row, licence.idkWhatThisis)
    insertCell(row, licence.licence)
    body.appendChild(row)
  })
  licenseTable.appendChild(body)
}

function insertCell(row, value) {
  let cell = document.createElement('td')
  cell.innerHTML = value
  row.appendChild(cell)
}

function getLicences(licenceFile, adaptersFile) {
  myLicences = new LicenceList(loadTable)
  myLicences.loadLicences(licenceFile, loadTable)
  myLicences.loadAdapters(adaptersFile, loadTable)
  setTimeout(_ => {
    console.log(myLicences)
  }, 1000)
}


