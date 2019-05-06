function machineCommand(com) {
    alert(com);
    alert("yeet");
    $.post("/overview/machinecontrol", { command: com });
};
function refreshBQ() {
    alert("oof");
    $.get("/overview/refreshbq", function (data) {
        console.log(data);
        var dat = JSON.parse(data);
        console.log(dat);
        dat.forEach(function (item) {
            document.getElementById("batchtable").innerHTML += "<tr><td>" + 11 + "</td><td>" + item.Amount + "</td><td>" + item.Speed + "</td><td>" + item.RecipeName + "</td></tr>";
        });
    });
};
