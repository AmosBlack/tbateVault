
//chapters-list in html
let chaptersCollection = document.getElementsByClassName("chap-li")

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
      //go to previous chapter
      var chapterPrevious = document.createElement("button");
      chapterPrevious.classList.add("button")
      chapterPrevious.classList.add("previous")
      chapterPrevious.textContent = "Previous";
      //hardcoded length- to fix
      if(chapNumber <= 1){
        chapterPrevious.style.display = "none"
      }
      chapterPrevious.addEventListener("click", function () {
          createChapterModal(chapNumber-1)
          chapterModal.remove()
      });
      chapterModal.appendChild(chapterPrevious);
      //next chapter button
      var chapterNext = document.createElement("button");
      chapterNext.classList.add("button")
      chapterNext.classList.add("next")
      chapterNext.textContent = "Next";
      //current hardcoded length- to fix
      if(chapNumber>=7){
        chapterNext.style.display = "None"
      }
      //go to next chapter
      chapterNext.addEventListener("click", function () {
        createChapterModal(chapNumber+1)
        chapterModal.remove()
      });
      chapterModal.appendChild(chapterNext);
      //append modal to body
      document.body.appendChild(chapterModal)
      //open modal
      chapterModal.showModal();
    })
    .catch((error) => {
      console.log("Error retrieving chapter from Firebase:", error);
    });
}

//for each chap-li, on-click create chapter modal
Array.from(chaptersCollection).forEach((element, index) => {
  element.addEventListener("click", () => {
    var chapterNumber = index+1
    createChapterModal(chapterNumber);
  });
});


