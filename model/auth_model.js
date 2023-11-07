let joi = require("joi");
let { User } = require("../schema/user_schema");
let bcrypt = require('../helpers/security')
let { up } = require('../schema/up_schema')
async function check(data) {
    let schema = joi.object({
        name: joi.string().required(),
        email: joi.string().required(),
        phone: joi.number().required(),
        password: joi.string().required()
    })
    let valid = await schema.validateAsync(data).catch((err) => {
        return { error: err }
    })
    if (!valid || (valid && valid.error)) {
        let msg = []
        for (let i of valid.error.details) {

            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid }
}

async function create(params) {
    let valid = await check(params).catch((err) => {
        return { error: err }
    })
    if (!valid || (valid && valid.error)) {
        return { error: valid.error }
    }

    let find = await User.findOne({ where: { Email_Id: params.email } }).catch((err) => {
        return { error: err }
    })
    if (find) {
        return { error: "user already exist" }
    }
    let password = await bcrypt.hash(params.password).catch((err) => {
        return { error: err }
    })
    if (!password || (password && password.error)) {
        return { error: password.error }
    }
    let userData = {
        Name: params.name,
        Email_Id: params.email,
        Contact: params.phone,
        Password: password.data
    }
    let data = await User.create(userData).catch((err) => {
        return { error: err }
    })

    if (!data || (data && data.error)) {

        return { error: "Internal Server" }
    }
    // return { data: data }
    let userPermission = {
        user_id: data.id,
        permission_id: 1
    }
    let upData = await up.create(userPermission).catch((err) => {
        return { error: err }
    })
    console.log("db", upData)
    if (!upData || (upData && upData.error)) {
        return { error: "Internal server error" }
    }
    return { data }
}

async function checkLogin(params) {
    let schema = joi.object({
        email: joi.string().required(),
        password: joi.string().required()
    })

    let valid = await schema.validateAsync(params).catch((err) => {
        return { error: err }
    })
    if (!valid || (valid && valid.error)) {
        let msg = [];
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: err }
    }
    return { data: valid }
}

async function userLogin(params) {
    let valid = await checkLogin(params).catch((err) => {
        return { error: err }
    })
    if (!valid || (valid && valid.error)) {
        return { error: valid.error }
    }

    let find = await User.findOne({ where: { Email_Id: params.email } }).catch((error) => {
        return { error }
    })
    // console.log("user", find)
    if (!find || (find && find.error)) {
        return { error: "User not found" }
    }
    console.log("password", params.password, find.Password);
    let confirmation = await bcrypt.compare(params.password, find.Password).catch((err) => {
        return { error: err }
    })
    console.log("auth", confirmation)
    if (!confirmation || (confirmation && confirmation.error)) {
        return { error: "User password is not found" }
    }

    let token = await bcrypt.encrypt({ id: find.id }, '#A78&&@#4D').catch((err) => {
        return { error: err }
    })
    if (!token || (token && token.error)) {
        return { error: token.error }
    }

    let updateToken = await User.update({ token: token }, { where: { id: find.id } }).catch((err) => {

        return { errror: err }
    })
    if (!updateToken || (updateToken && updateToken.error) || (updateToken && updateToken[0] <= 0)) {
        return { error: "internal server error" }
    }
    return { data: "login successfull", token: token }
}

// //forget password

// async function checkPassword(data){
//     let forgetschema = joi.object({
//         email:joi.string().email().min(8).max(20).required()
//     })
//     let valid = await forgetschema.validateAsync(data).catch((err)=>{
//         return {error:err}
//     })
//     if(!valid || (valid && valid.error))
//     {
//         let msg=[]
//         for(let i of valid.error.details){
//             msg.push(i.message)
//         }
//         return {error:message}
//     }
//     return {data:valid}
  
// }

// async function forgetPassword(params){
//     let valid = await forgetPassword(params).catch((err)=>{
//         return {error:err}
//     })
//     if(!valid || (valid && valid.error)){
//         return {error:valid.error}
//     }
//     let find = await User.findOne({where:{email_id:params.email}}.catch((err)=>{
//         return {error:err}
//     }))
//     (!find || (find && find.error))
//     {
//         return {error:"user id not found"}
//     }
//     let otp = otpGenerator.generate(6, {upperCaseAlphabet: false, specialChars:false, lowerAlphabets:false});

//     let hashotp = await security.hash(otp).catch((err)=>{
//         return {error:err}
//     })


// }

module.exports = { create, userLogin }