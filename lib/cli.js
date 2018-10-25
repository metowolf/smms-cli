#!/usr/bin/env node

const fs = require('fs')
const util = require('util')
const glob = util.promisify(require('glob'))
const Table = require('cli-table3')
const commander = require('commander')
const smms = require('../')

// preload smms-cli history
const HOME_PATH = process.platform === 'win32' ? 'USERPROFILE' : 'HOME'
const DEFAULT_HISTORY_PATH = `${process.env[HOME_PATH]}/.smms-cli`

// utils
let loadHistory = () => {
  try {
    let data = fs.readFileSync(DEFAULT_HISTORY_PATH, 'utf8')
    data = data.trim()
    if (data.length) {
      return data.split("\n").map(x => x.split("\t"))
    } else {
      return []
    }
  } catch (e) {
    return []
  }
}

let saveHistory = (smms_history) => {
  let data = smms_history.map(x => x.join("\t")).join("\n")
  fs.writeFileSync(DEFAULT_HISTORY_PATH, data, 'utf8')
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
    return [ts2date(x[0]), x[1], x[2]]
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
    return x[2] === commander.delete || x[3] === commander.delete
  })
  if (data === undefined) {
    console.error(`Sorry, url or hash not found!`)
    return
  }
  smms
    .delete(data[3])
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
            output.push([json.data.filename, json.data.url])
            smms_history.push([json.data.timestamp, json.data.filename, json.data.url, json.data.hash])
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
