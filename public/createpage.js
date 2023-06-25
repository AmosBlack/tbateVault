let chaptersCollection = document.getElementsByClassName("chap-li")
console.log(chaptersCollection)
function createChapterModal(chapNumber) {
  var chapterText;

  firebase
    .database()
    .ref(`chapters/${chapNumber}`)
    .once("value")
    .then((snapshot) => {
      chapterText = snapshot.val();

      var chapterModal = document.createElement("dialog");

      var chapterTitle = document.createElement("h1");
      chapterTitle.textContent = `Chapter ${chapNumber}`;
      chapterModal.appendChild(chapterTitle);

      var chapterContent = document.createElement("div");
      chapterContent.innerHTML = chapterText;
      chapterModal.appendChild(chapterContent);

      var chapterClose = document.createElement("button");
      chapterClose.textContent = "Close";
      chapterClose.addEventListener("click", function () {
        chapterModal.close();
      });
      chapterModal.appendChild(chapterClose);

      var chapterPrevious = document.createElement("button");
      chapterPrevious.textContent = "Previous";
      chapterPrevious.addEventListener("click", function () {
        // Logic for going to the previous chapter
        // You can implement the desired functionality here
        console.log("Previous button clicked");
      });
      chapterModal.appendChild(chapterPrevious);

      var chapterNext = document.createElement("button");
      chapterNext.textContent = "Next";
      chapterNext.addEventListener("click", function () {
        // Logic for going to the next chapter
        // You can implement the desired functionality here
        console.log("Next button clicked");
      });
      chapterModal.appendChild(chapterNext);

      chapterModal.showModal();
    })
    .catch((error) => {
      console.log("Error retrieving chapter from Firebase:", error);
    });
}

Array.from(chaptersCollection).forEach((element, index) => {
  element.addEventListener("click", () => {
    createChapterModal(index);
  });
});
