import express from "express";
import mongoose from "mongoose";
import Router from "./routes/router.js";
import cookieParser from "cookie-parser";
import {UserInfo} from "./database/schema.js";
import { Name } from "./routes/function.js";

mongoose.connect('mongodb://127.0.0.1:27017/db').then(()=>{
  console.log("connected")
})

const app = express()
app.use(cookieParser())
app.set('view engine','ejs')

app.get('/',async (req,res) => {  
  let name = await Name(req.cookies._id)
  res.render('main',{name:name})
})
app.use('/',Router) 
  
app.listen(3000)