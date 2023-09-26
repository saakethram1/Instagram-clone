const express=require('express')
const router=express.Router()
const mongoose=require('mongoose')
const User=mongoose.model('User')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const {JWT_SECRET}=require('../keys')
const requireLogin=require('../middleware/requireLogin')
const Post=mongoose.model("Post")

router.get('/protected',requireLogin,(req,res)=>{
    res.send("Hello User");
})

router.get('/',(req,res)=>{
    res.send("Hello");
})
router.post('/signup',(req,res)=>{
    const {name,email,password,pic}=req.body;
    if(!name || !email || !password || !pic){
        return res.status(422).json({error:"please add all the fields"});
    };
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"user already exists with this email"});
        }
    bcrypt.hash(password,12)
    .then(hashedpassword=>{
        const user=new User({
            email,
            password:hashedpassword,
            name,
            pic
        })
        user.save()
        .then(user=>{
            res.json({message:"saved successfully"})
        })
        .catch(err=>{
            console.log(err)
        })
    })
        
    })
    .catch(err=>{
        console.log(err);
    })
})
router.post('/signin',(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(422).json({error:"please enter email or password"});
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                //res.json({message:"Successfully signed in"})
                const token=jwt.sign({_id:savedUser._id},JWT_SECRET)
                const {_id,name,email,followers,following,pic} = savedUser
                res.json({token,user:{_id,name,email,followers,following,pic}})
            }
            else{
                return res.status(422).json({error:"Invalid Email or password"})
            }
        })
        .catch(err=>{
            console.log(err);
        })
    })
})
router.get('/mypost',requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate('postedBy',"_id name")
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err)
    })
})
module.exports=router