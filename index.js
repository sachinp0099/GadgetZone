let express = require('express');
let app = express();
let config=require('config')
let session = require('express-session');
let { routes } = require("./routes.js");
let port = config.get('port')
app.use(session({
    secret: '#&ASR$@67$%'

}))


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs')
app.use(routes)
app.use(express.static(__dirname + '/public'));



app.listen(port, () => {
    console.log("active",port)
});