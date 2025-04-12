function LicenseItem(line) {
	[this.companyName,
	this.version,
	this.beginDate,
	this.endDate,
	this.adapters,
	this.idkWhatThisis,
	this.license] = line.split('|')
}

function Adapter(line) {
	[this.name,
	this.adapterID] = line.split(';')
	this.isInLicense = false
}

function checkLicense (adapterID, code) {
	return !!((parseInt(adapterID) & parseInt(code)) !== 0)
}

function checkAdapters(licenseCode, data) {
	return new Promise((resolve, reject) => {
		if (!Array.isArray(data)) {
            reject(new Error('Data must be an array'))
            return;
        }

        try {
            data.forEach(adapter => {
                adapter.isInLicense = checkLicense(adapter.adapterID, licenseCode)
            })
            resolve(data)
        } catch (err) {
            reject(err)
        }
	})
}

function isValidAdapterLine(line) {
	const patt = /^.*;\d*$/
	return patt.test(line)
}

function willLoadAdapters(file) {
	return new Promise((resolve, reject) => {
		let data = []
		let lineCount = 0
		let successful = true
		const fs = require('fs')
		const readline = require('readline')
		const readStream = fs.createReadStream(file)
		const rl = readline.createInterface({
			input: readStream,
			crlfDelay: Infinity
		})

		rl.on('line', (line) => {
			lineCount++
			if (isValidAdapterLine(line)) {
				data.push(new Adapter(line))
			} else {
				successful = false
				rl.close()
				readStream.destroy()
			}
		})

		rl.on('close', _ => {
			if (successful) {
				resolve(data)
			} else {
				reject(Error('Invalid adapter format at line: ' + lineCount))
			}
		})

		readStream.on('error', (err) => {
			reject(err)
		})
	})
}

function isValidLicenseLine(line) {
	const patt = /^(.*?\|){6}.*$/
	return patt.test(line)
}

function willLoadLicenses(file) {
	return new Promise((resolve, reject) => {
		let data = []
		let lineCount = 0
		let successful = true
		const fs = require('fs')
		const readline = require('readline')
		const readStream = fs.createReadStream(file)
		const rl = readline.createInterface({
			input: readStream,
			crlfDelay: Infinity
		})

		rl.on('line', (line) => {
			lineCount++
			if (isValidLicenseLine(line)) {
				data.unshift(new LicenseItem(line))
			} else {
				successful = false
				rl.close()
				readStream.destroy()
			}
		})

		rl.on('close', _ => {
			if (successful) {
				console.log('licenses:', data)
				resolve(data)
			} else {
				reject(Error('Invalid license format at line: ' + lineCount))
			}
			return data
		})

		readStream.on('error', (err) => {
			reject(err)
		})
	})
}

module.exports = {
	willLoadAdapters,
	willLoadLicenses,
	checkAdapters,
	Adapter
}
