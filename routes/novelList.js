import express from "express";
import {NovelInfo,Text,UserInfo} from "../database/schema.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import {dirname} from 'path';
import { fileURLToPath } from "url";
import {tag} from "./variable.js"
import {Name,Authorize,NotAuthorize} from "./function.js";
const __dirname = dirname(fileURLToPath(import.meta.url));

const upload = multer()
const write = express.Router();
write.use(express.urlencoded())
write.use('/uploads',express.static('uploads'))

write.get("/",(req,res)=>{
  NovelInfo.collection.drop()
  Text.collection.drop()
})

write.get('/update',async (req,res)=>{
  res.render('novelMake',{name:await Name(req.cookies._id)})
})
write.post("/update",upload.single('novelThumbnail'),async(req,res)=>{
  const user = UserInfo.find({_id:req.cookies._id}) 
  const docs = await user
  const novel = new NovelInfo({
    novelName:req.body.novelName,
    novelLore:req.body.novelLore,
    novelAuthorId:docs[0]._id,
    novelAuthorName:docs[0].name,
    novelLiked:0,
    novelTag:[],
  })
  if(typeof req.file !== 'undefined')await fs.promises.writeFile(path.join(__dirname, `../uploads/${novel._id}.png`), req.file.buffer)
  await novel.save();

  res.redirect("/profile/mine")
})

write.get("/:id",async (req,res)=>{
  const info = await UserInfo.find({_id:req.cookies._id})
  const docs = await NovelInfo.find({_id:req.params.id})
  const content = await Text.find({parents:req.params.id})
  let isLiked
  if(!info[0]) isLiked=false
  else isLiked=info[0].likedNovel.includes(req.params.id)
  if(docs[0]){
  res.render("novelList",{ 
    name:await Name(req.cookies._id),
    novelName:docs[0].novelName,
    novelAuthor:docs[0].novelAuthorName,
    novelThumbnail:`http://localhost:3000/novel/uploads/${String(docs[0]._id)}.png`,
    novelLiked:docs[0].novelLiked,
    novelLore:docs[0].novelLore,
    isLiked:isLiked,
    isAuthor:req.cookies._id==docs[0].novelAuthorId,
    novelUrl:docs[0]._id,
    novelContent:content,
    novelTag:docs[0].novelTag,
  })
  }else{
    res.redirect('/')
  }
})
write.get("/:id/liked",NotAuthorize, async (req,res)=>{
  const info = await UserInfo.find({_id:req.cookies._id})
  if(info[0]){
    if(!info[0].likedNovel.includes(req.params.id)){
    await UserInfo.updateOne({_id:req.cookies._id},{$push:{likedNovel:req.params.id}})
    await NovelInfo.findOneAndUpdate({_id:req.params.id},{$inc:{novelLiked:1}})
    }else{
    await UserInfo.updateOne({_id:req.cookies._id},{$pullAll:{likedNovel:[req.params.id]}})
    await NovelInfo.findOneAndUpdate({_id:req.params.id},{$inc:{novelLiked:-1}})
    }
    res.redirect(`/novel/${req.params.id}`)
  }else{
    res.redirect("/login")
  }
})

write.get("/:id/tag",Authorize,async (req,res)=>{
  const tagged = await NovelInfo.find({_id:req.params.id})
  res.render('novelTag',{name:await Name(req.cookies._id),tag:tag,tagged:tagged[0].novelTag})
}).post("/:id/tag",async (req,res)=>{
  await NovelInfo.findOneAndUpdate({_id:req.params.id},{novelTag:req.body.tag})
  res.redirect(`/novel/${req.params.id}`)
})

write.get('/:id/edit',Authorize,async (req,res)=>{
  const write = NovelInfo.find({_id:req.params.id})
  const docs = await write
  res.render('novelMake',{
    name:await Name(req.params._id),
    novelName:docs[0].novelName,
    novelThumbnail:`http://localhost:3000/novel/uploads/${req.params.id}.png`,
    novelLore:docs[0].novelLore})
}).post('/:id/edit',Authorize,upload.single('novelThumbnail'),async (req,res)=>{
  const docs=await NovelInfo.findOneAndUpdate({_id:req.params.id},{
    novelName:req.body.novelName,
    novelLore:req.body.novelLore,
  })
  if(typeof req.file!=='undefined') await fs.promises.writeFile(path.join(__dirname, `../uploads/${req.params.id}.png`), req.file.buffer)
  if(docs) await docs.save()
  res.redirect(`/novel/${req.params.id}`)
})

write.get("/:id/write",Authorize,async (req,res)=>{
  const view = await Text.find({parents:req.params.id})
  res.render('novelWrite',{name:await Name(req.cookies._id).name,episode:view.length})
}).post("/:id/write",Authorize,async (req,res)=>{
  const novel = await NovelInfo.find({_id:req.params.id})
  const view = await Text.find({parents:req.params.id})

  const novelContent = new Text({
    parents:novel[0]._id,
    episode:view.length,
    episodeName:req.body.title,
    content:req.body.content,
    date:Date.now(),
  })
  await novelContent.save()
  res.redirect(`/novel/${req.params.id}`)
})
write.get("/:id/delete",Authorize,async(req,res)=>{
  let filepath = path.join(__dirname, `../uploads/${req.params.id}.png`)
  if(fs.existsSync(filepath)) fs.unlinkSync(filepath)
  await NovelInfo.deleteOne({_id:req.params.id})
  await Text.deleteOne({parents:req.params.id})
  res.redirect('/')
  
})

write.get("/:id/:episode",async (req,res)=>{
  if(req.params.id=='uploads'){
    return
  }
  const view = await Text.find({parents:req.params.id,episode:req.params.episode})
  if(Number(req.params.episode)>=1){
    const prev = await Text.find({parents:req.params.id,episode:Number(req.params.episode)-1})
  }
  const next = await Text.find({parents:req.params.id,episode:Number(req.params.episode)+1})
  const novel = await NovelInfo.find({_id:req.params.id})
  if(view[0]){
  res.render('novelView',{
    name:await Name(req.cookies._id),
    episode:Number(req.params.episode),
    episodeName:view[0].episodeName,
    content:view[0].content,
    novelUrl:`/novel/${req.params.id}`,
    isAuthor:novel[0].novelAuthorId===req.cookies._id,
    next:next[0]!=undefined,
    comment:view[0].comment,
  })
  }else{
    res.redirect(`/novel/${req.params.id}`)
  }
}).post("/:id/:episode",async(req,res)=>{
  await Text.findOneAndUpdate({parents:req.params.id,episode:req.params.episode},{$push:{comment:{userName:await Name(req.cookies._id),userId:req.cookies._id,value:req.body.comment}}})
  res.redirect(`/novel/${req.params.id}/${req.params.episode}`)
})
write.get("/:id/:episode/edit",Authorize,async (req,res)=>{
  const write = await Text.find({parents:req.params.id,episode:req.params.episode})
  res.render('novelWrite',{episodeName:write[0].episodeName,episodeContent:write[0].content,episode:write[0].episode,url:req.originalUrl})
}).post("/:id/:episode/edit",async (req,res)=>{
  const text = await Text.findOneAndUpdate({parents:req.params.id,episode:req.params.episode},{episodeName:req.body.title,content:req.body.content})
  if(text) text.save()
  res.redirect(`/novel/${req.params.id}`)
})


export default write