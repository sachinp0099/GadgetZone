let { Sequelize, Model, DataTypes, Op ,QueryTypes} = require('sequelize');
let sequelizeCon = new Sequelize('Mysql://root@localhost/e_commerce');
sequelizeCon.authenticate().then().catch((err) => {
    console.log('error', err)
});
// /.sync({ alter: true });
module.exports = {
    sequelizeCon, Model, DataTypes, Op ,QueryTypes
}