#!/usr/bin/env node

const fs = require('fs')
const meow = require('meow')
const smms = require('../')

const cli = meow(`
 Usage
   $ smms <filename>

 Options
   --version, -V  show smms-cli version

 Examples
	 $ smms example.png
   $ smms -V
`, {
  flags: {
    version: {
      alias: 'V'
    }
  }
})

if (cli.input.length === 0 && process.stdin.isTTY) {
	console.error('filename required')
	process.exit(1)
}

if (cli.input.length) {
  smms
    .upload(cli.input[0])
    .then(res => console.log(res.data.url))
    .catch(res => {
      console.error(err)
      process.exit(1)
    })
}
