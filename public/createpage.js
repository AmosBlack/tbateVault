let chaptersCollection = document.getElementsByClassName("chap-li")

function createChapterModal(chapNumber){
    console.log(chapNumber)
}


Array.from(chaptersCollection).forEach((element,index) => {
  element.addEventListener("click",()=>{
    createChapterModal(index)
  })

});
