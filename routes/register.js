import express from "express";
import {UserInfo} from "../database/schema.js";

const register = express.Router();

register.get("/",(req,res)=> {
  res.render('userRegister')
})

register.use(express.urlencoded())
register.post('/',async (req,res)=>{
  if(req.body.password!==req.body.repassword){
    return res.render("userRegister",{error:"비밀번호가 다릅니다.",nickname:req.body.name,id:req.body.id,password:req.body.password})
  }else{
  const user = UserInfo.find({id:req.body.id}) 
  const docs = await user
  
  if(docs[0]){
     res.render('userRegister',{error:"아이디가 이미 존재합니다."})
  }else{
  const info = new UserInfo({
    name:req.body.name,
    id:req.body.id,
    password:req.body.password,
    userRole:0,
    likedNovel:[],
  })
  await info.save()
  res.redirect('/login')
  }
}})

export default register