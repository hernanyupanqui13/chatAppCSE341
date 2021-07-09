const express = require('express')
const router = express.Router()
const io = require("../utils/socket");

const users = ['admin'] // Dummy array for users

router.get('/', (req, res, next) => {
    res.render('pages/pr12-login', {
        title: 'Prove Activity 12',
        path: '/proveActivities/12'
    })
})

// Verify login submission to access chat room.
router.post('/login', (req, res, next) => {
    const username = req.body.username.trim();
    let isValid = true;
    
    for (const oneUser of users) {
      console.log(oneUser)
      if(oneUser == username) {
        isValid = false;
      }
    }

    if(isValid) {
      req.session.user = username;
      users.push(username);
      res.json({msg: "success"});
    } else {
      res.json({msg: "fail", details:"The username has already been used. Please use another one"});
    }

    
});

// Render chat screen.
router.get('/chat', (req, res, next) => {
  res.render("pages/pr12-chat", {
    title: "prove Activity Chat",
    path: "",
    user: req.session.user
  });
});

router.post("/chat/postMessage", (req, res, next) => {
  const message = req.body.message;
  const time = req.body.time;
  const data = {
    message: message,
    user: req.session.user,
    time: time
  };
  io.getIO().emit("newMessage", data );
  res.json({msg: "success"});
  
});

module.exports = router
