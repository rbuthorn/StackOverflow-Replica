import Model from "../model.js";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default class FakeStackOverflow extends React.Component {
  render() {
    return (<FakeStackOverflowFunc />)
  }
}

function FakeStackOverflowFunc() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [tags, setTags] = useState([]);
  useEffect(() => {
    getAllAnswers();
    getAllQuestions();
    getAllTags();
  }, []);

  //AFTER THAT: write code to create(and query?) questions and save them to the model -- in this code make sure to update questions using setQuestions()

  //THEN: check the website to make sure the code works, if it doesn't --try deleting all references to model.data.questions and replacing with db queries
  const model = new Model();
  return <Content model={model} />;
  function TopBar({ setActiveTab, setCurrentSearch, setActiveButton }) {
    const [searchBarInput, setSearchBarInput] = useState("");

    function handleSearch(event) {
      if (event.key === "Enter") {
        const searchString = searchBarInput;
        setActiveButton(4);
        setActiveTab(0);
        setCurrentSearch(searchString);
      }
    }

    function handleInputChange(event) {
      setSearchBarInput(event.target.value);
    }

    const handleLogoClick = (event) => {
      event.preventDefault();
      setActiveTab(0);
      setActiveButton(0);
    };
    return (
      <header>
        <div className="topbar">
          <div className="search-bar">
            <input
              type="text"
              className="search-bar invis"
              placeholder="Search . . ."
            ></input>
          </div>
          <div className="brand-logo">
            <a href="/" className="brand-logo" onClick={handleLogoClick}>
              Fake Stack Overflow
            </a>
          </div>
          <div className="search-bar">
            <input
              type="text"
              className="search-bar"
              id="realSearchBar"
              placeholder="Search . . ."
              onKeyDown={handleSearch}
              onChange={handleInputChange}
              value={searchBarInput}
            ></input>
          </div>
        </div>
      </header>
    );
  }
  function Content({ model }) {
    const [activeTab, setActiveTab] = useState(0);
    const tabs = ["Questions", "Tags"];
    const [activeQuestionQid, setActiveQuestionQid] = useState(null);
    const [activeButton, setActiveButton] = useState(0);
    const [activeTag, setActiveTag] = useState(null);
    const [currentSearch, setCurrentSearch] = useState(null);

    const renderContent = () => {
      var currQuestions = [];
      switch (activeTab) {
        // questions page with newest/active/unanswered
        case 0:
          switch (activeButton) {
            case 0:
              currQuestions = sortNewest();
              break;
            case 1:
              currQuestions = displayActive();
              break;
            case 2:
              currQuestions = displayUnanswered();
              break;
            case 3:
              currQuestions = displaySameTagQuestions(activeTag);
              break;
            case 4:
              currQuestions = searchByInput(currentSearch);
              break;
            default:
              currQuestions = sortNewest();
              break;
          }
          return (
            <QuestionsPage
              model={model}
              setActiveTab={setActiveTab}
              setActiveButton={setActiveButton}
              currQuestions={currQuestions}
              setActiveQuestionQid={setActiveQuestionQid}
              setActiveTag={setActiveTag}
            />
          );
        // tags page
        case 1:
          return (
            <TagsPage
              model={model}
              setActiveTab={setActiveTab}
              setActiveTag={setActiveTag}
              setActiveButton={setActiveButton}
            />
          );
        // ask question page
        case 2:
          return <AskQuestionPage model={model} setActiveTab={setActiveTab} />;
        // answers page
        case 3:
          return (
            <AnswersPage
              model={model}
              setActiveTab={setActiveTab}
              setActiveButton={setActiveButton}
              currQuestions={currQuestions}
              setActiveQuestionQid={setActiveQuestionQid}
              activeQuestionQid={activeQuestionQid}
            />
          );
        // answer question page
        case 4:
          return (
            <AnsQuestionPage
              model={model}
              setActiveTab={setActiveTab}
              setActiveQuestionQid={setActiveQuestionQid}
              activeQuestionQid={activeQuestionQid}
            />
          );
        default:
          return <QuestionsPage model={model} setActiveTab={setActiveTab} />;
      }
    };
    return (
      <>
        <TopBar
          setActiveTab={setActiveTab}
          setCurrentSearch={setCurrentSearch}
          setActiveButton={setActiveButton}
        />
        <div className="content">
          <div id="left-sidebar">
            <nav role="navigation">
              <ol className="nav-links">
                {tabs.map((tab, index) => (
                  <li
                    key={index}
                    className={
                      activeTab === index
                        ? "sidebar-link-container youarehere"
                        : "sidebar-link-container"
                    }
                  >
                    <button
                      className="sidebar-link"
                      onClick={() => setActiveTab(index)}
                    >
                      {tab}
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
          <div className="mainBody">{renderContent()}</div>
        </div>
      </>
    );
  }

  function AnsQuestionPage({
    model,
    setActiveTab,
    setActiveQuestionQid,
    activeQuestionQid,
  }) {
    const [text, setText] = useState("");
    const [username, setUsername] = useState("");
    const [textError, setTextError] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [hyperlinkError, setHyperlinkError] = useState(false);

    const handleSubmit = (event) => {
      event.preventDefault();

      setTextError(false);
      setUsernameError(false);
      setHyperlinkError(false);
      let badInput = false;

      if (username.length === 0) {
        setUsernameError(true);
        badInput = true;
      }

      let tempText = text;

      if (text.length === 0) {
        setTextError(true);
        badInput = true;
      } else {
        // Check for hyperlinks
        const regex = /\[(.*?)\]\((.*?)\)/g;
        const matches = text.matchAll(regex);
        for (const match of matches) {
          const linkText = match[1];
          const linkUrl = match[2];
          if (
            linkUrl.length === 0 ||
            (!linkUrl.startsWith("https://") && !linkUrl.startsWith("http://"))
          ) {
            setHyperlinkError(true);
            badInput = true;
          } else {
            const htmlLink = `<a href="${linkUrl}">${linkText}</a>`;
            tempText = tempText.replace(match[0], htmlLink);
          }
        }
      }

      if (!badInput) {
        const newAid = "a" + (model.data.answers.length + 1);
        const date = new Date();
        model.getQuestionById(activeQuestionQid).ansIds.push(newAid);
        model.data.answers.push({
          aid: newAid,
          text: tempText,
          ansBy: username,
          ansDate: date,
        });
        setActiveTab(3);
      }
    };

    return (
      <form className="ansQuestionForm" onSubmit={handleSubmit}>
        <div id="answerUsername">
          <h2>Username*</h2>
          <input
            className="ansQuestionInput"
            id="answerUsernameInput"
            type="text"
            onChange={(e) => setUsername(e.target.value)}
          />
          {usernameError && <p style={{ color: "red" }}>Enter a username</p>}
        </div>

        <div id="answerText">
          <h2>Answer Text*</h2>
          <p>
            <em>Add details</em>
          </p>
          <textarea
            className="ansQuestionInput"
            id="answerTextInput"
            type="text"
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          {textError && <p style={{ color: "red" }}>Text cannot be empty</p>}
          {hyperlinkError && (
            <p style={{ color: "red" }}>Invalid hyperlink format</p>
          )}
        </div>

        <div className="formBottom">
          <input id="postAnswerBtn" type="submit" value="Post Answer" />
          <p style={{ color: "red" }}>* indicates mandatory fields</p>
        </div>
      </form>
    );
  }

  function QuestionsPage({
    model,
    setActiveTab,
    setActiveButton,
    currQuestions,
    setActiveQuestionQid,
    setActiveTag,
  }) {
    var mapQstns = true;

    const handleTagClick = (event) => {
      event.preventDefault();
      setActiveTag(event.target.id);  //id refers to html id of object, not the tid.
      setActiveTab(0);
      setActiveButton(3);
    };
    return (
      <div className="questionPage">
        <div id="homePage">
          <div id="firstPortionOfHomePage">
            <h1 id="questionOrSearch">All Questions</h1>
            <button
              type="button"
              id="askQuestionBtn"
              onClick={() => setActiveTab(2)}
            >
              Ask Question
            </button>
          </div>
          <div id="secondPortionOfHomePage">
            <span id="numQuestionsPart">{questions.length} questions</span>
            <button
              type="button"
              className="questionBtns"
              id="newestBtn"
              onClick={() => setActiveButton(0)}
            >
              Newest
            </button>
            <button
              type="button"
              className="questionBtns"
              id="activeBtn"
              onClick={() => setActiveButton(1)}
            >
              Active
            </button>
            <button
              type="button"
              className="questionBtns"
              id="unansweredBtn"
              onClick={() => setActiveButton(2)}
            >
              Unanswered
            </button>
          </div>
        </div>
        <div id="dynamicQuestions">
          {currQuestions.length === 0 ? (mapQstns = false) : (mapQstns = true)}
          {mapQstns
            ? currQuestions.map((question) => (
                <div key={question.qid} className="qstnBox">
                  <div className="ansViews qstnContent">
                    <span className="ansPartOfQstnDisplay">
                      {question.answers.length} answers
                    </span>
                    <span className="viewPartOfQstnDisplay">
                      {question.views} views
                    </span>
                  </div>
                  <div className="titleTags qstnContent">
                    <button
                      className="titlePartOfQstnDisplay"
                      onClick={() => {
                        question.views++;
                        setActiveQuestionQid(question.qid);
                        setActiveTab(3);
                      }}
                    >
                      {question.title}
                    </button>
                    <div className="qTagBox">
                      {question.tags.map((tid) => (
                        <div
                          key={tid}
                          id={tid}
                          className="qTag"
                          onClick={handleTagClick}
                        >
                          {tid} //change to name later 
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="qstnTime qstnContent">
                    <span className="usernamePartOfQstnDisplay">
                      {question.askedBy}
                    </span>
                    <span className="datePartOfQstnDisplay">
                      {" "}
                      asked {formattedDateOfQstn(question)}
                    </span>
                  </div>
                </div>
              ))
            : null}
        </div>
      </div>
    );
  }

  function AskQuestionPage({ model, setActiveTab }) {
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [tags, setTags] = useState("");
    const [username, setUsername] = useState("");
    const [titleError, setTitleError] = useState(false);
    const [textError, setTextError] = useState(false);
    const [tagsError, setTagsError] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [hyperlinkError, setHyperlinkError] = useState(false);

    const handleSubmit = (event) => {
      event.preventDefault();

      setTitleError(false);
      setTextError(false);
      setTagsError(false);
      setUsernameError(false);
      setHyperlinkError(false);

      let badInput = false;

      if (title.length === 0 || title.length > 100) {
        setTitleError(true);
        badInput = true;
      }

      let tempText = text;

      if (text.length === 0) {
        setTextError(true);
        badInput = true;
      } else {
        // Check for hyperlinks
        const regex = /\[(.*?)\]\((.*?)\)/g;
        const matches = text.matchAll(regex);
        for (const match of matches) {
          const linkText = match[1];
          const linkUrl = match[2];
          if (
            linkUrl.length === 0 ||
            (!linkUrl.startsWith("https://") && !linkUrl.startsWith("http://"))
          ) {
            setHyperlinkError(true);
            badInput = true;
          } else {
            const htmlLink = `</div><a href="${linkUrl}">${linkText}</a><div>`;
            tempText = tempText.replace(match[0], htmlLink);
          }
        }
      }
      if (username.length === 0) {
        setUsernameError(true);
        badInput = true;
      }

      if (tags === "" || tags.length === 0 || tags.length > 5) {
        badInput = true;
        setTagsError(true);
      } else {
        for (let i = 0; i < tags.length; i++) {
          if (tags[i].length > 10) {
            badInput = true;
            setTagsError(true);
          }
        }
      }

      if (!badInput) {
        // turn tags into tag ids
        let tagsArr = tags;
        if (!Array.isArray(tagsArr)) {
          let temp = [tagsArr];
          tagsArr = temp;
        }
        for (let i = 0; i < tagsArr.length; i++) {
          if (model.getTidByName(tagsArr[i]) !== -1) {
            tagsArr[i] = model.getTidByName(tagsArr[i]);
          } else {
            const newTagId = "t" + (model.data.tags.length + 1);
            const newTagName = tagsArr[i];
            const newTag = { tid: newTagId, name: newTagName };
            model.insertTag(newTag);
            tagsArr[i] = model.getTidByName(tagsArr[i]);
          }
        }
        const emptyAnsArr = [];
        const date = new Date();
        model.data.questions.push({
          qid: "q" + (questions.length + 1),
          title: title,
          text: tempText,
          tagIds: tagsArr,
          askedBy: username,
          askDate: date,
          ansIds: emptyAnsArr,
          views: 0,
        });
        setActiveTab(0);
      }
    };

    return (
      <form
        className="askQuestionPage"
        id="askQuestionForm"
        onSubmit={handleSubmit}
      >
        <div id="questionTitle">
          <h2>Question Title*</h2>
          <p>
            <em>Limit title to 100 characters or less</em>
          </p>
          <input
            className="askQuestionInput"
            id="questionTitleInput"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {titleError && (
            <p style={{ color: "red" }}>Title is either too long or empty</p>
          )}
        </div>

        <div id="questionText">
          <h2>Question Text*</h2>
          <p>
            <em>Add details</em>
          </p>
          <textarea
            className="askQuestionInput"
            id="questionTextInput"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {textError && <p style={{ color: "red" }}>Text cannot be empty</p>}
          {hyperlinkError && (
            <p style={{ color: "red" }}>Invalid hyperlink format</p>
          )}
        </div>

        <div id="questionTags">
          <h2>Tags*</h2>
          <p>
            <em>Add keywords separated by whitespace</em>
          </p>
          <input
            className="askQuestionInput"
            id="tagsInput"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          {tagsError && <p style={{ color: "red" }}>Invalid tag input</p>}
        </div>

        <div id="questionUsername">
          <h2>Username*</h2>
          <input
            className="askQuestionInput"
            id="usernameInput"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {usernameError && <p style={{ color: "red" }}>Enter a username</p>}
        </div>
        <div className="formBottom">
          <input id="postQuestionBtn" type="submit" value="Post Question" />
          <p style={{ color: "red" }}>* indicates mandatory fields</p>
        </div>
      </form>
    );
  }

  function AnswersPage({ model, setActiveTab, activeQuestionQid }) {
    const question = getQuestionById(activeQuestionQid);
    let answers = [];
    for (let i = 0; i < question.ansIds.length; i++)
      answers.push(getAnswerById(question.ansIds[i]));
    model.sortAnsByDate(answers);
    function handleAnsQues(event) {
      event.preventDefault();
      setActiveTab(4);
    }

    return (
      <div id="answerPage">
        <div className="aPageHeader">
          <div className="aPageHeader-1">
            <h3 id="numAnswers">{question.ansIds.length} answers</h3>
            <h3 id="qTitle">{question.title}</h3>
            <button
              type="button"
              id="askQuestionBtnAnsrPage"
              onClick={() => setActiveTab(2)}
            >
              {" "}
              Ask Question{" "}
            </button>
          </div>
          <div className="aPageHeader-2">
            <div className="numViewsContainer">
              <h3 id="numViews">{question.views} views</h3>
            </div>
            <div
              id="qText"
              dangerouslySetInnerHTML={{ __html: question.text }}
            ></div>
            <div className="qAskedBy">
              <span id="userAnsrPage">{question.askedBy}</span>
              <span id="dateAnsrPage">
                {formattedDateOfQstn(question)}
              </span>
            </div>
          </div>
        </div>
        <div id="aPageAnswers">
          {answers.map((answer, index) => (
            <div className="aPageAnswer" key={index}>
              <div
                id="qText"
                dangerouslySetInnerHTML={{ __html: answer.text }}
              ></div>
              <p className="aPageText">{answer.text}</p>
              <div className="aPageAskedBy">
                <span className="userAnsrPage">{answer.ansBy}</span>
                <span className="dateAnsrPage">
                  {formattedDateOfAns(answer)}
                </span>
              </div>
            </div>
          ))}
        </div>
        <button id="answerQuestion" onClick={handleAnsQues}>
          Answer Question
        </button>
      </div>
    );
  }

  function TagsPage({ model, setActiveTab, setActiveTag, setActiveButton }) {
    const currTags = [...tags];
    const handleTagClick = (event) => {
      event.preventDefault();
      setActiveButton(3);
      setActiveTag(event.target.id);
      setActiveTab(0);
    };
    return (
      <div className="noDisplay" id="tagPage">
        <div id="tagHeaderContainer">
          <h3>{currTags.length} Tags</h3>
          <h3>All Tags</h3>
          <button type="button" id="askQuestionBtnInTag">
            {" "}
            Ask Question{" "}
          </button>
        </div>
        <div id="tagContainer">
          {currTags.map((tag) => (
            <div className="taxBoxContainer" key={tag.tid}>
              <div className="tagBox">
                <a href="/" id={tag.tid} onClick={handleTagClick}>
                  {tag.name}
                </a>
                <p className="tagText">
                  {model.getNumQuestionsByTid(tag.tid)} questions
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

    function displaySameTagQuestions(activeTag){
      const currQuestions = [];
      for (let i = 0; i < questions.length; i++) {
        for (let j = 0; j < questions[i].tags.length; j++) {
          if (questions[i].tags[j].name === activeTag) {
            currQuestions.push(questions[i]);
            break;
          }
        }
      }
      return currQuestions;
    }

    function sortNewest() {
      let sortedQstns = [...questions];
      const stack = [[0, sortedQstns.length - 1]];
      while (stack.length > 0) {
        const [left, right] = stack.pop();
        if (left >= right) {
          continue;
        }
        let i = left;
        let j = right;
        const pivot = sortedQstns[Math.floor((left + right) / 2)].askDate;
        while (i <= j) {
          while (sortedQstns[i].askDate > pivot) {
            i++;
          }
          while (sortedQstns[j].askDate < pivot) {
            j--;
          }
          if (i <= j) {
            const temp = sortedQstns[i];
            sortedQstns[i] = sortedQstns[j];
            sortedQstns[j] = temp;
            i++;
            j--;
          }
        }
        if (left < j) {
          stack.push([left, j]);
        }
        if (i < right) {
          stack.push([i, right]);
        }
      }
      return sortedQstns;
    }
  
    function displayActive() {
      const arrOfActiveQstns = [];
      const currQuestions = [...questions];
      for (let i = 0; i < currQuestions.length; i++) {
        const mostRecentAnsDate = getMostRecentAnsDate(currQuestions[i].qid);
        if (mostRecentAnsDate) {
          arrOfActiveQstns.push({
            question: currQuestions[i],
            mostRecentAnsDate: mostRecentAnsDate,
          });
        }
      }
      arrOfActiveQstns.sort((a, b) => b.mostRecentAnsDate - a.mostRecentAnsDate);
      return arrOfActiveQstns.map((item) => item.question);
    }
  
    function getMostRecentAnsDate(qid) {
      const qstn = getQuestionById(qid);
      const qstnAnswers = qstn.answers;
      const ansIds = qstnAnswers.map(answer => answer.id);
      let mostRecentAnsDate = null;
      for (let i = 0; i < ansIds.length; i++) {
        const ansDate = getAnswerById(ansIds[i]).ansDate;
        if (!mostRecentAnsDate || ansDate > mostRecentAnsDate) {
          mostRecentAnsDate = ansDate;
        }
      }
      return mostRecentAnsDate;
    }
  
    function displayUnanswered() {
      const currQuestions = [...questions];
      const arrOfUnansweredQstns = [];
      for (let i = 0; i < currQuestions.length; i++) {
        if (currQuestions[i].answers.length === 0) {
          arrOfUnansweredQstns.push(currQuestions[i]);
        }
      }
      return arrOfUnansweredQstns;
    }

    function getQuestionById(qid) {
      const currQuestions = [...questions];
      for (let i = 0; i < currQuestions.length; i++) {
        if (currQuestions[i].qid === qid) {
          return currQuestions[i];
        }
      }
      return -1;
    }

    function getAnswerById(id) {
      const currAnswers = [...answers];
      for (let i = 0; i < currAnswers.length; i++) {
        if (currAnswers[i].aid === id) {
          return currAnswers[i];
        }
      }
      return -1;
    }

    function getAllTags(){
      axios.get("http://localhost:8000/allTags")
      .then(function(res) {
        setTags(res.data)
      })
        .catch(err=>{
          console.log(err);
        });
    }
  
      function getAllQuestions(){
        axios.get("http://localhost:8000/allQuestions")
        .then(function(res) {
          setQuestions(res.data);
        })
          .catch(err=>{
            console.log(err);
          });
      }
  
      function getAllAnswers(){
        axios.get("http://localhost:8000/allAnswers")
        .then(res => {
          setAnswers(res.data);
        })
          .catch(err=>{
            console.log(err);
          });
      }

      function formattedDateOfQstn(qstn) {
        const currentDateTime = Date.now() / 1000;
        const askDate = new Date(qstn.ask_date_time);
        const askDateInSecs = askDate.getTime() / 1000;
        const timeSincePost = currentDateTime - askDateInSecs; // in seconds
    
        const timeOfPost = new Date(askDateInSecs * 1000);
        const month = timeOfPost.toLocaleString("default", { month: "short" });
        const day = timeOfPost.getDate();
        const year = timeOfPost.getFullYear();
        let time = timeOfPost.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
    
        if (timeSincePost < 60) {
          return Math.round(timeSincePost) + " seconds ago.";
        } else if (timeSincePost >= 60 && timeSincePost < 3600) {
          return Math.round(timeSincePost / 60) + " minutes ago.";
        } else if (timeSincePost >= 3600 && timeSincePost < 86400) {
          return Math.round(timeSincePost / 3600) + " hours ago.";
        } else if (timeSincePost >= 86400 && timeSincePost < 31536000) {
          // seconds in a year
          if (new Date().getDate() === timeOfPost.getDate()) {
            if (Math.floor(timeSincePost / 3600) === 1) {
              time = "1 hour ago";
            } else {
              time = Math.floor(timeSincePost / 3600) + " hours ago";
            }
          }
          return month + " " + day + " at " + time;
        } else if (timeSincePost >= 31536000) {
          return month + " " + day + ", " + year + " at " + time;
        }
      }

      function formattedDateOfAns(ans) {
        const currentDateTime = Date.now() / 1000;
        const ansDate = new Date(ans.ans_date_time);
        const ansDateInSecs = ansDate.getTime() / 1000;
        const timeSincePost = currentDateTime - ansDateInSecs; // in seconds
    
        if (timeSincePost < 60) {
          return Math.round(timeSincePost) + " seconds ago.";
        } else if (timeSincePost >= 60 && timeSincePost < 3600) {
          return Math.round(timeSincePost / 60) + " minutes ago.";
        } else if (timeSincePost >= 3600 && timeSincePost < 86400) {
          return timeSincePost / 3600 + " hours ago.";
        } else {
          const ansYear = ans.ans_date_time.getFullYear();
          const ansMonth = ans.ans_date_time.toLocaleString("default", {
            month: "short",
          });
          const ansDay = ans.ans_date_time.getDate();
          const ansTime = ans.ans_date_time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          const today = new Date();
    
          if (
            ansYear === today.getFullYear() &&
            ans.ans_date_time.toDateString() === today.toDateString()
          ) {
            // If the answer was posted today, only show the time
            return ansTime;
          } else if (ansYear === today.getFullYear()) {
            // If the answer was posted within the current year, show month, day and time
            return ansMonth + " " + ansDay + " at " + ansTime;
          } else {
            // If the answer was posted before the current year, show month, day, year and time
            return ansMonth + " " + ansDay + ", " + ansYear + " at " + ansTime;
          }
        }
      }
      function searchByInput(text) {
        const qs = [...questions];
        const words = text.trim().toLowerCase().split(/\s+/);
        const results = [];
    
        for (const question of qs) {
          let matchFound = false;
          for (const word of words) {
            if (
              !word.startsWith("[") &&
              !word.endsWith("]") &&
              (question.title.toLowerCase().includes(word) ||
                question.text.toLowerCase().includes(word))
            ) {
              matchFound = true;
              break;
            }
          }
          for (const word of words) {
            if (word.startsWith("[") && word.endsWith("]")) {
              const tagName = word.slice(1, -1);
              if (
                question.tags.some(
                  (tid) =>
                    tags
                      .find((tag) => tag.tid === tid)
                      .name.toLowerCase() === tagName.toLowerCase()
                )
              ) {
                matchFound = true;
                break;
              }
            }
          }
          if (matchFound) {
            results.push(question);
          }
        }
        return results;
      }
}