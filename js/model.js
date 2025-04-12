const fs = require('fs')
const readline = require('readline')

class LicenseItem {
    constructor(line) {
        [this.companyName,
		 this.version,
		 this.beginDate,
		 this.endDate,
         this.adapters,
		 this.idkWhatThisis,
		 this.license] = line.split('|')
    }
}

class Adapter {
    constructor(line) {
        [this.name, this.adapterID] = line.split(';')
        this.isInLicense = false
    }
}

function readFileLines(file, isValidLine, createItem) {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error('No file provided'))
            return
        }

        const data = []
        const readStream = fs.createReadStream(file)
        const rl = readline.createInterface({
            input: readStream,
            crlfDelay: Infinity
        })

        rl.on('line', line => {
            if (isValidLine(line)) {
                data.push(createItem(line))
            }
        })

        rl.on('close', () => resolve(data))
        readStream.on('error', err => reject(err))
    })
}

const willLoadLicenses = file => 
    readFileLines(file, 
        line => /^(.*?\|){6}.*$/.test(line),
        line => new LicenseItem(line))

const willLoadAdapters = file => 
    readFileLines(file,
        line => /^.*;\d*$/.test(line), 
        line => new Adapter(line))

function checkAdapters(licenseCode, adapters) {
    if (!Array.isArray(adapters)) {
        return Promise.reject(new Error('Invalid adapter data'))
    }
    
    adapters.forEach(adapter => {
        adapter.isInLicense = !!(parseInt(adapter.adapterID) & parseInt(licenseCode))
    })
    return Promise.resolve(adapters)
}

module.exports = { willLoadAdapters, willLoadLicenses, checkAdapters }
