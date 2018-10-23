const request = require('request-promise')
const fs = require('fs')
const version = require('../package.json').version

module.exports = {

  VERSION: version

  api: {
    upload: 'https://sm.ms/api/upload',
    history: 'https://sm.ms/api/list',
    clear: 'https://sm.ms/api/clear',
    delete: 'https://sm.ms/delete/'
  },

  headers: {
    'User-Agent': `request/smms-cli ${version}`
  },

  upload(filename) {
    let formData = {
      smfile: fs.createReadStream(filename),
      ssl: 1,
      format: 'json'
    }
		return request.post({
      url: this.api.upload,
			headers: this.headers,
      formData,
      json: true
    })
	},

  history() {
    return request.get({
      url: this.api.history,
      headers: this.headers,
      json: true
    })
  },

  clear() {
    return request.get({
      url: this.api.clear,
      headers: this.headers,
      json: true
    })
  },

  delete(hash) {
    return request.get({
      url: this.api.delete,
      headers: this.headers,
      qs: {
        format: 'json'
      },
      json: true
    })
  }

}
