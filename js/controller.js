let SETTINGS = {}
let licenseArray = []
let adapterArray = []

const elements = {
    tBody: document.getElementById('license-tbody'),
    aBody: document.getElementById('adapter-tbody'),
    errorArea: document.getElementById('alertArea'),
    searchInput: document.getElementById('license-search')
}

function setErrorArea(msg) {
    elements.errorArea.innerHTML = msg
    elements.errorArea.classList.toggle('d-none', !msg)
}

async function loadFile(type, handler) {
    try {
        const path = await window.electronAPI.openFile(type)
        if (path) {
            SETTINGS[`${type}Path`] = path
            await handler(path)
            await window.electronAPI.saveSettings(SETTINGS)
        }
    } catch (err) {
        setErrorArea(`Error loading ${type}: ${err.message}`)
    }
}

async function getAdapters(file) {
    if (!file) return
    adapterArray = await window.electronAPI.willLoadAdapters(file)
    updateTable(elements.aBody, adapterArray, renderAdapterRow)
}

async function getLicenses(file) {
    if (!file) return
    licenseArray = await window.electronAPI.willLoadLicenses(file)
    updateTable(elements.tBody, licenseArray, renderLicenseRow)
}

function updateTable(tbody, items, renderRow) {
    if (!items?.length) return
    tbody.innerHTML = items.map(renderRow).join('')
}

const renderLicenseRow = license => `
    <tr class="text-nowrap">
        <td>${license.companyName}</td>
        <td>${license.version}</td>
        <td>${license.beginDate}</td>
        <td>${license.endDate}</td>
        <td>${license.adapters}</td>
        <td>${license.license}</td>
    </tr>`

const renderAdapterRow = adapter => `
    <tr class="text-center text-nowrap ${adapter.isInLicense ? '' : 'd-none'}">
        <td>${adapter.name}</td>
        <td>${adapter.isInLicense}</td>
    </tr>`

document.addEventListener('DOMContentLoaded', async () => {
    try {
        SETTINGS = await window.electronAPI.loadSettings()
        await getLicenses(SETTINGS.licensePath)
        await getAdapters(SETTINGS.adapterPath)
    } catch (err) {
        setErrorArea('Please load files')
    }

    document.getElementById('loadLicensesButton')
        .addEventListener('click', () => loadFile('license', getLicenses))

    document.getElementById('loadAdaptersButton')
        .addEventListener('click', () => loadFile('adapter', getAdapters))

    elements.searchInput.addEventListener('keyup', () => {
        const filter = elements.searchInput.value.toLowerCase()
        document.querySelectorAll('#license-tbody tr').forEach(row => {
            row.classList.toggle('d-none', !row.textContent.toLowerCase().includes(filter))
        })
    })

    elements.tBody.addEventListener('click', async e => {
        if (e.target.tagName === 'TD') {
            const licenseCode = e.target.parentElement.children[4].innerHTML
            adapterArray = await window.electronAPI.checkAdapters(licenseCode, adapterArray)
            updateTable(elements.aBody, adapterArray, renderAdapterRow)
        }
    })

    elements.searchInput.focus()
})
