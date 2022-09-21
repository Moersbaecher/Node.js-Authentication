//user model
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            isEmail: true,
            allowNull: false
        },
        userName: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },        
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {timestamps: true}, )
    return User
};