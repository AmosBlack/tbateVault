// chapters-list in html
let chaptersList = document.getElementById("chap-list")

let chaptersCollection
let chapterCount
async function initializeChapterList() {
  await chapterListSetup();
  chaptersCollection = document.getElementsByClassName('chap-li')
  //for each chap-li, on-click create chapter modal
  Array.from(chaptersCollection).forEach((element, index) => {
    element.addEventListener("click", () => {
      var chapterNumber = index + 1
      createChapterModal(chapterNumber);
    });
  });
}

initializeChapterList();

//when chap-li clicked, create modal
function createChapterModal(chapNumber) {
  var chapterText; //stores chapter text (global)

  //pull data from firebase asynchronously
  firebase
    .database()
    .ref(`chapters/${chapNumber}`)
    .once("value")
    .then((snapshot) => {
      chapterText = snapshot.val();
      //create modal
      var chapterModal = document.createElement("dialog");
      chapterModal.classList.add("chapter-modal")
      //create title
      var chapterTitle = document.createElement("h1");
      chapterTitle.textContent = `Chapter ${chapNumber}`;
      chapterModal.appendChild(chapterTitle);

      //paragraph el containing text
      var chapterContent = document.createElement("p");
      chapterContent.innerHTML = chapterText;
      chapterContent.id = "chapter-content"
      chapterModal.appendChild(chapterContent);
      //close modal
      var chapterClose = document.createElement("button");
      chapterClose.classList.add("button")
      chapterClose.classList.add("cross")
      chapterClose.textContent = "X";
      //on-click func
      chapterClose.addEventListener("click", function () {
        chapterModal.close();
        chapterModal.remove()
      });
      chapterModal.appendChild(chapterClose);
      //parent of nav buttons
      var chapterNav = document.createElement("div")
      chapterNav.style.backgroundColor = "rgb(0,0,0)"
      //go to previous chapter
      var chapterPrevious = document.createElement("button");
      chapterPrevious.classList.add("button")
      chapterPrevious.classList.add("previous")
      chapterPrevious.textContent = "Previous";
      //hardcoded length- to fix
      if (chapNumber <= 1) {
        chapterPrevious.style.display = "none"
      }
      chapterPrevious.addEventListener("click", function () {
        createChapterModal(chapNumber - 1)
        chapterModal.remove()
      });
      chapterNav.appendChild(chapterPrevious);
      //next chapter button
      var chapterNext = document.createElement("button");
      chapterNext.classList.add("button")
      chapterNext.classList.add("next")
      chapterNext.textContent = "Next";
      //current hardcoded length- to fix
      if (chapNumber >= chapterCount) {
        chapterNext.style.display = "None"
      }
      //go to next chapter
      chapterNext.addEventListener("click", function () {
        createChapterModal(chapNumber + 1)
        chapterModal.remove()
      });
      chapterNav.appendChild(chapterNext);
      chapterModal.appendChild(chapterNav)
      //append modal to body
      document.body.appendChild(chapterModal)
      //open modal
      chapterModal.showModal();
    })
    .catch((error) => {
      console.log("Error retrieving chapter from Firebase:", error);
    });
}

async function chapterListSetup() {
  return new Promise((resolve, reject) => {
    //get num of chapters from db
    firebase.database().ref('chapters-count').once("value")
      .then((snapshot) => {
        chapterCount = snapshot.val()
        chaptersList.innerHTML = ""
        // <li class="chap-li"><a class="chap-a">Chapter 1 - xxxxx</a></li>
        //create li elements for each chapter
        for (var i = 0; i < snapshot.val(); i++) {
          var li = document.createElement("li")
          li.classList.add('chap-li')
          var a = document.createElement('a')
          a.classList.add("chap-a")
          a.innerHTML = `Chapter ${i + 1}`
          li.appendChild(a)
          chaptersList.appendChild(li)
        }
        resolve();
      })
      .catch((error) => {
        console.log("Error retrieving chapter list from Firebase:", error);
        reject(error);
      });
  });
}
