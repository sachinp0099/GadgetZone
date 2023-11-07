// let{QueryTypes}=require('sequelize')
let { sequelizeCon, QueryTypes } = require('../init/dbconfig')
let bcrypt = require('../helpers/security')
function auth(permission) {
    return async (req, res, next) => {
        if (typeof (permission) != 'string') {
            return res.send(401).send('Unauthorized')
        }
        let token = req.session.token
        // console.log("token", token)
        if (typeof (token) != 'string') {
            return res.redirect('/login?msg=unauthorized')
        }
        let decrypt = await bcrypt.decrypt(token, '#A78&&@#4D').catch((err) => {
            return { error:err }
        })
        if (!decrypt || (decrypt && decrypt.error)) {
            return res.redirect('/login?msg=unauthorized')
        }
        let query = `select user.id,user.Name, permission.name as permission
        from user
        left join up
        on user.id=up.user_id
        left join permission
        on up.permission_id=permission.id
        where user.id='${decrypt.id}'
        and token='${token}'`;
        //console.log(query);
        let user = await sequelizeCon.query(query, { type: QueryTypes.SELECT }).catch((error) => {
            return { error }
        })
        console.log("user", user);
        if (!user || (user && user.error)) {
            return res.redirect('/login?msg=unauthorized2')
        }
        let permissions = {}
        for (let i of user) {
            if (i.permission) {
                permissions[i.permission] = true
            }
        }
        console.log(permissions);
        if (permissions.length <= 0 || (!permissions[permission])) {
            return res.redirect('/login?msg=unauthorized3')
        }
        req["userdata"] = {
            name: user[0].Name,
            id: user[0].id,
            permissions
        }
        console.log(req.userdata)
        next();
    }
}
module.exports = { auth }