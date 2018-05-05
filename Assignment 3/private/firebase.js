exports.showAll = function(db, callback) {
    var ref = db.ref("/");
    ref.once("value", function(snapshot) {
        callback(snapshot);
    });
}

exports.showFromFavouriteList = function(db, email, callback) {
    var ref = db.ref("/Favourite");
    var arrData = new Array();
    ref.once("value", function(snapshot) {
        snapshot.forEach(function(item){
        if(email.replace(".",",") == item.val().email){
            arrData.push(item.val().city);
        }
    });
    console.log(arrData);
    callback(arrData);
    });
}

exports.addToFavouriteList = function(db, email, city, callback) {
    var ref = db.ref("/Favourite");
    ref.once("value", function(snapshot){
       var bool = true;
       snapshot.forEach(function(item){
          if(email.replace(".",",") == item.val().email && city == item.val().city){
              bool = false;
          } 
       });
       
       if(bool){
            var date_time = new Date().getTime();
            var newRef = db.ref("/Favourite/" + date_time);
            var user_info = {
                email: email.replace(".", ","),
                city: city
            }
            newRef.set(user_info);
       }
       
       callback(bool);
       
    });
}

exports.register = function(db, email, password, callback) {
    var ref = db.ref("/User");

    ref.once("value", function(snapshot) {
        var bool = true;
        snapshot.forEach(function(item) {
            if (email.replace(".", ",") == item.val().email) {
                bool = false;
            }
        });

        if (bool) {
            var date_time = new Date().getTime();
            var newRef = db.ref("/User/" + date_time);
            var user_info = {
                email: email.replace(".", ","),
                password: password
            }
            newRef.set(user_info);

        }

        callback(bool);
    });
}


exports.login = function(db, email, password, callback) {
    var ref = db.ref("/User/");
    ref.once("value", function(snapshot) {
        var bool = false;
        snapshot.forEach(function(item) {
            if (email.replace(".", ",") == item.val().email && password == item.val().password) {
                bool = true;
            }
        });
        callback(bool);
    });
}
