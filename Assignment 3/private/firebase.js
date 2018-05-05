exports.showAll = function(db, callback) {
    var ref = db.ref("/");
    ref.once("value", function(snapshot) {
        callback(snapshot);
    });
}

exports.showFromFavouriteList = function(db, email, callback) {

    // var ref = db.ref("/Favourite");

    // ref.orderByChild('email').equalTo(email).on("value", function(snapshot) {

        // console.log(snapshot.val());
        //     callback(snapshot);

    // });
}

exports.addToFavouriteList = function(db, email, city, callback) {

        // var ref = db.ref("/Favourite/");

        //     ref.once("value", function(snapshot) {
        //         var bool = true;
        //         snapshot.forEach(function(item) {
        //             if (email == item.val().email && city == item.val().city) {
        //                 bool = false;
        //                 console.log(bool);
        //             }
        //         });

        //         if (bool) {
        //             var date_time = new Date().getTime();

        //           var twoRef = db.ref("/Favourite/" + date_time);

        //             var city_info = {
        //                 email: email,
        //                 city: city
        //             }

        //             if (twoRef.set(city_info)) {
        //               callback(true);
        //             }
        //             else {
        //               callback(false);
        //             }
        //         }

        //     });

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
