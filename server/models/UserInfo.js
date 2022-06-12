module.exports = (sequelize, dataTypes) => {

    const UserInfo = sequelize.define("UserInfo", {
        firstName: {
            type: dataTypes.STRING,
            allowNull: false
        },
        LastName: {
            type: dataTypes.STRING,
            allowNull: false
        },
        image: {
            type: dataTypes.STRING,
            allowNull: false
        },
        phoneNumbre: {
            type: dataTypes.STRING,
            allowNull: false
        },
        email: {
            type: dataTypes.STRING,
            allowNull: false
        },
        adress: {
            type: dataTypes.STRING,
            allowNull: false
        },
        password: {
            type: dataTypes.STRING,
            allowNull: false
        }
    })

    return UserInfo
}