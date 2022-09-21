const {Sequelize, DataTypes} = require('sequelize');


const sequelize = new Sequelize(`postgres://postgres:10023066@localhost:5432/proj1-db`,
 {dialect: "postgres",});


//connection check
    sequelize.authenticate().then(() => {
        console.log('Database connected do app')
    }).catch((err) => {
        console.log(err)
    });

    const db = {};
    db.Sequelize = Sequelize
    db.sequelize = sequelize

    //connecting to model
    db.users = require('./userModel') (sequelize, DataTypes);

module.exports = db;