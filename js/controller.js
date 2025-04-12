// const Model = require('./model')

let SETTINGS = null
let licenseArray = null
let adapterArray = null
const tBody = document.getElementById('license-tbody')
const aBody = document.getElementById('adapter-tbody')

const errorArea = document.getElementById('alertArea')
const searchInput = document.getElementById('license-search')

document.addEventListener('DOMContentLoaded', function () {
	window.electronAPI.loadSettings()
		.then((someSettings) => {
			SETTINGS = someSettings
			getLicenses(SETTINGS.licensePath)
			getAdapters(SETTINGS.adapterPath)
		})
		.catch((err) => {
			SETTINGS = {}
			setErrorArea(`Please load files. Error: ${err.message}`)
		})

	const loadLicensesButton = document.getElementById('loadLicensesButton')
	loadLicensesButton.addEventListener('click', () => {
		window.electronAPI.openFile('license')
			.then((path) => {
				hideErrorArea()
				SETTINGS.licensePath = path
				getLicenses(SETTINGS.licensePath)
				window.electronAPI.saveSettings(SETTINGS)
					.catch((err) => setErrorArea(`Error saving settings: ${err.message}`))
			})
			.catch((err) => setErrorArea(`Error loading file: ${err.message}`))
	})

	const loadAdaptersButton = document.getElementById('loadAdaptersButton')
	loadAdaptersButton.addEventListener('click', () => {
		window.electronAPI.openFile('adapter')
			.then((path) => {
				hideErrorArea()
				SETTINGS.adapterPath = path
				getAdapters(SETTINGS.adapterPath)
				window.electronAPI.saveSettings(SETTINGS)
					.catch((err) => setErrorArea(`Error saving settings: ${err.message}`))
			})
			.catch((err) => setErrorArea(`Error loading file: ${err.message}`))
	})

	searchInput.addEventListener('keyup', _ => {
		let filter = (searchInput.value).toLowerCase()
		let tr = document.querySelectorAll('#license-tbody tr')
		Array.prototype.forEach.call(tr, function (row) {
			row.classList.toggle('d-none', !((row.textContent).toLowerCase().includes(filter)))
		})
	})

	tBody.addEventListener('click', (event) => {
		if (event.target.tagName === 'TD') {
			licenseSelected(event.target)
		}
	}, false)

	searchInput.focus()
})

function setErrorArea(msg) {
	errorArea.innerHTML = msg
	errorArea.classList.remove('d-none')
}

function hideErrorArea() {
	errorArea.classList.add('d-none')
}

function licenseSelected(cell) {
	let adapterID = cell.parentElement.children[4].innerHTML
	window.electronAPI.checkAdapters(adapterID, adapterArray)
		.then((data) => {
			adapterArray = data
			updateAdapterTable()
		})
}

function insertTd(row, value) {
	let cell = document.createElement('td')
	cell.innerHTML = value
	row.appendChild(cell)
	return cell
}

function updateLicenseTable() {
	let myBody = ''
	licenseArray.forEach((license, index) => {
		let row = document.createElement('tr')
		insertTd(row, license.companyName)
		insertTd(row, license.version)
		insertTd(row, license.beginDate)
		insertTd(row, license.endDate)
		insertTd(row, license.adapters)
		insertTd(row, license.license)
		row.classList.add('text-nowrap')
		myBody += row.outerHTML
	})
	tBody.innerHTML = myBody
}

function updateAdapterTable() {
	let myBody = ''
	adapterArray.forEach((adapter) => {
		let row = document.createElement('tr')
		insertTd(row, adapter.name)
		let td = insertTd(row, adapter.isInLicense)
		row.classList.add('text-center', 'text-nowrap')
		row.classList.toggle('d-none', !(td.innerHTML === 'true'))
		myBody += row.outerHTML
	})
	aBody.innerHTML = myBody
}

async function getAdapters(file) {
	try {
		adapterArray = await window.electronAPI.willLoadAdapters(file)
		updateAdapterTable()
	} catch (err) {
		setErrorArea(err.message)
	}
}

async function getLicenses(file) {
	try {
		licenseArray = await window.electronAPI.willLoadLicenses(file)
		updateLicenseTable()
	} catch (err) {
		setErrorArea(err.message)
	}
}
