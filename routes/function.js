import {NovelInfo,UserInfo} from "../database/schema.js";

const Name = async(id)=>{
  const user = await UserInfo.find({_id:id}) 
  let name=""
  if(user[0]) name=user[0].name
  return name
}
const Authorize = async (req,res,next)=>{
  const novel = await NovelInfo.find({_id:req.params.id})
  if(novel[0]){
    if(novel[0].novelAuthorId==req.cookies._id){
      next()
    }else{
      let name= await Name(req.cookies._id)
      res.render("error",{name:name,message:"권한이 없습니다."})
    }
  }
}
const NotAuthorize = async (req,res,next)=>{
  const novel = await NovelInfo.find({_id:req.params.id})
  if(novel[0]){
    if(novel[0].novelAuthorId!=req.cookies._id){
      next()
    }else{
      let name= await Name(req.cookies._id)
      res.render("error",{name:name,message:"본인 소설은 추천할 수 없습니다."})
    }
  }
}

export {Name,Authorize,NotAuthorize}