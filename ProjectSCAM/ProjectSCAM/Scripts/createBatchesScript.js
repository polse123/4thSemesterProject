function checkBatchID() {

    var batchID = document.getElementById("idSearchField").value;
    var regex = /^[\d]{1,10}$/; 


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
    var regex = /^[\d]{1,10}$/; 


    if (regex.test(latestBatch)) {
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
    var regex = /^ ([0 - 2][0 - 9] | (3)[0 - 1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/; //Simple date dd/mm/yyyy


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
    var regex = /^[\d]{1,10}$/;


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
    var regex = /^[0-5]$/;


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
function getHistory() {
   var batchselect = document.getElementById("BatchId");
    var selected = batchselect.value;
    //if (selected != null) {
        window.location.href = "/Batch/HistoryButton/" + selected;
    //}
    //else { window.location.href = "/Batch/HistoryButton/" + "0";}
    //$.get("/batch/HistoryButton", { id: selected} + id);
    //window.location.href = "/Batch/HistoryButton/" + selected;
}
function getBatchReport() {
    var batchselect = document.getElementById("BatchId");
    var selected = batchselect.value;
    //$.get("/batch/HistoryButton", { id: selected} + id);
    window.location.href = "/Batch/BatchreportButton/" + selected;
}
function getRecall() {
    var batchselect = document.getElementById("BatchId");
    var selected = batchselect.value;
    //$.get("/batch/HistoryButton", { id: selected} + id);
    window.location.href = "/Batch/RecallButton/" + selected;
}