// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const express = require('express');
const path = require('path');
const rootDir = path.dirname(__dirname);
const serverPort = 8000;
var cors = require('cors')
const app = express();

app.use(express.static(rootDir + "/client/public"));

app.use(cors());

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

function tagCreate(name) {
    let tag = new Tag({ name: name });
    return tag.save();
}
  
function answerCreate(text, ans_by, ans_date_time) {
    answerdetail = {text:text};
    if (ans_by != false) answerdetail.ans_by = ans_by;
    if (ans_date_time != false) answerdetail.ans_date_time = ans_date_time;

    let answer = new Answer(answerdetail);
    return answer.save();
}
  
function questionCreate(title, text, tags, answers, asked_by, ask_date_time, views) {
    qstndetail = {
        title: title,
        text: text,
        tags: tags,
        asked_by: asked_by
    }
    if (answers != false) qstndetail.answers = answers;
    if (ask_date_time != false) qstndetail.ask_date_time = ask_date_time;
    if (views != false) qstndetail.views = views;

    let qstn = new Question(qstndetail);
    return qstn.save();
}

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
