﻿function checkBatchID() {

    var batchID = document.getElementById("idSearchField").value;
    var regex = /@"^[\d]$/; // is this right


    if (regex.test(batchID)) {
        document.getElementById("idSearchField").style.color = "green";
        return regex.test(batchID);

    }
    else {
        document.getElementById("idSearchField").style.color = "red";
        return regex.test(batchID)
    }

}
function checkLatestBatch() {

    var latestBatch = document.getElementById("latestSearchField").value;
    var regex = /^[a-zA-Z\d]{5,20}$/; // need to fix


    if (regex.test(latestBatch)) 
        document.getElementById("latestSearchField").style.color = "green";
    return regex.test(latestBatch);

    }
    else {
    document.getElementById("latestSearchField").style.color = "red";
    return regex.test(latestBatch)
    }

}
function checkDateOfBatch() {



    var dateOfBatch = document.getElementById("dateSearchField").value;
    var regex = /^[a-zA-Z\d]{5,20}$/;// need to fix 


    if (regex.test(dateOfBatch)) {
        document.getElementById("dateSearchField").style.color = "green";
        return regex.test(dateOfBatch);

    }
    else {
        document.getElementById("dateSearchField").style.color = "red";
        return regex.test(dateOfBatch)
    }

}
function checkMachine() {


    var machine = document.getElementById("machineSearchField").value;
    var regex = /^[a-zA-Z\d]{5,20}$/;// needs to be fixed


    if (regex.test(machine)) {
        document.getElementById("machineSearchField").style.color = "green";
        return regex.test(machine);

    }
    else {
        document.getElementById("machineSearchField").style.color = "red";
        return regex.test(machine)
    }

}
function checkProductType() {



    var productType = document.getElementById("productSearchField").value;
    var regex = /^[a-zA-Z\d]{5,20}$/; // needs to be fixed


    if (regex.test(productType )) {
        document.getElementById("productSearchField").style.color = "green";
        return regex.test(productType );

    }
    else {
        document.getElementById("productSearchField").style.color = "red";
        return regex.test(productType)
    }

}
function checkFields() {


    if (checkBatchID() && checkLatestBatch() && checkDateOfBatch() && checkMachine() && checkProductType()  ) {

        return true;
    }
    else {

        return false;
    }
}