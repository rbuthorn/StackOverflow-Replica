export default class Model {
    constructor() {
      this.data = {
        questions: [
          {
            qid: "q1",
            title: "Programmatically navigate using React router",
            text: "the alert shows the proper index for the li clicked, and when I alert the variable within the last function I'm calling, moveToNextImage(stepClicked), the same value shows but the animation isn't happening. This works many other ways, but I'm trying to pass the index value of the list item clicked to use for the math to calculate.",
            tagIds: ["t1", "t2"],
            askedBy: "JoJi John",
            askDate: new Date("December 17, 2020 03:24:00"),
            ansIds: ["a1", "a2"],
            views: 10,
          },
          {
            qid: "q2",
            title:
              "android studio save string shared preference, start activity and load the saved string",
            text: "I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.",
            tagIds: ["t3", "t4", "t2"],
            askedBy: "saltyPeter",
            askDate: new Date("January 01, 2022 21:06:12"),
            ansIds: ["a3", "a4", "a5"],
            views: 121,
          },
        ],
        tags: [
          {
            tid: "t1",
            name: "react",
          },
          {
            tid: "t2",
            name: "javascript",
          },
          {
            tid: "t3",
            name: "android-studio",
          },
          {
            tid: "t4",
            name: "shared-preferences",
          },
        ],
        answers: [
          {
            aid: "a1",
            text: "React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.",
            ansBy: "hamkalo",
            ansDate: new Date("March 02, 2022 15:30:00"),
          },
          {
            aid: "a2",
            text: "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.",
            ansBy: "azad",
            ansDate: new Date("January 31, 2022 15:30:00"),
          },
          {
            aid: "a3",
            text: "Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.",
            ansBy: "abaya",
            ansDate: new Date("April 21, 2022 15:25:22"),
          },
          {
            aid: "a4",
            text: "YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);",
            ansBy: "alia",
            ansDate: new Date("December 02, 2022 02:20:59"),
          },
          {
            aid: "a5",
            text: "I just found all the above examples just too confusing, so I wrote my own. ",
            ansBy: "sana",
            ansDate: new Date("December 31, 2022 20:20:59"),
          },
        ],
      };
    }
  
    searchByInput(text) {
      const qs = this.model.data.questions;
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
              question.tagIds.some(
                (tagId) =>
                  this.model.data.tags
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
      results.map((question) => this.data.questions.indexOf(question));
      return results;
    }
  
    sortAnsByDate(ansArr) {
      ansArr.sort((a, b) => new Date(b.ansDate) - new Date(a.ansDate));
    }
  
    sortNewest(qstns) {
      let sortedQstns;
      if (!qstns) {
        sortedQstns = [...this.data.questions];
      } else {
        sortedQstns = [...qstns];
      }
  
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
  
    displayActive(qstns = this.data.questions) {
      const arrOfActiveQstns = [];
      for (let i = 0; i < qstns.length; i++) {
        const mostRecentAnsDate = this.getMostRecentAnsDate(qstns[i].qid);
        if (mostRecentAnsDate) {
          arrOfActiveQstns.push({
            question: qstns[i],
            mostRecentAnsDate: mostRecentAnsDate,
          });
        }
      }
      arrOfActiveQstns.sort((a, b) => b.mostRecentAnsDate - a.mostRecentAnsDate);
      return arrOfActiveQstns.map((item) => item.question);
    }
  
    getMostRecentAnsDate(qid) {
      const qstn = this.getQuestionById(qid);
      const ansIds = qstn.ansIds;
      let mostRecentAnsDate = null;
      for (let i = 0; i < ansIds.length; i++) {
        const ansDate = this.getAnswerById(ansIds[i]).ansDate;
        if (!mostRecentAnsDate || ansDate > mostRecentAnsDate) {
          mostRecentAnsDate = ansDate;
        }
      }
      return mostRecentAnsDate;
    }
  
    displayUnanswered(qstns = this.data.questions) {
      const arrOfUnansweredQstns = [];
      for (let i = 0; i < qstns.length; i++) {
        if (qstns[i].ansIds.length === 0) {
          arrOfUnansweredQstns.push(qstns[i]);
        }
      }
      return arrOfUnansweredQstns;
    }
  
    getNumQuestionsByTid(id) {
      let count = 0;
      for (let i = 0; i < this.data.questions.length; i++) {
        if (this.data.questions[i].tagIds.includes(id)) {
          count++;
        }
      }
      return count++;
    }
  
    getAnswerById(id) {
      const as = this.getAnswers();
      for (let i = 0; i < as.length; i++) {
        if (as[i].aid === id) {
          return as[i];
        }
      }
      return -1;
    }
  
    getQuestionById(id) {
      const qs = this.getQuestions();
      for (let i = 0; i < qs.length; i++) {
        if (qs[i].qid === id) {
          return qs[i];
        }
      }
      return -1;
    }
  
    getTidByName(n) {
      const ts = this.getTags();
      for (let i = 0; i < ts.length; i++) {
        if (ts[i].name === n) {
          return ts[i].tid;
        }
      }
      return -1;
    }
  
    getNameByTid(id) {
      const ts = this.getTags();
      for (let i = 0; i < ts.length; i++) {
        if (ts[i].tid === id) {
          return ts[i].name;
        }
      }
    }
  
    getQuestions() {
      return this.data.questions;
    }
  
    getTags() {
      return this.data.tags;
    }
  
    getAnswers() {
      return this.data.answers;
    }
  
    numAnswers() {
      return this.data.answers.length;
    }
  
    numTags() {
      return this.data.tags.length;
    }
  
    insertTag(nTag) {
      this.data.tags.push(nTag);
    }
  
    insertQuestion(qstn) {
      this.data.questions.push(qstn);
    }
  
    getDate() {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth(); // 0-11, 0 = january
      const day = currentDate.getDay(); // 0-6, 0 = sunday
      const hours = currentDate.getHours(); // 0-23
      const minutes = currentDate.getMinutes();
      const seconds = currentDate.getSeconds();
  
      const tempDate = new Date(year, month, day, hours, minutes, seconds);
      const strDate = tempDate.toString();
  
      return strDate;
    }
  
    formattedDateOfAns(ans) {
      const currentDateTime = Date.now() / 1000;
      const ansDateInSecs = ans.ansDate.getTime() / 1000;
      const timeSincePost = currentDateTime - ansDateInSecs; // in seconds
  
      if (timeSincePost < 60) {
        return Math.round(timeSincePost) + " seconds ago.";
      } else if (timeSincePost >= 60 && timeSincePost < 3600) {
        return Math.round(timeSincePost / 60) + " minutes ago.";
      } else if (timeSincePost >= 3600 && timeSincePost < 86400) {
        return timeSincePost / 3600 + " hours ago.";
      } else {
        const ansYear = ans.ansDate.getFullYear();
        const ansMonth = ans.ansDate.toLocaleString("default", {
          month: "short",
        });
        const ansDay = ans.ansDate.getDate();
        const ansTime = ans.ansDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const today = new Date();
  
        if (
          ansYear === today.getFullYear() &&
          ans.ansDate.toDateString() === today.toDateString()
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
  
    formattedDateOfQstn(qstn) {
      const currentDateTime = Date.now() / 1000;
      const askDateInSecs = qstn.askDate.getTime() / 1000;
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
  }