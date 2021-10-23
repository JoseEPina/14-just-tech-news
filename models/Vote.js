const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Vote extends Model {}

Vote.init(
   {
      // ?? Is this the Vote ID#?
      id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      // ?? User ID# ??
      user_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
         references: {
            model: 'user',
            key: 'id',
         },
      },
   },
   {
      sequelize,
      timestamps: false,
      freezeTableName: true,
      underscored: true,
      modelName: 'vote',
   }
);

module.exports = Vote;
