module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  User.associate = (models) => {
    User.belongsToMany(models.Product, {
      through: { model: models.Review, unique: false },
    });
    User.hasMany(models.Review);
    User.belongsToMany(models.Product, {
      through: { model: models.Cart, unique: false },
    });
    User.hasMany(models.Cart);
  };
  return User;
};
