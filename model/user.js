let { User } = require('../schema/user_schema')
let joi = require('joi')
async function create(params) {
    let valid = await check(params).catch((err) => {
        return { error: err }
    });
    if (!valid || (valid && valid.error)) {
        return { error: valid.error }
    }
    let userData = { 
        Name: params.username,
        Email_Id: params.email,
        Contact: params.phone,
        Password: params.password
    }
    let data = await User.create(userData).catch((err) => {
        return { error: err }
    });
    if (!data || (data && data.error)) {
        console.log('mysql', data)
        return { error: 'internal server error' }
    }
    return { data: data }
}

async function check(data) {
    let schema = joi.object({
        username: joi.string().min(8).max(25).required(),
        email: joi.string().min(6).max(25).required(),
        phone: joi.string().required(),
        password: joi.string().min(8).max(14).required()
    })
    let valid = await schema.validateAsync(data).catch((err) => {
        return { error: err }
    });
    if (!valid || (valid && valid.error)) {
        let msg = [];
        for (let i of valid.error.details) {
            msg.push(i.message);
        }
        return { error: msg }
    }
    return { data: valid }
}
module.exports = { create }