const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const utils = require('../utils');

const GIT_HASH_DATA_PATH = path.join(__dirname, '../db/data.json');

const git_hash = require('./git_hash');

const router = express.Router();

// retream parsed body before proxying
const restream = (proxyReq, req, res, options) => {
  if (req.body) {
    let bodyData = JSON.stringify(req.body);
    // incase if content-type is application/x-www-form-urlencoded -> we need to change to application/json
    proxyReq.setHeader('Content-Type','application/json');
    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
    // stream the content
    proxyReq.write(bodyData);
  }
}

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/gitHash', git_hash);

router.use('/:hash', createProxyMiddleware({
  target: `${process.env.FORWARD_URL}`,
  router: async (req) => {
    const object = await utils.readFile(GIT_HASH_DATA_PATH);

    const temp = object[req.params.hash];

    return `${process.env.FORWARD_URL}:${temp.port}`;
  },
  changeOrigin: true,
  pathRewrite: (path, req) => path.replace('/api/v1/' + req.params.hash, ''),
  logLevel: 'debug',
  onProxyReq: restream
}));

module.exports = router;
