import express from "express";
import {NovelInfo,UserInfo} from "../database/schema.js";
import { Name } from "./function.js";
const profile = express.Router();

profile.get("/", async (req,res)=>{
  let name = await Name(req.cookies._id)
  const user = await UserInfo.find({_id:req.cookies._id}) 
  res.render('profile',{name:name,ticket:user[0].ticket})
})
profile.get("/mine", async (req,res) => {
  let name = await Name(req.cookies._id)
  const novelList = await NovelInfo.find({novelAuthorId:req.cookies._id})
  res.render('profileMine',{name:name,novel:novelList})
})

profile.get("/liked",async (req,res)=>{
  const user = await UserInfo.find({_id:req.cookies._id})
  let novel=[]
  let name=""
  if(user[0]){
    name=user[0].name
  for(let i=0;i<user[0].likedNovel.length;i++){
    novel.push(await NovelInfo.find({_id:user[0].likedNovel[i]}))
  }
}
  res.render("profileLiked",{name:name,novel:novel})
})

export default profile