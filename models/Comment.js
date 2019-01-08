module.exports = (sequelize, type) => {
    return sequelize.define('Comment', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        text: type.STRING
    })
};