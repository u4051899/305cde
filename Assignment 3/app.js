var express = require('express');
var app = express();
var http = require('http').Server(app);
var port = process.env.POST || 8080;
var session = require('express-session');
var request = require('request');
var bodyParser = require('body-parser');

var go = require('./private/firebase.js');

var backHome = '<script>window.location.href="/"</script>';

var firebase = require('firebase')
var config = {
    apiKey: "AIzaSyB-aL2LMXFVvmRQ1CaU19zfbPD0PMOCiJk",
    authDomain: "c305cde.firebaseapp.com",
    databaseURL: "https://c305cde.firebaseio.com",
    projectId: "c305cde",
    storageBucket: "c305cde.appspot.com",
    messagingSenderId: "252930397890"
};

firebase.initializeApp(config);
var db = firebase.database();

app.use(express.static(__dirname + '/public/css'));
app.use(express.static(__dirname + '/public/img'));


app.use(express.urlencoded({
    extended: true
}));

var url = require('./private/url.js');

app.use(session({
    secret: 'thisissession',
    resave: true,
    saveUninitialized: true
}));

app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', function(req, res) {

    var getSession = null;
    var getSearchCity = null;

    res.set('Content-Type', 'text/html');

    if (req.session.user_email != null) {
        getSession = req.session.user_email;
    }

    if (req.session.search_city != null && req.session.search_city != "") {
        getSearchCity = req.session.search_city;
    }

    res.render('index.html', { getSession: getSession, getSearchCity: getSearchCity });

    res.end();
});


app.get('/jsonAllCity', function(req, res) {
    var apiUrl = url.allCity();

    request({
        url: apiUrl,
        json: true
    }, function(err, response, jsonDatas) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.json({ jsonDatas: jsonDatas });

        res.end();
    });
});

app.get('/jsonOneCity/:name', function(req, res) {

    var selectedCity = JSON.stringify(req.params)
    var city = JSON.parse(selectedCity);

    var apiUrl = url.getCity(city.name);

    request({
        url: apiUrl,
        json: true
    }, function(err, response, jsonDatas) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.json({ jsonDatas: jsonDatas });

        res.end();
    });
});



app.post('/search', function(req, res) {
    var searchCity = req.body.searchCity;
    req.session.search_city = searchCity;
    res.send(backHome);
    res.end();
});

app.post('/insert', function(req, res) {
    var city = req.body.insertCity;
    console.log(url.insertCity(city));

    request.post(url.insertCity(city));

    res.send(backHome);
    res.end();
});


app.get('/put/:name', function(req, res) {

    var selectedCity = JSON.stringify(req.params)
    var city = JSON.parse(selectedCity);

    request.put(url.updateCity(city.name));

    res.send(backHome);
    res.end();


});

app.get('/del/:name', function(req, res) {

    var selectedCity = JSON.stringify(req.params)
    var city = JSON.parse(selectedCity);

    request.delete(url.deleteCity(city.name));

    res.send(backHome);
    res.end();

});

app.get('/addToFavouriteList/:name', function(req, res) {

    var selectedCity = JSON.stringify(req.params)
    var city = JSON.parse(selectedCity);

    var user = req.session.user_email;

    go.addToFavouriteList(db, user, city.name, function(bool) {

        if (bool) {
            console.log("Add to favourite list success");
        }

        else {
            console.log("Add to favourite list error");
        }

        res.send(backHome);
        res.end();

    });
});

app.get('/showFromFavouriteList/', function(req, res) {

    var user = req.session.user_email;

    console.log(user);

    go.showFromFavouriteList(db, user, function(userDatas) {
        console.log(userDatas);
        res.json({ userDatas: userDatas});

        res.end();

    });
});

app.get('/seachFromFavourite/:name', function(req, res) {
    var selectedCity = JSON.stringify(req.params)
    var city = JSON.parse(selectedCity);
    
    req.session.search_city = city.name;
    
    res.send(backHome);
    res.end();
    
})

app.post('/signin', function(req, res) {

    var signin_email = req.body.signinEmail;
    var signin_password = req.body.signinPassword;

    console.log("Signin Username : " + signin_email);
    console.log("Signin Passowrd : " + signin_password);

    go.login(db, signin_email, signin_password, function(bool) {
        if (bool) {
            req.session.user_email = signin_email;
            // res.set('Content-Type', 'text/html');
            // res.render("index", { sessionEmail: req.session.user_email });
            // res.end();
            console.log("Sign in success");
            res.send(backHome);
            res.end();
        }
        else {
            console.log("Signin Error");
            res.send(backHome);
            res.end();
        }
    });
});

app.post('/signup', function(req, res) {
    var signup_email = req.body.signupEmail;
    var signup_password = req.body.signupPassword;
    var signup_password_confirm = req.body.signupPasswordConfirm;

    console.log("Signup Username : " + signup_email);
    console.log("Signup Password : " + signup_password);
    console.log("Signup Password Confirm : " + signup_password_confirm);

    if (signup_password == signup_password_confirm) {
        go.register(db, signup_email, signup_password, function(bool) {
            if (bool) {
                console.log("Sign up success");

            }
            else {
                console.log("Email duplication");
            }
        });
    }
    else {
        console.log("Password error");
    }
    res.send(backHome);
    res.end();
});

app.get('/signout', function(req, res) {
    req.session.destroy();
    res.send(backHome);
    res.end();
})


http.listen(port, function() {
    console.log('Server Port : ' + port);
});
