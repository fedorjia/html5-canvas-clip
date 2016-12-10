'use strict';
const path = require('path');
const express = require('express');
const settings = require('./settings');
const app = express();

app.use('/', express.static(path.resolve(__dirname, 'static'), {maxAge: 86400000 * 7}));

app.listen(settings.port);

console.log(settings['appname'] + ' runnng port:' + settings.port);
