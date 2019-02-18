const { electron } = require('electron')
const LicenceList = require('./licenceList');

var myLicences = null;

document.getElementById('LoadLicensesButton').addEventListener('click', _ => {
  getLicences('./res/licenceKeyLog.txt', './res/adapters.txt');
})

function loadTable() {
  console.log("When is this called Worked?")
  let rowCursor = 0
  let licenseTable = document.getElementById('license-table')
  licenseTable.innerHTML = ""
  let header = licenseTable.createTHead()
  let row = header.insertRow(0)

  myLicences.listHeaders.forEach( (value, index) => {
    row.insertCell(index).innerHTML = `<b>${value}</b>`
  })

  myLicences.licences.forEach((licence, index) => {
    row = header.insertRow(index+1)
    row.insertCell(0).innerHTML = licence.companyName
    row.insertCell(1).innerHTML = licence.version
    row.insertCell(2).innerHTML = licence.beginDate
    row.insertCell(3).innerHTML = licence.endDate
    row.insertCell(4).innerHTML = licence.adapters
    row.insertCell(5).innerHTML = licence.idkWhatThisis
    row.insertCell(6).innerHTML = licence.licence
  })
}

function getLicences(licenceFile, adaptersFile) {
  myLicences = new LicenceList(loadTable)
  myLicences.loadLicences(licenceFile, loadTable)
  myLicences.loadAdapters(adaptersFile, loadTable)
  setTimeout(_ => {
    console.log(myLicences)
  }, 1000)
}


