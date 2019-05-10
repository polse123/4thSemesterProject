function getUserType() {
         $.get("/login/usertype", function (data) {
             var usertype = data.type;
        if (usertype === "1") {
             retrieveinterval = setInterval(CheckPopup, 1000);
         }
        
    });
};