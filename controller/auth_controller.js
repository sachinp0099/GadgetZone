let auth_model = require('../model/auth_model')

async function index(req, res) {
    res.render('reglog', {});
}

async function register(req, res) {
    console.log(req.body);
    let modelData = await auth_model.create(req.body).catch((err) => {
        return { error: err }
    })
    console.log(modelData);
    if (!modelData || (modelData && modelData.error)) {
        let error = (modelData && modelData.error) ? modelData.error : "Internal server error";
        console.log("control", modelData.error);
        return res.send({ error })
    }
    return res.redirect('/?msg=success')
}
async function login(req, res) {
    let loginData = await auth_model.userLogin(req.body).catch((err) => {
        return { error: err }
    })
    console.log("data", loginData)
    if (!loginData || (loginData && loginData.error)) {
        let error = (loginData && loginData.error) ? loginData.error : "internal server error";
        return res.send({ error })
    }
    // return res.send({ data: "login successful", token: loginData.token })
    req .session.token=loginData.token
    return res.redirect("/Dashboard")
}
module.exports = { register, login, index }