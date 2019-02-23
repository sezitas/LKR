window.$ = window.jQuery = require('jquery')
window.Tether = require('popper.js')
window.Bootstrap = require('bootstrap')
const LicenceList = require('./licenceList')

var myLicences = null
var licenseTable = document.getElementById('license-table')

var loadButton = document.getElementById('loadButton')
loadButton.addEventListener('click', _ => {
  getLicences('./res/LicenseKeyLog.txt', './res/adapters.txt')
  // getLicences('//vms2/FileShare/MC/KeyGenerator/LicenseKeyLog.txt', './res/adapters.txt');
})

function insertTh (row, value) {
  var cell = document.createElement('th')
  cell.innerHTML = value
  row.appendChild(cell)
}

function insertTd (row, value) {
  var cell = document.createElement('td')
  cell.innerHTML = value
  row.appendChild(cell)
}


function loadLicenseTable () {
  licenseTable.innerHTML = ''

  let head = document.createElement('thead')
  head.classList.add('thead-dark')
  let row = document.createElement('tr')
  insertTh(row, 'Client')
  insertTh(row, 'Ver')
  insertTh(row, 'Start Date')
  insertTh(row, 'End Date')
  insertTh(row, 'Adapter ID')
  // insertTh(row, 'idk')
  insertTh(row, 'License Key')
  head.appendChild(row)
  licenseTable.appendChild(head)

  let body = document.createElement('tbody')
  myLicences.licences.forEach((licence, index) => {
    let row = document.createElement('tr')
    insertTd(row, licence.companyName)
    insertTd(row, licence.version)
    insertTd(row, licence.beginDate)
    insertTd(row, licence.endDate)
    insertTd(row, licence.adapters)
    // insertTd(row, licence.idkWhatThisis)
    insertTd(row, licence.licence)
    body.appendChild(row)
  })
  licenseTable.appendChild(body)

  var rows = body.getElementsByTagName('tr')
  for (let i = 0; i < rows.length; i++) {
    rows[i].addEventListener('click', (e) => {
      let adapterID = e.path[1].cells[4].innerHTML
      // myLicences.adapters[2].checkLicence(adapterID, loadAdapterTable)
      myLicences.checkAdapters(adapterID, loadAdapterTable)
      // console.log(e)
      // console.log(adapterID)
    })
  }
}

function loadAdapterTable () {
  let aBody = document.getElementById('adapter-tbody')
  aBody.innerHTML = ''
  myLicences.adapters.forEach((adapter) => {
    let row = document.createElement('tr')
    insertTd(row, adapter.name)
    insertTd(row, adapter.isInLicence)
    aBody.appendChild(row)
  })
}

function logData () {
  console.log(myLicences)
  // myLicences.adapters.forEach((adapter) => {
  //   console.log(adapter.name + ': ' + adapter.isInLicence)
  // })
}

function getLicences (licenceFile, adaptersFile) {
  myLicences = new LicenceList()
  myLicences.loadLicences(licenceFile, loadLicenseTable)
  myLicences.loadAdapters(adaptersFile, loadAdapterTable)
}
