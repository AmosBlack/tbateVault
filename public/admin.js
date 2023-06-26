let inputPwd = document.getElementById("admin-pwd")
let inputPwdSubmit = document.getElementById("admin-click")
let userTable = document.getElementById("users-table")
let exitAdmin = document.getElementById("admin-exit")
let pwd
//retrieving pwd from DB
DB.ref("password").once("value").then((snapshot) => {
    pwd = snapshot.val()
})
//opening admin dashboard
inputPwdSubmit.addEventListener("click", () => {
    if (inputPwd.value == pwd) {
        userTable.style.display = "flex"
        exitAdmin.style.display = "inherit"
        inputPwdSubmit.style.display = "none"
        inputPwd.style.display = "none"
        getUsers()
    }
    inputPwd.value = ""
})
//closing admin dashboard
exitAdmin.addEventListener("click", () => {
    userTable.style.display = "none"
    exitAdmin.style.display = "none"
    inputPwdSubmit.style.display = "inherit"
    inputPwd.style.display = "inherit"

})

//get list of all users
function getUsers() {
    DB.ref("users/").once("value")
        .then((snapshot) => {
            const usersObj = snapshot.val();
            const userEntries = Object.values(usersObj);
            userDataObj = {};
            // Create a new <tbody> element
            var tbody = document.getElementById('tbody');
            tbody.innerHTML = ""

            for (var i = 0; i < userEntries.length; i++) {
                // Create a new <tr> element
                var tr = document.createElement('tr');
                var userArr = Object.values(userEntries[i]);

                // Create the first <th> element and append it to the <tr>
                var th1 = document.createElement('th');
                th1.textContent = userArr[2];
                tr.appendChild(th1);

                // Create the second <th> element and append it to the <tr>
                var th2 = document.createElement('th');
                th2.textContent = userArr[1];
                th2.addEventListener("click", (event) => {
                    var clickedElement = event.target;
                    var textContent = clickedElement.textContent;
                  
                    // Copy the text inside the text field
                    navigator.clipboard.writeText(textContent);
                  
                    // Alert the copied text
                    alert("Copied User Key: " + textContent);
                  });
                  
                tr.appendChild(th2);

                // Append the <tr> to the <tbody>
                tbody.appendChild(tr);
            }

            // Append the <tbody> to the existing table
            userTable.appendChild(tbody);
        });



}



