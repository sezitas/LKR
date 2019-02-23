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

function LicenseList (licUpdate, adpUpdate) {
  this.licenses = []
  this.adapters = []
  this.licenseUpdated = licUpdate
  this.adapterUpdated = adpUpdate

  this.loadLicenses = (file) => {
    let data = []
    const fs = require('fs')
    const readline = require('readline')

    const rl = readline.createInterface({
      input: fs.createReadStream(file),
      crlfDelay: Infinity
    })

    rl.on('line', (line) => {
      data.push(new LicenseItem(line))
    })

    rl.on('close', _ => {
      this.licenses = data
      console.log(this.licenses)
      if (typeof (this.licenseUpdated) === 'function') {
        this.licenseUpdated()
      }
    })
  }
  this.loadAdapters = (file) => {
    let data = []
    const fs = require('fs')
    const readline = require('readline')

    const rl = readline.createInterface({
      input: fs.createReadStream(file),
      crlfDelay: Infinity
    })

    rl.on('line', (line) => {
      data.push(new Adapter(line))
    })

    rl.on('close', _ => {
      this.adapters = data
      if (typeof (this.adapterUpdated) === 'function') {
        this.adapterUpdated()
      }
    })
  }
  this.checkAdapters = (licenseCode) => {
    var len = this.adapters.length
    for (var i = 0; i < len; i++) {
      this.adapters[i].checkLicense(licenseCode, _ => {
        if ((i === len - 1) & (typeof (this.adapterUpdated) === 'function')) {
          this.adapterUpdated()
        }
      })
    }
  }
}

module.exports = LicenseList
