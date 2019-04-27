const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const routes = require('./routes');

if (app.get('env') === 'development'){
    app.locals.pretty = true;
}

app.use(bodyParser.urlencoded({ extended: true}));

app.use('/',routes());
app.listen(3000);

module.export = app;