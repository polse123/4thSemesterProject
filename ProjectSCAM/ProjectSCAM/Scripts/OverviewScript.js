function machineCommand(com) {
    alert("machine");
    $.post("/overview/machinecontrol", { command: com });
};
function refreshBQ() {
    $.post("/overview/refreshbq", function (data, status) {
        console.log(data);
        var dat = JSON.parse(data);
        dat.forEach(function (item) {
            document.getElementById("batchtable").innerHTML += "<tr><td>" + 10 + "</td><td>" + item.Amount + "</td><td>" + item.Speed + "</td><td>" + item.Type + "</td></tr>";
        });
    });
};