// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const express = require("express");
const path = require("path");
const rootDir = path.dirname(__dirname);
const serverPort = 8000;
var cors = require("cors");
const app = express();
const { ObjectId } = require("mongodb");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");

app.use(express.static(rootDir + "/client/public"));

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

const oneDay = 1000 * 60 * 60 * 24;
app.use(
  sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

app.listen(serverPort, "localhost", () => {
  console.log("listening on port 8000");
});

const mongoose = require("mongoose");

const Tag = require("./models/tags");
const Answer = require("./models/answers");
const Question = require("./models/questions");
const User = require("./models/users");
const Comment = require("./models/comments");

const mongoDB = "mongodb://127.0.0.1:27017/fake_so";
mongoose.connect(mongoDB);
let db = mongoose.connection;

db.on("error", console.error.bind(console, "mongoDB connection error:"));

process.on("SIGINT", () => {
  if (db) {
    db.close()
      .then((result) =>
        console.log("Server closed. Database instance disconnected")
      )
      .catch((err) => console.log(err));
  }
  console.log("process terminated");
  process.exit();
});

app.get("/api/allUsers", async (req, res) => {
  await User.find()
    .then((docs) => {
      res.send(docs);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.get("/api/allTags", async (req, res) => {
  await Tag.find()
    .then((docs) => {
      res.send(docs);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.get("/api/allQuestions", async (req, res) => {
  await Question.find()
    .then((docs) => {
      res.send(docs);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.get("/api/allAnswers", async (req, res) => {
  await Answer.find()
    .then((docs) => {
      res.send(docs);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.get("/api/allComments", async (req, res) => {
  await Comment.find()
    .then((docs) => {
      res.send(docs);
    })
    .catch((err) => {
      res.send(err);
    });
});

// USER SESSIONS
app.post("/api/startSession", (req, res) => {
  req.session.user = req.body; // Store the user data in the session
  res.json({ loggedIn: true, message: "Session started successfully", user: req.session.user});
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(); // Clear the session data
  res.json({ loggedIn: false, message: "Logout successful" });
});

app.get("/api/checkSession", (req, res) => {
  if (req.session.user) {
    // Session exists
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    // No active session
    res.json({ loggedIn: false });
  }
});

app.post("/api/addUser", async (req, res) => {
  const { username, email, password, admin } = req.body;
  const newUser = new User({
    username: username,
    email: email,
    password: password,
    admin: admin,
  });

  await newUser
    .save()
    .then(() => {
      res.send("user saved successfully");
    })
    .catch((error) => {
      res.send(error);
    });
});

app.post("/api/addComment", async (req, res) => {
  const { text, com_date_time, votes, comment_by } = req.body;
  const newComment = new Comment({
    text: text,
    com_date_time: com_date_time,
    votes: votes,
    comment_by: comment_by,
  });

  await newComment
    .save()
    .then(() => {
      res.send("comment saved successfully");
    })
    .catch((error) => {
      res.send(error);
    });
});

app.post("/api/addTag", async (req, res) => {
  const { tid, name } = req.body;
  const newTag = new Tag({ tid: tid, name: name });

  await newTag
    .save()
    .then(() => {
      res.send("tag saved successfully");
    })
    .catch((error) => {
      res.send(error);
    });
});

app.post("/api/addQuestion", async (req, res) => {
  const {
    qid,
    title,
    summary,
    text,
    tags,
    comments,
    answers,
    asked_by,
    ask_date_time,
    views,
  } = req.body;
  const qstnTags = [];
  for (let i = 0; i < tags.length; i++) {
    let objId = new ObjectId(tags[i]);
    qstnTags.push(objId);
  }
  const newQuestion = new Question({
    qid: qid,
    title: title,
    summary: summary,
    text: text,
    tags: qstnTags,
    comments: comments,
    answers: answers,
    asked_by: asked_by,
    ask_date_time: ask_date_time,
    views: views,
  });

  await newQuestion
    .save()
    .then(() => {
      res.send("question saved successfully");
    })
    .catch((error) => {
      res.send(error);
    });
});

app.post("/api/addAnswer", async (req, res) => {
  const { aid, text, ans_by, ask_date_time, comments } = req.body;
  const newAnswer = new Answer({
    aid: aid,
    text: text,
    ans_by: ans_by,
    ask_date_time: ask_date_time,
    comments: comments,
  });

  await newAnswer
    .save()
    .then(() => {
      res.send("answer saved successfully");
    })
    .catch((error) => {
      res.send(error);
    });
});

app.post("/api/addAnswerToExistingQuestion", async (req, res) => {
  const { activeQid, newAns_Id } = req.body;
  await Question.findOneAndUpdate(
    { qid: activeQid },
    { $push: { answers: newAns_Id } },
    { new: true }
  );
});
