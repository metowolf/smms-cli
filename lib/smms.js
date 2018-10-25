const fs = require('fs')
const util = require('util')
const glob = util.promisify(require('glob'))
const request = require('request-promise')
const version = require('../package.json').version

module.exports = {

  VERSION: version,

  api: {
    upload: 'https://sm.ms/api/upload',
    history: 'https://sm.ms/api/list',
    clear: 'https://sm.ms/api/clear',
    delete: 'https://sm.ms/delete/'
  },

  headers: {
    'User-Agent': `request/smms-cli ${version}`
  },

  /**
  * Upload an image file
  * @param   {string}  filename - path to a binary image file
  * @returns {promise}
  */
  upload(filename) {
    return glob(filename)
      .then(file => {
        if (!file.length) {
          throw new Error(`Invalid filename`)
        }
        let formData = {
          smfile: fs.createReadStream(filename),
          ssl: 1,
          format: 'json'
        }
        return request
          .post({
            url: this.api.upload,
            headers: this.headers,
            formData,
            json: true
          })
          .then((json) => {
            if (json.code !== 'success') {
              throw new Error(json.msg)
            }
            return json
          })
      })
      .catch(err => {
        throw err
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
    return request
      .get({
        url: this.api.delete + hash,
        headers: this.headers,
        qs: {
          format: 'json'
        },
        json: true
      })
      .then((json) => {
        if (json.code !== 'success') {
          throw new Error(json.msg)
        }
        return json
      })
  }

}
