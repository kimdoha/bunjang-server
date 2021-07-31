const express = require('express');
const compression = require('compression');
const methodOverride = require('method-override');
var cors = require('cors');
module.exports = function () {
    const app = express();

    app.use(compression());

    app.use(express.json());

    app.use(express.urlencoded({extended: true}));

    app.use(methodOverride());

    app.use(cors());

    
    require('../src/app/User/userRoute')(app);
    require('../src/app/Category/cateRoute')(app);
    require('../src/app/Post/postRoute')(app);
    require('../src/app/Follow/followRoute')(app);
    require('../src/app/Myshop/myshopRoute')(app);
    require('../src/app/Talk/talkRoute')(app);
    require('../src/app/Pay/payRoute')(app);
    return app;
};