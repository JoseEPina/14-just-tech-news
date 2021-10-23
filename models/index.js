const User = require('./User');
const Post = require('./Post');
const Vote = require('./Vote');

// Create Associations
User.hasMany(Post, {
   foreignKey: 'user_id',
});

Post.belongsTo(User, {
   foreignKey: 'user_id',
});

// belongsToMany method allows User and
// Post models to query each other's info
User.belongsToMany(Post, {
   through: Vote,
   as: 'voted_posts',
   foreignKey: 'user_id',
});

Post.belongsToMany(User, {
   through: Vote,
   as: 'voted_posts',
   foreignKey: 'post_id',
});

// Connect User to Vote directly as well,
// to see the total number of votes on a post.
Vote.belongsTo(User, {
   foreignKey: 'user_id',
});

Vote.belongsTo(Post, {
   foreignKey: 'post_id',
});

User.hasMany(Vote, {
   foreignKey: 'user_id',
});

Post.hasMany(Vote, {
   foreignKey: 'post_id',
});

module.exports = { User, Post, Vote };
