const express = require('express');
const path = require('path');
const utils = require('../utils');
const moment = require('moment');

const GIT_HASH_DATA_PATH = path.join(__dirname, '../db/data.json');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(['😀', '😳', '🙄']);
});

router.get('/:hash', async (req, res) => {
  const object = await utils.readFile(GIT_HASH_DATA_PATH);

  const temp = object[req.params.hash];
  
  res.json({
    hash: req.params.hash,
    ...temp,
  });
});


router.post('/', async (req, res) => {
  // console.log('req.body', req.body);

  const object = await utils.readFile(GIT_HASH_DATA_PATH);

  object[req.body.hash] = {
    port: req.body.port,
    savedOn: moment().format()
  }

  // console.log('file', object)

  const newFile = await utils.writeFile(GIT_HASH_DATA_PATH, object);

  res.json({
    success: newFile != false ? true : false
  });
});

// TODO: server clean up? 
router.delete('/:hash', async (req, res) => {
  // console.log('request', req.params.hash);

  let result = false;

  const object = await utils.readFile(GIT_HASH_DATA_PATH);

  if (object.hasOwnProperty(req.params.hash)) {
    delete object[req.params.hash];
    result = true;
  }

  // console.log('file', object)

  const newFile = await utils.writeFile(GIT_HASH_DATA_PATH, object);

  res.json({
    success: result
  });
});

module.exports = router;
