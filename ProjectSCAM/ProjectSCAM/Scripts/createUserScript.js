
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
function checkRepeatPassword() {



    var password = document.getElementById("passwordField").value;
    var repeatPassword = document.getElementById("repeatPasswordField").value;
    var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;


    if (regex.test(repeatPassword) && password === repeatPassword) {
        document.getElementById("repeatPasswordField").style.color = "green";
        return regex.test(repeatPassword) && password === repeatPassword;

    }
    else {
        document.getElementById("repeatPasswordField").style.color = "red";
        return regex.test(repeatPassword && password === repeatPassword)
    }

}
function checkFirstname() {



    var firstname = document.getElementById("firstnameField").value;
    var regex = /^[a-zA-Z]{2,30}$/;


    if (regex.test(firstname)) {
        document.getElementById("firstnameField").style.color = "green";
        return regex.test(firstname);

    }
    else {
        document.getElementById("firstnameField").style.color = "red";
        return regex.test(firstname)
    }

}
function checkLastname() {



    var lastname = document.getElementById("lastnameField").value;
    var regex = /^[a-zA-Z]{2,30}$/;


    if (regex.test(lastname)) {
        document.getElementById("lastnameField").style.color = "green";
        return regex.test(lastname);

    }
    else {
        document.getElementById("lastnameField").style.color = "red";
        return regex.test(lastname)
    }

}
function checkPhonenumber() {



    var phonenumber = document.getElementById("phonenumberField").value;
    var regex = /^[\d]{8}$/;


    if (regex.test(phonenumber)) {
        document.getElementById("phonenumberField").style.color = "green";
        return regex.test(phonenumber);

    }
    else {
        document.getElementById("phonenumberField").style.color = "red";
        return regex.test(phonenumber)
    }

}
function checkEmail() {



    var email = document.getElementById("emailField").value;
    var regex = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9]+[a-zA-Z0-9.-]+[a-zA-Z0-9]+.[a-z]{0,4}$/;


    if (regex.test(email)) {
        document.getElementById("emailField").style.color = "green";
        return regex.test(email);

    }
    else {
        document.getElementById("emailField").style.color = "red";
        return regex.test(email);
    }

}
function checkFields() {


    if (checkUsername() && checkPassword() && checkRepeatPassword() && checkFirstname() && checkLastname() && checkPhonenumber() && checkEmail()) {

        return true;
    }
    else {

        return false;
    }
}


