const router = require('express').Router();
const { Comment } = require('../../models');

// GET comment routes
router.get('/', (req, res) => {
   console.log('======================');
   Comment.findAll({
      // Query configuration
      attributes: ['id', 'comment_text', 'user_id', 'post_id', 'created_at'],
   })
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
         console.log(err);
         res.status(500).send(err);
      });
});

// POST routes for posting comments
router.post('/', (req, res) => {
   // Check the session data
   if (req.session) {
      Comment.create({
         comment_text: req.body.comment_text,
         post_id: req.body.post_id,
         // use the id from the session
         user_id: req.body.user_id,
      })
         .then((dbCommentData) => res.json(dbCommentData))
         .catch((err) => {
            console.log(err);
            res.status(400).json(err);
         });
   }
});

// DELETE route for deleting comments
router.delete('/:id', (req, res) => {
   Comment.destroy({ where: { id: req.params.id } })
      .then((dbPostData) => {
         if (!dbPostData) {
            res.status(404).json({ message: 'No comment found with this id.' });
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
