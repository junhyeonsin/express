import express from 'express';
import {UserInfo} from "../database/schema.js";

const login = express.Router();

login.get('/',(req,res) =>{
  res.render('userLogin')
})
login.use(express.urlencoded())
login.post('/',async (req,res) => {
  const user = UserInfo.find({id:req.body.id,password:req.body.password}) 
  const docs = await user
  if(docs[0]){
  res.cookie("_id",docs[0]._id)
  res.redirect('/')
  }else{
    res.render('userLogin',{error:'아이디 혹은 비밀번호가 잘못됐습니다.'})
  }
})

login.get("/reset",async (req,res)=>{
 UserInfo.deleteOne({_id:req.cookies._id})
 res.redirect("/") 
})

export default login