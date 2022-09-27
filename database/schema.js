import mongoose from 'mongoose'

const Schema = mongoose.Schema;
const NovelInfoSchema = new Schema({
  novelName: String,
  novelLore:String,
  novelAuthorName: String,
  novelAuthorId: String,
  novelTag:Array,
  novelLiked: Number,
}) 
const TextSchema = new Schema({
  parents: String,
  episode: Number,
  episodeName: String,
  content: String,
  date: Date,
  comment:Array,
}) 
const UserInfoSchema = new Schema({
  name: String,
  id : String,
  password : String,
  userRole : Number,
  ticket: Number,
  likedNovel : Array,
}) 

const UserInfo = mongoose.model('UserInfo',UserInfoSchema)
const Text = mongoose.model('TextInfo',TextSchema)
const NovelInfo = mongoose.model('NovelInfo',NovelInfoSchema)

export {NovelInfo,UserInfo,Text}