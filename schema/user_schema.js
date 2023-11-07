let { Sequelize, Model, DataTypes, sequelizeCon } = require('../init/dbconfig')
class User extends Model { }
User.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: false,

    },
    Email_Id: {
        type: DataTypes.STRING,
        allowNull: false


    },
    Contact: {
        type: DataTypes.STRING,
        allowNull: false

    },
    Password: {
        type: DataTypes.STRING,
        allowNull: false

    },
    token:{
        type:DataTypes.STRING(500),
        allowNull:true,

    },
    is_active: {
        type: DataTypes.BOOLEAN,
        
        defaultValue: true

    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        
        defaultValue: false

    },
},
    { tableName: 'user', modelName: 'User', sequelize: sequelizeCon }
);

module.exports = { User }
