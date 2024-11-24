import { Sequelize, DataTypes } from 'sequelize'
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'db.sqlite'
})

const User = sequelize.define('User', {
    discordId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    username: {
        type: DataTypes.STRING
    }
})

sequelize.sync()

export default { sequelize }
