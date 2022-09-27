import express from "express";
import Login from './login.js';
import Logout from './logout.js';
import Register from "./register.js";
import Profile from "./profile.js";
import NovelList from './novelList.js';
import Search from "./search.js";
import Ticket from "./ticket.js";

const router = express.Router();

router.use('/login',Login);
router.use('/logout',Logout);
router.use('/register',Register);
router.use('/profile',Profile);
router.use('/novel',NovelList);
router.use('/search',Search);
router.use('/ticket',Ticket);

export default router;