import React, { useState, useEffect } from "react";
import axios from "axios";
import bcrypt from "bcryptjs";

export default class FakeStackOverflow extends React.Component {
  render() {
    return <FakeStackOverflowFunc />;
  }
}

function FakeStackOverflowFunc() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [tags, setTags] = useState([]);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [activeTab, setActiveTab] = useState(5);
  const [activeTag, setActiveTag] = useState(null);
  const [activeQuestionQid, setActiveQuestionQid] = useState(null);
  const [activeButton, setActiveButton] = useState(0);
  const [currentSearch, setCurrentSearch] = useState(null);
  const [activeUser, setActiveUser] = useState(null);

  useEffect(() => {
    getAllAnswers();
    getAllQuestions();
    getAllTags();
    getAllUsers();
    getAllComments();
  }, []);

  return (
    <Content
      questions={questions}
      answers={answers}
      tags={tags}
      users={users}
      setQuestions={setQuestions}
      setAnswers={setAnswers}
      setTags={setTags}
      setUsers={setUsers}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      activeTag={activeTag}
      setActiveTag={setActiveTag}
      activeQuestionQid={activeQuestionQid}
      setActiveQuestionQid={setActiveQuestionQid}
      activeButton={activeButton}
      setActiveButton={setActiveButton}
      currentSearch={currentSearch}
      setCurrentSearch={setCurrentSearch}
    />
  );

  function TopBar({ setActiveTab, setCurrentSearch, setActiveButton }) {
    const [searchBarInput, setSearchBarInput] = useState("");

    const logout = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/logout",
          null,
          {
            withCredentials: true,
          }
        );

        console.log(response.data.message);
      } catch (error) {
        console.log("Logout error:", error);
      }
    };

    const questions = async () => {
      //console.log(users[0].username)
      //console.log(await getAllQuestions());
      //console.log(await activeSession())
      /*if (activeUser) {
        console.log(activeUser)
      } else {
        console.log("no")
      }*/
      /*console.log(
        await getAllTags().then((tags) =>
          tags.map((tag) => console.log("tag" + tag._id))
        )
      );
      console.log(
        await getAllQuestions().then((questions) =>
          questions[0].tags.map((tid) => {
            const matchingTag = tags.find((tag) => tag._id === tid);
            console.log("matching tag " + matchingTag.name);
          })
        )
      );*/
      /*.tags.map((tid) => {
        const matchingTag = tags.find((tag) => tag.id === tid);
        const tagName = matchingTag ? matchingTag.name : "";
        console.log(tagName);
      });*/
    };

    const handleSearch = (event) => {
      if (event.key === "Enter") {
        const searchString = searchBarInput;
        setActiveButton(4);
        setActiveTab(0);
        setCurrentSearch(searchString);
      }
    };

    const handleInputChange = (event) => {
      setSearchBarInput(event.target.value);
    };

    const handleLogoClick = (event) => {
      event.preventDefault();
      setActiveTab(0);
      setActiveButton(0);
    };

    return (
      <header>
        <div className="topbar">
          <div>
            <button className="logoutBtn" onClick={questions}>
              Log out
            </button>
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

  function Content({
    questions,
    answers,
    tags,
    users,
    setQuestions,
    setAnswers,
    setTags,
    setUsers,
    activeTab,
    setActiveTab,
    activeTag,
    setActiveTag,
    activeQuestionQid,
    setActiveQuestionQid,
    activeButton,
    setActiveButton,
    currentSearch,
    setCurrentSearch,
  }) {
    const tabs = ["Questions", "Tags"];

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
              setActiveTab={setActiveTab}
              setActiveTag={setActiveTag}
              setActiveButton={setActiveButton}
            />
          );
        // ask question page
        case 2:
          return <AskQuestionPage setActiveTab={setActiveTab} />;
        // answers page
        case 3:
          return (
            <AnswersPage
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
              setActiveTab={setActiveTab}
              setActiveQuestionQid={setActiveQuestionQid}
              activeQuestionQid={activeQuestionQid}
            />
          );
        //first page when entering application-welcome page
        case 5:
          return (
            <WelcomePage
              setActiveTab={setActiveTab}
              questions={questions}
              answers={answers}
              tags={tags}
              users={users}
              setQuestions={setQuestions}
              setAnswers={setAnswers}
              setTags={setTags}
              setUsers={setUsers}
            />
          );

        case 6:
          return (
            <RegisterPage
              setActiveTab={setActiveTab}
              questions={questions}
              answers={answers}
              tags={tags}
              users={users}
              setQuestions={setQuestions}
              setAnswers={setAnswers}
              setTags={setTags}
              setUsers={setUsers}
            />
          );

        case 7:
          return <LoginPage setActiveTab={setActiveTab} />;

        default:
          return <QuestionsPage setActiveTab={setActiveTab} />;
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

  function WelcomePage({ setActiveTab }) {
    return (
      <div className="welcomeContainer">
        <div className="welcomeWindow">
          <div className="welcomeButton-container">
            <button className="welcomeButton" onClick={() => setActiveTab(6)}>
              register as a new user
            </button>
            <button className="welcomeButton" onClick={() => setActiveTab(7)}>
              login as existing user
            </button>
            <button className="welcomeButton" onClick={() => setActiveTab(0)}>
              continue as guest
            </button>
          </div>
        </div>
      </div>
    );
  }

  function RegisterPage({ setActiveTab, users }) {
    const [password, setPassword] = useState("");
    const [passwordVerif, setPasswordVerif] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [passwordVerifError, setPasswordVerifError] = useState(false);

    function passwordValid() {
      let email_id = email.split("@")[0];
      if (password.includes(email_id) || password.includes(username)) {
        return false;
      }
      return true;
    }

    function passwordVerified() {
      if (passwordVerif !== password) {
        return false;
      }
      return true;
    }

    function emailValid() {
      const emails = users.map((user) => user.email);
      if (emails.includes(email)) {
        return false;
      }
      return true;
    }

    function usernameValid() {
      if (username.length === 0) {
        return false;
      }
      return true;
    }

    const handleSubmit = async (event) => {
      event.preventDefault();
      let badInput = false;
      setUsernameError(false);
      setEmailError(false);
      setPasswordError(false);
      setPasswordVerifError(false);

      if (!usernameValid()) {
        setUsernameError(true);
        badInput = true;
      }
      if (!emailValid()) {
        setEmailError(true);
        badInput = true;
      }
      if (!passwordValid()) {
        setPasswordError(true);
        badInput = true;
      }
      if (!passwordVerified()) {
        setPasswordVerifError(true);
        badInput = true;
      }
      if (!badInput) {
        try {
          const saltRounds = 10;
          const hashedPassword = bcrypt.hashSync(password, saltRounds);

          let newUser = {
            username: username,
            email: email,
            password: hashedPassword,
            admin: false,
          };
          console.log(newUser);

          await addUser(newUser);
          await getAllUsers();
          setActiveTab(7);
        } catch (error) {
          console.log(error);
        }
      }
    };

    return (
      <div className="registerContainer">
        <div className="registerWindow">
          <form className="registerQuestionForm" onSubmit={handleSubmit}>
            <div id="registerUsername">
              <h2>Username</h2>
              <input
                className="registerFormInput"
                id="registerUsernameInput"
                type="text"
                onChange={(e) => setUsername(e.target.value)}
              />
              {usernameError && (
                <p style={{ color: "red" }}>Enter a valid username</p>
              )}
            </div>

            <div id="registerEmail">
              <h2>Email</h2>
              <input
                className="registerFormInput"
                id="registerEmailInput"
                type="text"
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && (
                <p style={{ color: "red" }}>Enter a valid email</p>
              )}
            </div>

            <div id="registerPassword">
              <h2>Password</h2>
              <input
                className="registerFormInput"
                id="registerPasswordInput"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              ></input>
              {passwordError && (
                <p style={{ color: "red" }}>Enter a valid password</p>
              )}
            </div>

            <div id="registerPassword2">
              <h2>Verify Password</h2>
              <input
                className="registerFormInput"
                id="registerPasswordInput2"
                type="password"
                onChange={(e) => setPasswordVerif(e.target.value)}
              ></input>
              {passwordVerifError && (
                <p style={{ color: "red" }}>Passwords must match exactly</p>
              )}
            </div>

            <div className="formBottom">
              <input id="registerUserBtn" type="submit" value="Sign up" />
            </div>
          </form>
        </div>
      </div>
    );
  }

  function LoginPage({ setActiveTab }) {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    function emailValid() {
      const emails = users.map((user) => user.email);
      if (emails.includes(email)) {
        return true;
      }
      return false;
    }

    const handleSubmit = async (event) => {
      event.preventDefault();
      let badInput = false;

      setEmailError(false);
      setPasswordError(false);

      if (!emailValid()) {
        setEmailError(true);
        badInput = true;
      }
      if (!badInput) {
        const matchingUser = users.find((user) => user.email === email);
        try {
          const passwordMatch = await bcrypt.compare(
            password,
            matchingUser.password
          );
          if (passwordMatch) {
            console.log("Password matched");
            const response = await axios.post(
              "http://localhost:8000/api/startSession",
              matchingUser,
              {
                withCredentials: true,
              }
            );
            console.log(response);
            setActiveTab(0);
          } else {
            console.log("Invalid password");
            setPasswordError(true);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    return (
      <div className="loginContainer">
        <div className="loginWindow">
          <form className="loginQuestionForm" onSubmit={handleSubmit}>
            <div id="loginEmail">
              <h2>Email</h2>
              <input
                className="loginFormInput"
                id="loginEmailInput"
                type="text"
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && (
                <p style={{ color: "red" }}>Enter a valid email</p>
              )}
            </div>

            <div id="loginPassword">
              <h2>Password</h2>
              <input
                className="loginFormInput"
                id="loginPasswordInput"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              ></input>
              {passwordError && (
                <p style={{ color: "red" }}>Enter a valid password</p>
              )}
            </div>

            <div className="formBottom">
              <input id="loginUserBtn" type="submit" value="Sign in" />
            </div>
          </form>
        </div>
      </div>
    );
  }

  function AnsQuestionPage({
    setActiveTab,
    setActiveQuestionQid,
    activeQuestionQid,
  }) {
    const [text, setText] = useState("");
    const [textError, setTextError] = useState(false);
    const [hyperlinkError, setHyperlinkError] = useState(false);

    const handleSubmit = async (event) => {
      event.preventDefault();

      setTextError(false);
      setHyperlinkError(false);
      let badInput = false;

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
        const newAid = "a" + (answers.length + 1);
        let date = new Date(Date.now());
        const newAns = {
          aid: newAid,
          text: tempText,
          ans_by: users[0],
          ans_date_time: date,
          comments: [],
          upvotes: 0,
          downvotes: 0,
        };
        await addAnswer(newAns); //add new answer object to database
        let allAnswers = await getAllAnswers();

        //add new answer object to associatd question's answers field
        const newAns_Id = convertAidtoAns_Id(allAnswers, newAid);
        await addAnswerToExistingQuestion(activeQuestionQid, newAns_Id);

        console.log("yay");
        setActiveTab(0);
      }
    };

    return (
      <form className="ansQuestionForm" onSubmit={handleSubmit}>
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
    setActiveTab,
    setActiveButton,
    currQuestions,
    setActiveQuestionQid,
    setActiveTag,
  }) {
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
            <span id="numQuestionsPart">{currQuestions.length} questions</span>
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
          {currQuestions.length === 0
            ? null
            : currQuestions.map((question, index) => (
                <div key={index} className="qstnBox">
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
                        incrementViewCount(question.qid);
                        setActiveQuestionQid(question.qid);
                        setActiveTab(3);
                      }}
                    >
                      {question.title}
                    </button>
                    <div className="qSummaryBox">{question.summary}</div>
                    <div className="qTagBox">
                      {question.tags.map((tid) => {
                        const matchingTag = tags.find((tag) => tag._id === tid);
                        return (
                          <div
                            key={matchingTag.tid}
                            id={matchingTag.tid}
                            className="qTag"
                            onClick={handleTagClick}
                          >
                            {matchingTag.name}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="qstnTime qstnContent">
                    <span className="usernamePartOfQstnDisplay">
                      {question.asked_by + " "}
                    </span>
                    <span className="datePartOfQstnDisplay">
                      asked {formattedDateOfQstn(question)}
                    </span>
                  </div>
                </div>
              ))}
        </div>
      </div>
    );
  }

  function AskQuestionPage({ setActiveTab }) {
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [newQuestionTags, setNewQuestionTags] = useState("");
    const [summary, setSummary] = useState("");
    const [titleError, setTitleError] = useState(false);
    const [textError, setTextError] = useState(false);
    const [tagsError, setTagsError] = useState(false);
    const [summaryError, setSummaryError] = useState(false);
    const [hyperlinkError, setHyperlinkError] = useState(false);
    let tagCount = tags.length;

    const handleSubmit = async (event) => {
      event.preventDefault();

      setTitleError(false);
      setTextError(false);
      setTagsError(false);
      setSummaryError(false);
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
      if (summary.length > 140) {
        setSummaryError(true);
        badInput = true;
      }

      if (
        newQuestionTags === "" ||
        newQuestionTags.length === 0 ||
        numWords(newQuestionTags) > 5
      ) {
        badInput = true;
        setTagsError(true);
      } else {
        for (let i = 0; i < newQuestionTags.length; i++) {
          if (newQuestionTags[i].length > 10) {
            badInput = true;
            setTagsError(true);
          }
        }
      }

      if (!badInput) {
        // turn tags into tag ids
        let incomingTags = newQuestionTags.split(/\s/);
        let tagNames = tags.map((tag) => tag.name);
        const newTags = incomingTags.filter((name) => !tagNames.includes(name));

        for (let i = 0; i < newTags.length; i++) {
          await addTag(newTags[i], tagCount);
          tagCount += 1;
        }
        let allTags = await getAllTags();

        let date = new Date(Date.now());
        const qstnTags = convertTagNamesTo_Ids(allTags, incomingTags);

        let qstn = {
          qid: "q" + (questions.length + 1),
          title: title,
          summary: summary,
          text: tempText,
          tags: qstnTags,
          comments: [],
          answers: [],
          asked_by: users[0].username, //change to grabbing user from session id
          ask_date_time: date,
          views: 0,
          upvotes: 0,
          downvotes: 0,
        };
        addQuestion(qstn);
        await getAllQuestions();
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
            <em>Limit title to 50 characters or less</em>
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

        <div id="questionSummary">
          <h2>Question Summary*</h2>
          <p>
            <em>Limit summary to 140 characters or less</em>
          </p>
          <input
            className="askQuestionInput"
            id="questionSummaryInput"
            type="text"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
          {summaryError && <p style={{ color: "red" }}>Summary is too long</p>}
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
            value={newQuestionTags}
            onChange={(e) => setNewQuestionTags(e.target.value)}
          />
          {tagsError && <p style={{ color: "red" }}>Invalid tag input</p>}
        </div>

        <div className="formBottom">
          <input id="postQuestionBtn" type="submit" value="Post Question" />
          <p style={{ color: "red" }}>* indicates mandatory fields</p>
        </div>
      </form>
    );
  }

  function AnswersPage({ setActiveTab, activeQuestionQid }) {
    const question = getQuestionById(activeQuestionQid);
    let currAnswers = [];
    for (let i = 0; i < question.answers.length; i++) {
      currAnswers.push(getAnswerBy_Id(question.answers[i]));
    }

    const currQstnComments = [...question.comments];
    const qstnComments = comments.filter((comment) =>
      currQstnComments.includes(comment._id)
    );

    sortAnsByDate(currAnswers);
    //console.log(qstnComments);
    function handleAnsQues(event) {
      event.preventDefault();
      setActiveTab(4);
    }

    function handleUpvote() {}
    function handleDownvote() {}

    return (
      <div id="answerPage">
        <div className="aPageHeader">
          <div className="aPageHeader-1">
            <h3 id="numAnswers">{question.answers.length} answers</h3>
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
              <span id="userAnsrPage">{console.log(question.asked_by)}</span>
              <span id="dateAnsrPage">{formattedDateOfQstn(question)}</span>
            </div>
          </div>

          <div className="aPageHeader-3">
            <div className="comments-section">
              {qstnComments.map((comment, index) => (
                <div className="comment-box" key={index}>
                  <div className="vote-section">
                    <div className="vote-button-container">
                      <button className="vote-button" onClick={handleUpvote}>
                        upvote
                      </button>
                      <span className="vote-count"> {comment.votes} </span>
                      <button className="vote-button" onClick={handleDownvote}>
                        downvote
                      </button>
                    </div>
                    <span className="comment-text">{comment.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div id="aPageAnswers">
          {currAnswers.map((answer, index) => (
            <div className="aPageAnswer" key={index}>
              <p className="aPageText">{answer.text}</p>
              <div className="aPageAskedBy">
                <span className="userAnsrPage">{yay(answer)}</span>
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
  function yay(yay) {
    console.log(yay);
    //return yay;
  }

  function TagsPage({ setActiveTab, setActiveTag, setActiveButton }) {
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
          <button
            type="button"
            id="askQuestionBtnInTag"
            onClick={() => setActiveTab(2)}
          >
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
                  {getNumQuestionsByT_id(tag._id)} questions
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function displaySameTagQuestions(activeTag) {
    const currTag = getTagByTid(activeTag);
    const currQuestions = [];
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].tags.includes(currTag._id)) {
        currQuestions.push(questions[i]);
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
      const pivot = sortedQstns[Math.floor((left + right) / 2)].ask_date_time;
      while (i <= j) {
        while (sortedQstns[i].ask_date_time > pivot) {
          i++;
        }
        while (sortedQstns[j].ask_date_time < pivot) {
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
    let mostRecentAnsDate = null;
    for (let i = 0; i < qstnAnswers.length; i++) {
      const ansDate = getAnswerBy_Id(qstnAnswers[i]).ans_date_time;
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
    arrOfUnansweredQstns.sort((a, b) => b.ask_date_time - a.ask_date_time);
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

  async function getAllTags() {
    let tagData;
    await axios
      .get("http://localhost:8000/api/allTags")
      .then(function (res) {
        setTags(res.data);
        tagData = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
    return tagData;
  }

  async function getAllQuestions() {
    let questionData;
    await axios
      .get("http://localhost:8000/api/allQuestions")
      .then(function (res) {
        setQuestions(res.data);
        questionData = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
    return questionData;
  }

  async function upvoteQuestion(questionId) {
    try {
      const response = await axios.post(`/api/questions/${questionId}/upvote`, {
        userId: "currentUserId", // Replace 'currentUserId' with the actual user ID
      });
      console.log(response.data.message);
      // Update the question's upvote count or any other UI changes
    } catch (error) {
      console.log(error.response.data.message);
      // Handle error and show appropriate error message to the user
    }
  }

  async function downvoteQuestion(questionId) {
    try {
      const response = await axios.post(
        `/api/questions/${questionId}/downvote`,
        {
          userId: "currentUserId", // Replace 'currentUserId' with the actual user ID
        }
      );
      console.log(response.data.message);
      // Update the question's downvote count or any other UI changes
    } catch (error) {
      console.log(error.response.data.message);
      // Handle error and show appropriate error message to the user
    }
  }

  async function removeUpvote(questionId) {
    try {
      const response = await axios.post(
        `/api/questions/${questionId}/removeUpvote`,
        {
          userId: "currentUserId", // Replace 'currentUserId' with the actual user ID
        }
      );
      console.log(response.data.message);
      // Update the question's upvote count or any other UI changes
    } catch (error) {
      console.log(error.response.data.message);
      // Handle error and show appropriate error message to the user
    }
  }

  async function removeDownvote(questionId) {
    try {
      const response = await axios.post(
        `/api/questions/${questionId}/removeDownvote`,
        {
          userId: "currentUserId", // Replace 'currentUserId' with the actual user ID
        }
      );
      console.log(response.data.message);
      // Update the question's downvote count or any other UI changes
    } catch (error) {
      console.log(error.response.data.message);
      // Handle error and show appropriate error message to the user
    }
  }

  async function incrementViewCount(qid) {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/incrementViewCount/${qid}`
      );
      await getAllQuestions();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  async function getAllAnswers() {
    let answerData;
    await axios
      .get("http://localhost:8000/api/allAnswers")
      .then(function (res) {
        setAnswers(res.data);
        answerData = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
    return answerData;
  }

  async function getAllUsers() {
    let userData;
    await axios
      .get("http://localhost:8000/api/allUsers")
      .then(function (res) {
        setUsers(res.data);
        userData = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
    return userData;
  }

  async function getAllComments() {
    let commentData;
    await axios
      .get("http://localhost:8000/api/allComments")
      .then(function (res) {
        setComments(res.data);
        commentData = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
    return commentData;
  }

  async function activeSession() {
    await axios
      .get("http://localhost:8000/api/checkSession", {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data.user.username);
        setActiveUser(res.data.user.username);
        return res.data.loggedIn;
      })
      .catch((err) => {
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

    const timeOfPost = new Date(ansDateInSecs * 1000);
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
              (_id) =>
                tags.find((tag) => tag._id === _id).name.toLowerCase() ===
                tagName.toLowerCase()
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

  function sortAnsByDate(ansArr) {
    ansArr.sort((a, b) => new Date(b.ansDate) - new Date(a.ansDate));
  }

  function getAnswerBy_Id(_id) {
    // gets answer by the _id field in answers, not the aid field
    const currAnswers = [...answers];
    for (let i = 0; i < currAnswers.length; i++) {
      if (currAnswers[i]._id === _id) {
        return currAnswers[i];
      }
    }
    return -1;
  }

  function getTag_IdByName(allTags, tagName) {
    for (const tag of allTags) {
      if (tag.name === tagName) {
        return tag._id;
      }
    }
    return -1;
  }

  function getTagByTid(tid) {
    // gets answer by the _id field in answers, not the aid field
    const currTags = [...tags];
    for (let i = 0; i < currTags.length; i++) {
      if (currTags[i].tid === tid) {
        return currTags[i];
      }
    }
    return -1;
  }

  function getNumQuestionsByT_id(t_id) {
    let count = 0;
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].tags.includes(t_id)) {
        count++;
      }
    }
    return count++;
  }

  function numWords(str) {
    return str.split(/\s+/).length;
  }

  function convertTagNamesTo_Ids(allTags, tagNames) {
    const newTags = [];
    for (let i = 0; i < tagNames.length; i++) {
      newTags[i] = getTag_IdByName(allTags, tagNames[i]);
    }
    return newTags;
  }

  function convertAidtoAns_Id(allAnswers, newAid) {
    for (let i = 0; i < allAnswers.length; i++) {
      if (allAnswers[i].aid === newAid) {
        return allAnswers[i]._id;
      }
    }
    return -1;
  }

  async function addTag(tagName, tagCount) {
    let newTagId = "t" + (tagCount + 1);

    await axios
      .post("http://localhost:8000/api/addTag", {
        tid: newTagId,
        name: tagName,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function addAnswer(answer) {
    await axios
      .post("http://localhost:8000/api/addAnswer", {
        aid: answer.aid,
        text: answer.text,
        ans_by: answer.ans_by,
        ans_date_time: answer.ans_date_time,
        comments: answer.comments,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function addQuestion(q) {
    await axios
      .post("http://localhost:8000/api/addQuestion", {
        qid: q.qid,
        title: q.title,
        summary: q.summary,
        text: q.text,
        tags: q.tags,
        comments: q.comments,
        answers: q.answers,
        asked_by: q.asked_by,
        ask_date_time: q.ask_date_time,
        views: q.views,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
    await getAllQuestions();
  }

  async function addUser(user) {
    await axios
      .post("http://localhost:8000/api/addUser", {
        username: user.username,
        email: user.email,
        password: user.password,
        admin: user.admin,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function addComment(comment) {
    await axios
      .post("http://localhost:8000/api/addComment", {
        text: comment.text,
        com_date_time: comment.com_date_time,
        comment_by: comment.comment_by,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function addAnswerToExistingQuestion(activeQid, newAns_Id) {
    await axios
      .post("http://localhost:8000/api/addAnswerToExistingQuestion", {
        activeQid: activeQid,
        newAns_Id: newAns_Id,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
    await getAllQuestions();
  }
}
