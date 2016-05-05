module.exports = function (sequelize, DataTypes) {
  return sequelize.define("user", {
    firstName: {
      type: DataTypes.STRING,
      field: "first_name"
    },
    lastName: {
      type: DataTypes.STRING,
      field: "last_name"
    },
    email: {
      type: DataTypes.STRING
    },
    cpfNumber: {
      type: DataTypes.STRING,
      field: "cpf",
      unique: true
    },
    password: {
      type: DataTypes.STRING
    },
    auhorized: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'authorized'
    },
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'authorized'
    }
  },{
    freezeTableName: true
  });
}
