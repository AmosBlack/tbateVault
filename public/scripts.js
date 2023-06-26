//dom vars
let modalButton = document.getElementById("modal-open")
let signoutButton = document.getElementById("signout-button")
let authModal = document.getElementById("auth-container")
let alertLogin = document.getElementById("authentication-alert")
let alertKey = document.getElementById("key-alert")
let keyInput = document.getElementById("user-key-input")
let keyInputSubmit = document.getElementById("key-submit")
let chapterList = document.getElementById("chap-list")


let key, uid
//check if auth is done
let isAuth = false  // global checker of Google login status


//auth-modal-function

//button event listener
modalButton.addEventListener("click", () => {
    //open login page
    authModal.showModal()
    //disable key input
    disableKeyEntry()
    //hide alerts
    alertLogin.style.display = "none"
    alertKey.style.display = "none"
})



function generateUserKey() {
    //generate an unique key of 10 chars
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

//change isAuth based on Auth State
AUTH.onAuthStateChanged((user) => {
    if (user) {
        isAuth = true
        //user unique id from FB
        uid = user.uid
        displayChapterList()
        //for admin access jank/junk
        if (user.displayName == "Ojas Mittal" || user.displayName == "big stinker" || user.displayName == "sandro nozadze" || user.displayName == "Amos Black") {
            document.getElementById("admin-anchor").style.display = "inherit"
        }
        else {
            document.getElementById("admin-anchor").style.display = "none"
        }
    }
    else {
        //not verified
        isAuth = false
        //hide chapterlist,adminlink
        chapterList.style.display = "none"
        document.getElementById("admin-anchor").style.display = "none"
    }
})

//o
function userSetup(result) {
    //login data
    const isNewUser = result.additionalUserInfo.isNewUser
    const user = result.user
    uid = user.uid
    const displayName = user.displayName
    //update login alert module
    alertUser(alertLogin, "Auth Successful", "block", "rgba(125, 255, 4, 0.2)", "rgba(125, 255, 4, 0.3)")
    //enable key inputs
    keyInput.disabled = false
    keyInputSubmit.disabled = false
    //create key for new users
    var userRef = DB.ref(`users/${uid}`)
    if (isNewUser) {
        //userdata object (pushed into DB)
        var userData = {
            userName: displayName,
            userKey: generateUserKey(),
            isVerified: false,
        }
        //push key to db
        userRef.set(userData)
    }

    keyInputSubmit.addEventListener("click", () => {
        //retrieve client-key from DB
        DB.ref(`users/${uid}`).child("userKey").once("value").then((snapshot) => {
            //client key in DB
            var userKey = snapshot.val()
            //client key in DB vs input key check + google auth
            if (keyInput.value == userKey) {
                displayChapterList()
                //verified in DB
                userRef.child("isVerified").set(true)
                authModal.close()
            }
            else {
                //unVerified in DB
                userRef.child("isVerified").set(false)
                alertUser(alertKey, "Wrong Key", "block", "rgba(200,0,0,0.2)", "rgba(200,0,0,0.3)")
            }
            keyInput.value = ""

        })
    })
}

function googleLogin() {

    const provider = new firebase.auth.GoogleAuthProvider()
    AUTH.signInWithPopup(provider)
        .then(result => {
            userSetup(result)

        })
        .catch(error => {
            //alert failure of google auth
            alertUser(alertLogin, "Auth Failed", "block", "rgba(200,0,0,0.2)", "rgba(200,0,0,0.3)")
        })

}



//signout button
signoutButton.addEventListener("click", (user) => {
    //signout
    AUTH.signOut()
    DB.ref(`users/${uid}/isVerified`).set(false)
    uid = null

})

function displayChapterList() {
    let isVerified
    //isVerified from DB, if true then show chap-list
    DB.ref(`users/${uid}/isVerified`).once("value").then((snapshot) => {
        isVerified = snapshot.val()
        if (isVerified) {
            chapterList.style.display = "flex"
        }
    })


}

//for making alerts
function alertUser(alert, text, display, bgColor, borderColor) {
    alert.textContent = text
    alert.style.display = display
    alert.style.backgroundColor = bgColor
    alert.style.borderColor = borderColor
}

//for disabling key entry
function disableKeyEntry() {
    keyInput.disabled = true
    keyInputSubmit.disabled = true
}

