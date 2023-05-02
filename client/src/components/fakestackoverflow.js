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

  function getAllTags(){
    axios.get("http://localhost:8000/allTags")
    .then(function(res) {
      return res.data;
    })
      .catch(err=>{
        console.log(err);
      });
  }

    function getAllQuestions(){
      axios.get("http://localhost:8000/allQuestions")
      .then(function(res) {
        setQuestions(res.data)
      })
        .catch(err=>{
          console.log(err);
        });
    }

    function getAllAnswers(){
      axios.get("http://localhost:8000/allAnswers")
      .then(res => {
        return res.data;
      })
        .catch(err=>{
          console.log(err);
        });
    }


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
      var currQuestions;
      switch (activeTab) {
        // questions page with newest/active/unanswered
        case 0:
          switch (activeButton) {
            case 0:
              currQuestions = model.sortNewest();
              break;
            case 1:
              currQuestions = model.displayActive();
              break;
            case 2:
              currQuestions = model.displayUnanswered();
              break;
            case 3:
              currQuestions = [];
              const questions = getAllQuestions();
              for (let i = 0; i < questions.length; i++) {
                for (let j = 0; j < questions[i].tagIds.length; j++) {
                  if (questions[i].tagIds[j] === activeTag) {
                    currQuestions.push(questions[i]);
                    break;
                  }
                }
              }
              break;
            case 4:
              const qs = model.data.questions;
              const words = currentSearch.trim().toLowerCase().split(/\s+/);
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
                      question.tagIds.some(
                        (tagId) =>
                          model.data.tags
                            .find((tag) => tag.tid === tagId)
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
              results.map((question) => model.data.questions.indexOf(question));
              currQuestions = results;
              break;
            default:
              currQuestions = model.displayNewest();
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
      setActiveTag(event.target.id);
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
                      {question.ansIds.length} answers
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
                      {question.tagIds.map((tagId) => (
                        <div
                          key={tagId}
                          id={tagId}
                          className="qTag"
                          onClick={handleTagClick}
                        >
                          {model.getNameByTid(tagId)}
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
                      asked {model.formattedDateOfQstn(question)}
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
      console.log(tempText);

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
          qid: "q" + (getAllQuestions().length + 1),
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
    const question = model.getQuestionById(activeQuestionQid);
    let answers = [];
    for (let i = 0; i < question.ansIds.length; i++)
      answers.push(model.getAnswerById(question.ansIds[i]));
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
                {model.formattedDateOfQstn(question)}
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
                  {model.formattedDateOfAns(answer)}
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
    var tags = model.data.tags;
    const handleTagClick = (event) => {
      event.preventDefault();
      setActiveButton(3);
      setActiveTag(event.target.id);
      setActiveTab(0);
    };
    return (
      <div className="noDisplay" id="tagPage">
        <div id="tagHeaderContainer">
          <h3>{tags.length} Tags</h3>
          <h3>All Tags</h3>
          <button type="button" id="askQuestionBtnInTag">
            {" "}
            Ask Question{" "}
          </button>
        </div>
        <div id="tagContainer">
          {tags.map((tag) => (
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
}