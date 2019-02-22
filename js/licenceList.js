class LicenceItem {
  constructor (line) {
    var temp = line.split('|')
    this.companyName = temp[0]
    this.version = temp[1]
    this.beginDate = temp[2]
    this.endDate = temp[3]
    this.adapters = temp[4]
    this.idkWhatThisis = temp[5]
    this.licence = temp[6]
  }
}

class Adapter {
  constructor (line) {
    let temp = line.split('|')
    this.name = temp[0]
    this.adapterID = temp[1]
    this.isInLicence = false
  }

  checkLicence (licenseCode, done) {
    this.isInLicence = !!((this.adapterID & licenseCode !== 0))
    done()
  }
}

class LicenceList {
  constructor () {
    this.listHeaders = ['Client', 'Ver', 'Start', 'End', 'Adapter ID', 'idk', 'License Key']
    this.licences = []
    this.adapters = []
  }

  loadLicences (fileName, updated) {
    let data = []
    const fs = require('fs')
    const readline = require('readline')

    const rl = readline.createInterface({
      input: fs.createReadStream(fileName),
      crlfDelay: Infinity
    })

    rl.on('line', (line) => {
      data.push(new LicenceItem(line))
    })

    rl.on('close', () => {
      this.licences = data
      if (typeof (updated) === 'function') {
        updated()
      }
    })
  }

  loadAdapters (fileName, updated) {
    let data = []
    const fs = require('fs')
    const readline = require('readline')

    const rl = readline.createInterface({
      input: fs.createReadStream(fileName),
      crlfDelay: Infinity
    })

    rl.on('line', (line) => {
      data.push(new Adapter(line))
    })

    rl.on('close', _ => {
      this.adapters = data
      if (typeof (updated) === 'function') {
        updated()
      }
    })
  }

  checkAdapters (licenseCode, updated) {
    var len = this.adapters.length
    for (var i = 0; i < len; i++) {
      this.adapters[i].checkLicence(licenseCode, _ => {
        if (i === len - 1) {
          if (typeof (updated) === 'function') {
            updated()
          }
        }
      })
    }
  }
}

module.exports = LicenceList
