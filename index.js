const express = require('./config/express');
const {logger} = require('./config/winston');

let port;
//console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
    port = 3002;

} else if (process.env.NODE_ENV === 'production') {
    port = 3003;
}
express().listen(port);
logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);