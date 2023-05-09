// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const express = require('express');
const path = require('path');
const rootDir = path.dirname(__dirname);
const serverPort = 8000;
var cors = require('cors')
const app = express();
const bodyParser = require("body-parser");
const { ObjectId } = require('mongodb');
app.use(express.static(rootDir + "/client/public"));

app.use(cors());

app.use(bodyParser.json());

app.listen(serverPort, 'localhost', () => {
    console.log("listening on port 8000");
});

const mongoose = require("mongoose");

const Tag = require('./models/tags');
const Answer = require('./models/answers');
const Question = require('./models/questions');

const mongoDB = "mongodb://127.0.0.1:27017/fake_so";
mongoose.connect(mongoDB);
let db = mongoose.connection;

db.on('error', console.error.bind(console, 'mongoDB connection error:'));

process.on('SIGINT', () => {
    if(db) {
    db.close()
    .then((result) => console.log('Server closed. Database instance disconnected'))
    .catch((err) => console.log(err));
    }
    console.log('process terminated');
    process.exit();
    });


app.get('/api/allTags', async (req, res) => {
    //Query the database for all documents in the MyModel collection
    await Tag.find()
    .then(docs => { res.send(docs);
        })
    .catch(err => {
        res.send(err)
        });
        // Send the result back to the client        
    });

app.get('/api/allQuestions', async (req, res) => {
    //Query the database for all documents in the MyModel collection
    await Question.find()
    .then(docs => { res.send(docs);
        })
    .catch(err => {
        res.send(err)
        });
        // Send the result back to the client        
});

app.get('/api/allAnswers', async (req, res) => {
    //Query the database for all documents in the MyModel collection
    await Answer.find()
    .then(docs => { res.send(docs);
        })
    .catch(err => {
        res.send(err)
        });
        // Send the result back to the client        
    });

app.post('/api/addTag', async (req, res) => {
    const {tid, name} = req.body;
    const newTag = new Tag({tid: tid, name: name});

    await newTag.save()
    .then(() => {res.send("tag saved successfully")})
    .catch((error) => {res.send(error)})
});

app.post('/api/addQuestion', async (req, res) => {
    const {qid, title, text, tags, answers, asked_by, ask_date_time, views} = req.body;
    const qstnTags = [];
    for(let i = 0; i < tags.length; i++){
        let objId = new ObjectId(tags[i]);
        qstnTags.push(objId);
    }
    const newQuestion = new Question({
        qid: qid, 
        title:title, 
        text: text, 
        tags: qstnTags,
        answers: answers, 
        asked_by: asked_by, 
        ask_date_time: ask_date_time, 
        views: views
      });

    await newQuestion.save()
    .then(() => {res.send("question saved successfully")})
    .catch((error) => {res.send(error)})
});

app.post('/api/addAnswer', async (req, res) => {
    const {aid, text, ans_by, ask_date_time} = req.body;
    const newAnswer = new Answer({
        aid: aid, 
        text: text, 
        ans_by: ans_by, 
        ask_date_time: ask_date_time, 
      });

    await newAnswer.save()
    .then(() => {res.send("answer saved successfully")})
    .catch((error) => {res.send(error)})
});

app.post("/api/addAnswerToExistingQuestion", async (req, res) => {
    const {activeQid, newAns_Id} = req.body;
    await Question.findOneAndUpdate(
        {qid: activeQid},
        {$push:{answers: newAns_Id}},
        {new: true})
    });

