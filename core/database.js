import { Sequelize, DataTypes } from 'sequelize'
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'db.sqlite'
})

sequelize.sync()

export default { sequelize }
