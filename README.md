<p align="center">
<img src="https://i.loli.net/2018/10/23/5bcf185568a22.png" width="300px" alt="smms-cli">
</p>

<p align="center">
<a href="https://i-meto.com"><img alt="Author" src="https://img.shields.io/badge/Author-METO-blue.svg?style=flat-square"/></a>
<a href="https://www.npmjs.com/package/smms-cli"><img alt="Version" src="https://img.shields.io/npm/v/smms-cli.svg?style=flat-square"/></a>
<a href="https://travis-ci.org/metowolf/smms-cli"><img alt="Travis" src="https://img.shields.io/travis/metowolf/smms-cli.svg?style=flat-square"></a>
<img alt="License" src="https://img.shields.io/npm/l/smms-cli.svg?style=flat-square"/>
</p>


## Command-line Usage

### Installation

```bash
npm install smms-cli -g
```

[![asciicast](https://asciinema.org/a/nfv2tyJd9pMhSsuZ2UhITHNYl.png)](https://asciinema.org/a/nfv2tyJd9pMhSsuZ2UhITHNYl)

### Usage

Upload a single image

```bash
smms dog.png
```

Display smms-cli version:

```bash
smms --version
```

## Module Usage

### Installation

```bash
npm install smms-cli
```

### API

https://sm.ms/doc/

### Usage

#### Requiring the module:

```javascript
const smms = require('smms-cli')
```


#### Uploading files

```javascript
smms.upload('./test/nodejs.png')
    .then(json => {
        console.log(json)
    })
    .catch(err => {
        console.error(err.message)
    })
```

success response
```json
{
    "code": "success",
    "data": {
        "width": 512,
        "height": 512,
        "filename": "nodejs.png",
        "storename": "5bcf14f27edca.png",
        "size": 6538,
        "path": "/2018/10/23/5bcf14f27edca.png",
        "hash": "IJsRz2bQpvPr4lA",
        "timestamp": 1540297970,
        "ip": "35.201.144.6",
        "url": "https://i.loli.net/2018/10/23/5bcf14f27edca.png",
        "delete": "https://sm.ms/delete/IJsRz2bQpvPr4lA"
    }
}
```

#### Upload history

```javascript
smms.history()
    .then(json => {
        console.log(json.data)
    })
    .catch(err => {
        console.error(err.message)
    })
```

success response
```json
{
    "code": "success",
    "data": [
        {
            "width": 512,
            "height": 512,
            "filename": "nodejs.png",
            "storename": "5bcf14f27edca.png",
            "size": 6538,
            "path": "/2018/10/23/5bcf14f27edca.png",
            "hash": "IJsRz2bQpvPr4lA",
            "timestamp": 1540297970,
            "ip": "35.201.144.6",
            "url": "https://i.loli.net/2018/10/23/5bcf14f27edca.png",
            "delete": "https://sm.ms/delete/IJsRz2bQpvPr4lA"
        }
    ]
}
```

#### Clear upload history

```javascript
imgur.clear()
    .then(status => {
        console.log(status.msg);
    })
    .catch(err => {
        console.error(err.msg)
    })
```

#### Deleting upload

Delete an image based on the deletehash (generated during the image upload)

```javascript
imgur.delete(hash)
    .then(status => {
        console.log(status.msg);
    })
    .catch(err => {
        console.error(err.msg)
    })
```

## Author

**smms-cli** © [metowolf](https://github.com/metowolf), Released under the [MIT](./LICENSE) License.<br>

> Blog [@meto](https://i-meto.com) · GitHub [@metowolf](https://github.com/metowolf) · Twitter [@metowolf](https://twitter.com/metowolf) · Telegram Channel [@metooooo](https://t.me/metooooo)
