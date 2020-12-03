const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const utils = require('../utils');

const GIT_HASH_DATA_PATH = path.join(__dirname, '../db/data.json');

const git_hash = require('./git_hash');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/gitHash', git_hash);

router.use('/:hash', createProxyMiddleware({
  target: `${process.env.FORWARD_URL}`,
  // target: `http://localhost:3000`,
  router: async (req) => {
    const object = await utils.readFile(GIT_HASH_DATA_PATH);

    const temp = object[req.params.hash];

    return `${process.env.FORWARD_URL}:${temp.port}`;
    // return `http://localhost:3000`;
  },
  changeOrigin: true,
  // pathRewrite: {
  //   [`^/json_placeholder`]: '',
  // },
  pathRewrite: (path, req) => path.replace('/api/v1/' + req.params.hash, ''),
  logLevel: 'debug',
}));

module.exports = router;
