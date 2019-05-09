function setMachine() {
    var machineselect = document.getElementById("machineselect");
    var selected = machineselect.options[machineselect.selectedIndex];
    var span = document.getElementById("description");
    span.textContent = selected.value;
    $.post("/machineselection/setmachine", { ip: selected.text });

}



function buttonEnabler() {
    var machineselect = document.getElementById("machineselect");
    var selected = machineselect.options[machineselect.selectedIndex];
    if (selected.value === "disable") {
        document.getElementById("connectButton").disabled = true;
    } else {
        document.getElementById("connectButton").disabled = false;
    }
}