import express from "express";
import {NovelInfo} from "../database/schema.js";
import {tag} from "./variable.js";
import {Name} from "./function.js";

const search = express.Router();

search.use('/uploads',express.static('uploads'))

search.get('/',async (req,res)=>{
  res.redirect(`/search/name?search=${req.query.search}`)
})

search.get('/name',async (req,res)=>{
  const novel = await NovelInfo.find({novelName:{$regex:req.query.search}})
  let name = await Name(req.cookies._id)
  res.render('searchName',{name:name,novel:novel,searchName:req.query.search})
})
search.get("/author",async (req,res)=>{
  const novel = await NovelInfo.find({novelAuthorName:{$regex:req.query.search}})
  let name = await Name(req.cookies._id)
  res.render('searchName',{name:name,novel:novel,searchName:req.query.search})
})
search.get('/tag',async (req,res)=>{
  const novel = await NovelInfo.find({novelTag:{$all : req.query.search}})
  let name = await Name(req.cookies._id) 
  res.render('searchTag',{name:name,novel:novel,searchName:req.query.search,tag:tag})
})

export default search