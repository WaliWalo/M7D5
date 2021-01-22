module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define("review", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rate: {
      type: DataTypes.INTEGER,
      allowNull: false,
      min: 0,
      max: 5,
    },
  });
  Review.associate = (models) => {
    Review.belongsTo(models.User);
    Review.belongsTo(models.Product);
  };
  return Review;
};
