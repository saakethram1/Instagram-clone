const express=require('express')
const router=express.Router()
const mongoose=require('mongoose')
const requireLogin=require('../middleware/requireLogin')
const Post=mongoose.model("Post")


router.get('/allpost', requireLogin, (req, res) => {
    Post.find()
      .populate('postedBy', '_id name')
      .populate('comments.postedBy','_id name')
      .then((posts) => {
        res.json({ posts });
      })
      .catch((err) => {
        console.log(err);
      });
  });
  
 
router.get('/getsubpost', requireLogin, (req, res) => {
  //if postedby in following
  Post.find({postedBy:{$in:req.user.following}})
    .populate('postedBy', '_id name')
    .populate('comments.postedBy','_id name')
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});


  router.post('/createpost', requireLogin, (req, res) => {
    const { title, body, pic } = req.body;
    console.log(title, body, pic);
    if (!title || !body || !pic) {
      return res.status(422).json({ error: 'Please add all the fields' });
    }
    const post = new Post({
      title: title,
      body: body,
      photo: pic,
      postedBy: req.user,
    });
    post
      .save()
      .then((result) => {
        res.json({ post: result });
      })
      .catch((err) => {
        console.log(err);
      });
  });
  
  router.put('/like', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(
      req.body.postId,
      {
        $push: { likes: req.user._id },
      },
      { new: true }
    )
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        return res.status(422).json({ error: err });
      });
  });
  
  router.put('/unlike', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(
      req.body.postId,
      {
        $pull: { likes: req.user._id },
      },
      { new: true }
    )
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        return res.status(422).json({ error: err });
      });
  });

  router.put('/comment',requireLogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .then((result)=>{
        res.json(result);
    })
    .catch((err)=>{
        return res.status(422).json({error:err});
    })
})
 /*router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
  Post.findOne({_id:req.params.postId})
  .populate("postedBy","_id")
  .exec((err,post)=>{
      if(err || !post){
          return res.status(422).json({error:err})
      }
      if(post.postedBy._id.toString() === req.user._id.toString()){
            post.deleteOne()
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err)
            })
      }
  })
})*/
router.delete('/deletepost/:postId', requireLogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: err });
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post.deleteOne()
          .then(result => {
            res.json(result);
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({ error: "Could not delete post" });
          });
      } else {
        res.status(401).json({ error: "Unauthorized" });
      }
    });
});


  
  module.exports = router;