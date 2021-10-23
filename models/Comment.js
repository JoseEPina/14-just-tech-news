const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Comment extends Model {}

Comment.init(
   {
      // Columns
      id: {
         type: DataTypes.INTEGER,
         allowNull: false,
         primaryKey: true,
         autoIncrement: true,
      },
      comment_text: {
         type: DataTypes.STRING,
         allowNull: false,
         validate: {
            // This means the comment must be at least one character long. cannot be empty.
            len: [1],
         },
      },
      user_id: {
         type: DataTypes.INTEGER,
         references: {
            model: 'user',
            key: 'id',
         },
      },
      post_id: {
         type: DataTypes.INTEGER,
         references: {
            model: 'post',
            key: 'id',
         },
      },
   },
   {
      sequelize,
      freezeTableName: true,
      underscored: true,
      modelName: 'comment',
   }
);

module.exports = Comment;
