function machineCommand(com) {
    $.post("/overview/machinecontrol", { command: com });
    refreshBQ();
};
function refreshBQ() {
    $.get("/overview/refreshbq", function (data) {
        console.log(data);
        var dat = JSON.parse(data);
        console.log(dat);
        var table = document.getElementById("batchtable");
        $("#batchtable tbody tr").remove()
        document.getElementById("batchtable").innerHTML += "<tbody>";
        dat.forEach(function (item) {
            document.getElementById("batchtable").innerHTML += "<tr><td>" + item.Id + "</td>"+ "<td>"+item.Priority+"</td>"+"<td>" + item.Amount + "</td><td>" + item.Speed + "</td><td>" + item.RecipeName + "</td></tr>";
        });
        document.getElementById("batchtable").innerHTML += "</tbody>";
    });
};
