const smms = require('../lib/smms');

(async () => {

  let result

  console.log(`===> upload image`)
  result = await smms.upload('nodejs.png')
  if (result.code === 'success') {
    console.log(`url: ${result.data.url}`)
    console.log(`hash: ${result.data.hash}`)
  } else {
    throw new Error(result);
  }

  setTimeout(async () => {
    console.log(`===> delete image`)
    result = await smms.delete(result.data.hash)
    if (result.code === 'success') {
      console.log(`msg: ${result.msg}`)
    } else {
      throw new Error(result);
    }
  }, 5000);

})()
