function checkUsername() {



    var username = document.getElementById("usernameField").value;
    var regex = /^[a-zA-Z\d]{5,20}$/;


    if (regex.test(username)) {
        document.getElementById("usernameField").style.color = "green";
        return regex.test(username);

    }
    else {
        document.getElementById("usernameField").style.color = "red";
        return regex.test(username)
    }

}
function checkPassword() {



    var password = document.getElementById("passwordField").value;
    var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;


    if (regex.test(password)) {
        document.getElementById("passwordField").style.color = "green";
        return regex.test(password);

    }
    else {
        document.getElementById("passwordField").style.color = "red";
        return regex.test(password)
    }

}