import express from "express";

const logout = express.Router();

logout.get("/",(req,res)=>{
  res.clearCookie('_id')
  res.redirect("/")
})

export default logout