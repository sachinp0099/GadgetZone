let express = require("express");
let routes = express.Router();
// let auth = require('./controller/user');
let product = require("./controller/product");
let auth = require('./controller/auth_controller')
let authMid = require('./middleware/auth_middleware')
let dashboard=require('./controller/dashboard')



//user rotues
routes.get('/',auth.index);
routes.get('/login',auth.index)
routes.post('/register', auth.register);
routes.post('/Login', auth.login);
routes.get('/dashboard',authMid.auth('User'),dashboard.dashboard );

//product routes
routes.get('/product/create',authMid.auth('product_create'),product.addUI)
routes.post('/product/create',authMid.auth('product_create'),product.createProduct)
routes.get('/product', authMid.auth('product_view'),product.viewAll)
routes.get('/product/:id',authMid.auth('product_view'),product.viewDetails)
routes.get('/product/update/:id',authMid.auth('product_update'),product.updateUI)
routes.post('/product/:id',authMid.auth('product_update'),product.update)
routes.post('/product/:id',authMid.auth('product_delete'),product.update)

module.exports = { routes }













// routes.post('/product', product.createProduct);
// routes.get('/jquery', product.registerLogin);
// routes.post('/user', user.createUser);