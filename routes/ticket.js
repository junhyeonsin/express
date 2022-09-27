import express from "express";
import { Name } from "./function.js";
const ticket = express.Router();

ticket.get("/",async (req,res)=>{
  let name = await Name(req.cookies._id)
  res.render("userTicket",{name:name})
})

export default ticket