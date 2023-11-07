let jwt = require('jsonwebtoken')
let bcrypt = require('bcrypt')
function encrypt(text, key) {
    return new Promise((resolve, reject) => {
        jwt.sign(text, key, (error, token) => {
            if (error) {
                return reject(error)
            }
            return resolve(token)
        });
    });
}
function decrypt(text, key) {
    return new Promise((resolve, reject) => {
        jwt.verify(text, key, (error, token) => {
            if (error) {
                return reject(error)
            }
            return resolve(token)
        });
    });
}


async function hash(pt, salt = 10) {
    let encrypt = await bcrypt.hash(pt, salt).catch((err) => {
        return { error: err }
    })
    if (!encrypt || (encrypt && encrypt.error)) {
        return { error: encrypt.error }
    }
    return { data: encrypt }
}

async function compare(pt, et) {
    let check = await bcrypt.compare(pt, et).catch((error) => {
        return { error }
    })
    if (!check || (check && check.error)) {
        return { error: (check && check.error) ? check.error : true }
    }
    return { data: true }
}

module.exports = { encrypt, decrypt, hash, compare }
