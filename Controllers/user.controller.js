const {userModel}=require("../Models/user.model");
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

require('dotenv').config()

const userSignup=async (req,res)=>{
    let {Email,Password}=req.body;

    try{
     let user=await userModel.findOne({Email})
     if(user){
       return res.status(409).send({'success':false, 'error':"User already exist, please login"})
     }
  
     const hash=bcrypt.hashSync(Password, 6)
     let newUser=new userModel({Email,Password:hash})
     console.log(newUser)
     await newUser.save()
     res.status(201).send({'success':true, 'message':"New user registered successfully..."}) 
  } catch(error){
     res.status(400).send({"error":error.message})
    }
}

const userLogin=async (req,res)=>{
    let {Email,Password}=req.body;

    try{
        let user=await userModel.findOne({Email})
        if(!user){
          return res.status(409).send({'success':false, 'error':"Wrong email."})
        }

        bcrypt.compare(Password, user.Password, function (err,result) {
            if(err){
                return res.status(500).send({'success':false, 'error':"An error occurred during password comparison."})
            }

            if(result){
                const token=jwt.sign({userID:user._id},
                    process.env.accesstoken, {expiresIn:'7d'});
                 res.status(201).send({'success':true, 'message':"Login successfully...", token:token});   
            } else {
                res.status(401).send({'success':false, "error":"Wrong password."})
            }
        })
    } catch(error){
        return res.status(500).send({'success':false, 'error':"An error occurred while processing the request."})
    }
}

module.exports = {
    userSignup,
    userLogin
}