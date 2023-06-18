//dom vars

let modalButton = document.getElementById("modal-open")
let authModal = document.getElementById("auth-container")
let alertLogin = document.getElementById("authentication-alert")
let keyInput = document.getElementById("user-key-input")
let keyInputSubmit = document.getElementById("key-submit")
let chapterList = document.getElementById("chap-list")


//firebase-initialization
const firebaseConfig = {
    apiKey: "AIzaSyAndTqSX-EfgG3URZDGGVf_uB-K3hSpVlw",
    authDomain: "tbatevault.firebaseapp.com",
    databaseURL: "https://tbatevault-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "tbatevault",
    storageBucket: "tbatevault.appspot.com",
    messagingSenderId: "601887097241",
    appId: "1:601887097241:web:c82ab39ff0ad0e4f9d1308"
};

const app = firebase.initializeApp(firebaseConfig)
const DB = firebase.database()
let key, uid
//check if auth is done
let isAuth = false

//auth-modal-function

//button event listener
modalButton.addEventListener("click", () => {
    authModal.showModal()
    alertLogin.style.display = "none"
})



function generateUserKey() {
    const keyLength = 10
    const str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    const strLength = str.length
    key = ""
    for (var i = 0; i < keyLength; i++) {
        var num = Math.floor(Math.random() * (strLength))
        key += str[num]
    }
    return key
}

//display chap-list based on authstate
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        isAuth = true
        if(user.displayName == "Ojas Mittal"){
            document.getElementById("admin-anchor").style.display = "inline-flex"
        }
    }
    else {
        chapterList.style.display = "none"
        isAuth = false
        console.log(chapterList.style.display)


    }
})

function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithPopup(provider)
        .then(result => {
            console.log(isAuth + "is auth")
            //login data
            const isNewUser = result.additionalUserInfo.isNewUser
            const user = result.user
            uid = user.uid
            const displayName = user.displayName
            //update login alert module
            alertLogin.textContent = 'Auth Successful'
            alertLogin.style.display = "block"
            alertLogin.style.backgroundColor = "rgba(125, 255, 4, 0.2)"
            alertLogin.style.borderColor = "rgba(125, 255, 4, 0.3)"
            //enable key inputs
            keyInput.disabled = false
            keyInputSubmit.disabled = false
            //create key for new users
            var userRef = DB.ref(`users/${uid}`)
            if (isNewUser) {
                var userData = {
                    userName: displayName,
                    userKey: generateUserKey(),
                    isVerified:true,
                }
                //push key to db
                userRef.set(userData)
            }

            keyInputSubmit.addEventListener("click", () => {
                userRef.child("userKey").once("value").then((snapshot) => {
                    var userKey = snapshot.val()
                    if (keyInput.value == userKey && isAuth == true) {
                        console.log(chapterList.style.display)
                        chapterList.style.display = "flex"
                        console.log(chapterList.style.display)
                        authModal.close()
                    }
                    keyInput.value = ""

                })
            })

        })
        .catch(error => {
            alertLogin.textContent = 'Auth Failed'
            alertLogin.style.display = "block"
            alertLogin.style.backgroundColor = "rgba(200,0,0,0.2)"
            alertLogin.style.borderColor = "rgba(200,0,0,0.3)"
        })

}



//signout button
document.getElementById("signout-button").addEventListener("click", () => {
    firebase.auth().signOut(console.log("auth" + isAuth))
})

