//Setup database with initial test data.
// Include an admin user.
// Script should take admin credentials as arguments as described in the requirements doc.
let userArgs = process.argv.slice(2);

if (userArgs.length < 2){
  console.log("provide both a username and a password for the admin user");
  return;
}

let Tag = require('./models/tags')
let Answer = require('./models/answers')
let Question = require('./models/questions')
let User = require("./models/users");
let Comment = require("./models/comments")


let mongoose = require('mongoose');
let mongoDB = "mongodb://127.0.0.1:27017/fake_so";
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let tags = [];
let answers = [];
function tagCreate(tid, name) {
  let tag = new Tag({tid: tid, name: name });
  return tag.save();
}

function answerCreate(aid, text, ans_by, ans_date_time, comments) {
  answerdetail = {aid: aid, text:text};
  if (ans_by != false) answerdetail.ans_by = ans_by;
  if (ans_date_time != false) answerdetail.ans_date_time = ans_date_time;
  if(comments!= false) answerdetail.comments = comments;


  let answer = new Answer(answerdetail);
  return answer.save();
}

function commentCreate(text, comment_by) {
  commentdetail = {text: text, comment_by: comment_by};

  let comment = new Comment(commentdetail);
  return comment.save();
}

function adminUserCreate(username, email, password) {
  adminuserdetail = {username: username, email: email, password: password, admin: true};
  if (username != false) adminuserdetail.username = username;
  if (password != false) adminuserdetail.password = password;

  let adminUser = new User(adminuserdetail);
  return adminUser.save();
}

function questionCreate(qid, title, summary, text, tags, comments, answers, asked_by, ask_date_time, views) {
  qstndetail = {
    qid: qid,
    title: title,
    summary: summary,
    text: text,
    tags: tags,
    comments: comments,
    asked_by: asked_by
  }
  if (answers != false) qstndetail.answers = answers;
  if (ask_date_time != false) qstndetail.ask_date_time = ask_date_time;
  if (views != false) qstndetail.views = views;
  if(comments!= false) qstndetail.comments = comments;

  let qstn = new Question(qstndetail);
  return qstn.save();
}

const populate = async () => {
  let u1 = await adminUserCreate(userArgs[0], "admin@localhost", userArgs[1])

  let t1 = await tagCreate('t1', 'react');
  let t2 = await tagCreate('t2', 'javascript');
  let t3 = await tagCreate('t3', 'android-studio');
  let t4 = await tagCreate('t4', 'shared-preferences');

  let c1 = await commentCreate('Have you tried simplifying the problem?', u1.username);
  let c2 = await commentCreate('I dont underdstand this question', u1.username);
  let c3 = await commentCreate('why did you try it this way?', u1.username);
  let c4 = await commentCreate('wow you are smart', u1.username);

  let c5 = await commentCreate('What does this mean?', u1.username);
  let c6 = await commentCreate('How to implement this?', u1.username);
  let c7 = await commentCreate('Good answer', u1.username);
  let c8 = await commentCreate('thanks for the help', u1.username);
  let c9 = await commentCreate('that works, thank you', u1.username);


  let a1 = await answerCreate('a1', 'React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.', "rbuthorn", false, [c5, c6, c7, c8]);
  let a2 = await answerCreate('a2', 'On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.', "rbuthorn", false, [c9]);
  let a3 = await answerCreate('a3', 'Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.', u1, false);
  let a4 = await answerCreate('a4', 'YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);', u1, false);
  let a5 = await answerCreate('a5', 'I just found all the above examples just too confusing, so I wrote my own. ', u1, false);
 
  await questionCreate('q1', 'Programmatically navigate using React router', "issues with the aimation upon leaving certain steps of the react navigation", 'the alert shows the proper index for the li clicked, and when I alert the variable within the last function I\'m calling, moveToNextImage(stepClicked), the same value shows but the animation isn\'t happening. This works many other ways, but I\'m trying to pass the index value of the list item clicked to use for the math to calculate.', [t1, t2], [], [a1, a2], u1, false, false);
  await questionCreate('q2', 'android studio save string shared preference, start activity and load the saved string', "summary is same as title basically", 'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.', [t3, t4, t2], [c1, c2, c3, c4], [a3, a4, a5], u1, false, 121);
  if(db) db.close();
  console.log('done');
}

populate()
  .catch((err) => {
    console.log('ERROR: ' + err);
    if(db) db.close();
  });

console.log('processing ...');