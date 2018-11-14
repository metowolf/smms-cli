const fs = require('fs')
const path = require('path')
const readChunk = require('read-chunk')
const fileType = require('file-type')
const request = require('request-promise')
const version = require('../package.json').version

const allowExt = ['jpg', 'png', 'gif', 'bmp']

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
  async upload(pathname) {

    if (!fs.lstatSync(pathname).isFile()) {
      throw new Error(`Invalid path`)
    }

    let buffer = readChunk.sync(pathname, 0, 4100)
    let filetype = fileType(buffer)
    if (filetype === null || !allowExt.includes(filetype.ext)) {
      throw new Error(`File is not a valid image`)
    }

    let formData = {
      smfile: fs.createReadStream(pathname),
      ssl: 1,
      format: 'json'
    }

    let options = {
      url: this.api.upload,
      formData,
      headers: this.headers,
      json: true
    }

    return request.post(options)
      .then(response => {
        if (response.code !== 'success') {
          throw new Error(`${response.code}: ${response.msg}`)
        }
        return response
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
      .then(response => {
        if (response.code !== 'success') {
          throw new Error(`${response.code}: ${response.msg}`)
        }
        return response
      })
  }

}
