//Dependencies
let express = require('express');
let bodyParser = require('body-parser');
let gateway = require('./router/gateway');

//App level config
let app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies
app.use(errorInterceptor);
app.listen(3000);
// start API gateway
gateway(app);

//Interceptor
function errorInterceptor(err, req, res, next) {
    console.error(err);
    res.status(500).send({status: 500, message: 'internal error', type: 'internal'});
};
module.exports = { app: app } ; //for tests
