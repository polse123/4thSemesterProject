function checkSpeed() {

    //Create if for each type of beer.

    var speed = document.getElementById("speedField").value;
    var regex = /^[0-5]$/;
    


    if (regex.test(speed)) {
        document.getElementById("speedField").style.color = "green";
        return regex.test(speed);

    }
    else {
        document.getElementById("speedField").style.color = "red";
        return regex.test(speed)
    }

}
function checkAmount() {



    var amount = document.getElementById("amountField").value;
    var regex = /^[\d]$/;


    if (regex.test(amount)) {
        document.getElementById("amountField").style.color = "green";
        return regex.test(amount);

    }
    else {
        document.getElementById("amountField").style.color = "red";
        return regex.test(amount)
    }

}