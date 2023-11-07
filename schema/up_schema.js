let { sequelizeCon, Model, DataTypes } = require('../init/dbconfig')
class up extends Model { }
up.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    permission_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, { tableName: 'up', ModelName: 'up', sequelize: sequelizeCon })
module.exports = { up }