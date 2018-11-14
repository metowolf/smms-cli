#!/usr/bin/env node

const Conf = require('conf')
const Table = require('cli-table3')

const fs = require('fs')
const path = require('path')
const util = require('util')
const glob = util.promisify(require('glob'))
const commander = require('commander')
const config = new Conf()
const smms = require('../')

// utils
let loadHistory = () => {
  let history = config.get('history')
  if (history === undefined) return []
  return history
}

let saveHistory = smms_history => {
  config.set('history', smms_history)
}

let collect = (val, arr) => {
  return arr.concat(val)
}

let ts2date = (ts) => {
  return new Date(ts * 1000).toLocaleString()
}

let parseGlob = async (files) => {
  let result = []
  for (let file of files) {
    let t = await glob(file)
    result.push(...t)
  }
  return result
}

let smms_history = loadHistory()

commander
  .version(smms.VERSION)
  .option('-f, --file [file ...]', 'Upload binary image files', collect, [])
  .option('-d, --delete [url/hash]', 'Delete image files')
  .option('-l --list', 'Show upload history (local)')
  .option('--history', 'Show upload history (remote)')
  .option('--clear', 'Clear history (both local and romote)')
  .parse(process.argv)

if (commander.history) {
  smms.history()
    .then(result => {
      let table = new Table({
        head: ['datetime', 'filename', 'url']
      })
      table.push(...result.data.map(x => {
        return [ts2date(x.timestamp), x.filename, x.url]
      }))
      console.log(table.toString())
    })
  return
}

if (commander.list) {
  let table = new Table({
    head: ['datetime', 'filename', 'url']
  })
  table.push(...smms_history.map(x => {
    return [ts2date(x.timestamp), x.filename, x.url]
  }))
  console.log(table.toString())
  return
}

if (commander.clear) {
  smms.clear()
  saveHistory([])
  return;
}

if (commander.delete) {
  let data = smms_history.find(x => {
    return x.url === commander.delete || x.hash === commander.delete
  })
  if (data === undefined) {
    console.error(`Sorry, url or hash not found!`)
    return
  }
  smms
    .delete(data.hash)
    .then((json) => {
      console.log(json.msg)
    })
    .catch(err => {
      console.error(err.msg || err.message)
    })
  return
}

if (commander.file.length || commander.args.length) {
  const args = commander.file.concat(commander.args)

  parseGlob(args).then(files => {
    let promises = [], output = []
    files.forEach((file) => {
      promises.push(
        smms.upload(file)
          .then((json) => {
            output.push([path.basename(file), json.data.url])
            smms_history.push({
              timestamp: json.data.timestamp,
              filename: json.data.filename,
              url: json.data.url,
              hash: json.data.hash
            })
          })
          .catch(err => {
            output.push([file, err.msg || err.message])
          })
      )
    })

    Promise.all(promises).then(() => {
      let table = new Table({
        head: ['filename', 'url']
      })
      table.push(...output)
      console.log(table.toString())
      saveHistory(smms_history)
    })
  })
}
