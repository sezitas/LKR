function LicenseItem (line) {
  var temp = line.split('|')
  this.companyName = temp[0]
  this.version = temp[1]
  this.beginDate = temp[2]
  this.endDate = temp[3]
  this.adapters = temp[4]
  this.idkWhatThisis = temp[5]
  this.license = temp[6]
}

function Adapter (line) {
  let temp = line.split('|')
  this.name = temp[0]
  this.adapterID = temp[1]
  this.isInLicense = false
  this.checkLicense = (code, done) => {
    this.isInLicense = !!((parseInt(this.adapterID) & parseInt(code)) !== 0)
    done()
  }
}

function isValidAdapterLine (line) {
  const patt = /^.*\|\d*$/
  return patt.test(line)
}

function willLoadAdapters (file) {
  return new Promise((resolve, reject) => {
    let data = []
    var lineCount = 0
    var successful = true
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
  })
}

function checkAdapters (licenseCode, data) {
  return new Promise((resolve, reject) => {
    var len = data.length
    for (var i = 0; i < len; i++) {
      data[i].checkLicense(licenseCode, _ => {
        if (i === len - 1) {
          resolve(data)
        }
      })
    }
  })
}

function isValidLicenseLine (line) {
  const patt = /^(.*?\|){6}.*$/
  return patt.test(line)
}

function willLoadLicenses (file) {
  return new Promise((resolve, reject) => {
    let data = []
    var lineCount = 0
    var successful = true
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
        data.push(new LicenseItem(line))
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
        reject(Error('Invalid license format at line: ' + lineCount))
      }
      return data
    })
  })
}

module.exports = {
  willLoadAdapters: willLoadAdapters,
  willLoadLicenses: willLoadLicenses,
  checkAdapters: checkAdapters
}
