const router = require('express').Router();
const { User, Post, Vote, Comment } = require('../../models');
const sequelize = require('../../config/connection');

// GET all users
router.get('/', (req, res) => {
   console.log('======================');
   Post.findAll({
      // Query configuration
      order: [['created_at', 'DESC']],
      attributes: [
         'id',
         'post_url',
         'title',
         'created_at',
         [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count'],
      ],
      include: [
         // Include Comment Model Here:
         {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
               model: User,
               attributes: ['username'],
            },
         },
         {
            model: User,
            attributes: ['username'],
         },
      ],
   })
      .then((dbPostData) => res.json(dbPostData))
      .catch((err) => {
         console.log(err);
         res.status(500).json(err);
      });
});

// GET by user ID
router.get('/:id', (req, res) => {
   Post.findOne({
      where: { id: req.params.id },
      attributes: [
         'id',
         'post_url',
         'title',
         'created_at',
         [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count'],
      ],
      include: [
         // Include Comment Model Here:
         {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
               model: User,
               attributes: ['username'],
            },
         },
         {
            model: User,
            attributes: ['username'],
         },
      ],
   })
      .then((dbPostData) => {
         if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
         }
         res.json(dbPostData);
      })
      .catch((err) => {
         console.log(err);
         res.status(500).json(err);
      });
});

// CREATE a POST
router.post('/', (req, res) => {
   // expects {title: 'Taskmaster goes public!',
   // post_url: 'https://taskmaster.com/press', user_id: 1
   Post.create({
      title: req.body.title,
      post_url: req.body.post_url,
      user_id: req.body.user_id,
   })
      .then((dbPostData) => res.json(dbPostData))
      .catch((err) => {
         console.log(err);
         res.status(500).json(err);
      });
});

// PUT- to update the Post's data (vote count/upvote) /api/posts/upvote
/*
! when we vote on a post, we are technically updating the post's data 
! THIS ROUTE MUST BE PLACED BEFORE THE '/:id' ROUTE BELOW, OTHERWISE, EXPRESS.JS WILL THINK THAT THE
! WORD 'upvote' IS A VALID PARAMETER FOR '/:id' 
*/
router.put('/upvote', (req, res) => {
   // Make sure the session exists first before
   if (req.session) {
      // Custom static method createdin models/Post.js
      // Pass session id along with all destructure properties on req.body
      Post.upvote({ ...req.body, user_id: req.session.user_id }, { Vote, Comment, User })
         .then((updateVoteData) => res.json(updateVoteData))
         .catch((err) => {
            console.log(err);
            res.status(500).json(err);
         });
   }
});

// PUT - to update the Post's title
router.put('/:id', (req, res) => {
   Post.update({ title: req.body.title }, { where: { id: req.params.id } })
      .then((dbPostData) => {
         if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id.' });
            return;
         }
         res.json(dbPostData);
      })
      .catch((err) => {
         console.log(err);
         res.status(err).json(err);
      });
});

// DELETE - destroy a post
router.delete('/:id', (req, res) => {
   Post.destroy({ where: { id: req.params.id } })
      .then((dbPostData) => {
         if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id.' });
            return;
         }
         res.json(dbPostData);
      })
      .catch((err) => {
         console.log(err);
         res.status(500).json(err);
      });
});

module.exports = router;
