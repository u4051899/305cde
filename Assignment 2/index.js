   
   // call the firebase
    var firebase = require('firebase')
    
    // firebase config
    var config = {
    apiKey: "AIzaSyB-aL2LMXFVvmRQ1CaU19zfbPD0PMOCiJk",
    authDomain: "c305cde.firebaseapp.com",
    databaseURL: "https://c305cde.firebaseio.com",
    projectId: "c305cde",
    storageBucket: "c305cde.appspot.com",
    messagingSenderId: "252930397890"
};

// connect firebase
firebase.initializeApp(config);
var db = firebase.database();


const restify = require("restify")

// start nodejs
const server = restify.createServer()

// api url from openmapstreet
const url = require("./url.js")

// api key
const key = require("./key.js")

const request = require("request")

// server port
var port = process.env.POST || 8080

// call firebase action method
var fire = require("./firebase.js");


// through the lat and lon to get the weather
// server.get('/weather/:lat/:lon', (req, res) => {

//     // get the url data
//     var selectedLocation = JSON.stringify(req.params)
//     var lat = JSON.parse(selectedLocation);
//     var lon = JSON.parse(selectedLocation);
  
//     // set the openweathermap
//     var apiKey = key.openweathermap()
//     var apiUrl = url.insertLocation(lat.lat, lon.lon, apiKey)
    
//     request(apiUrl, function (err, response, info){
//         let weather = JSON.parse(info)
        
//         console.log(weather)
//         res.write('<h1>Weather</h1>');
//         res.write('<h2>City Name : ' + weather.name + '</h2>')
//         res.write('<h3>Temp : ' + weather.main.temp + '</h3>')
//         res.write('<h4>Temp Min : ' + weather.main.temp_min + '</h4>')
//         res.write('<h4>Temp Max : ' + weather.main.temp_max + '</h4>')
//         res.end();
//     })
// })

//JSON.stringify(JSON.parse(value),null,2));

// display all the data from firebase
server.get('/all', (req,res) => {
    fire.showAll(db, function(snapshot){
        // res.write('<h1>Weather</h1>');
        // console.log(snapshot.val().name);
    //   snapshot.forEach(function(item){
    //       var city_name = item.val().name;
    //       var temp = item.val().temp;
    //       var temp_min = item.val().temp_min;
    //       var temp_max = item.val().temp_max;
         
    //     res.write('<h2>City Name : ' + city_name + '</h2>')
    //     res.write('<h3>Temp : ' + temp + '</h3>')
    //     res.write('<h4>Temp Min : ' + temp_min + '</h4>')
    //     res.write('<h4>Temp Max : ' + temp_max + '</h4>')
    //     res.write('<hr>');
    //       console.log(city_name);
    //       console.log(temp);
    
    console.log("test" + JSON.stringify(snapshot.val()));
    
    // display the data on the webpage
    res.write(JSON.stringify(snapshot.val()));
        
    
    //   }); 
      
      
      
      
      res.end();
      
    });
    
})

// display the city by the city name
server.get('/get/:name', (req,res) => {
    
    var city = JSON.stringify(req.params);
    var cityName = JSON.parse(city);
    
    // firebase display action
    fire.show(db, cityName.name, function(snapshot){
        
        //display the city weather on web page
        res.write(JSON.stringify(snapshot.val()));
        console.log(snapshot.val());
        res.end();
    }); 

})


server.post('/post/:name', (req, res) => {

    
    var selectedCity = JSON.stringify(req.params)
    var city = JSON.parse(selectedCity);
    var apiKey = key.openweathermap()
    var apiUrl = url.insertCity(city.name, apiKey)
    
   
    request(apiUrl, function (err, response, info){
        let weather = JSON.parse(info)
        
        // check insert result
        if(fire.insert(db, weather.name, weather.main.temp, weather.main.temp_min, weather.main.temp_max, weather.wind.speed, weather.wind.deg, weather.clouds.all)){
            
         console.log('Insert ' + city.name + " done!" );
         
         res.write('true');
         
    }
    else{
        console.log('Insert action error!');
        res.write('false');
    }

        console.log(weather)
        res.end();
    })
})

// update the city by the city name
server.put('/put/:name', (req, res) => {

    var selectedCity = JSON.stringify(req.params)
    var city = JSON.parse(selectedCity);
    var apiKey = key.openweathermap()
    var apiUrl = url.insertCity(city.name, apiKey)
    
   
    request(apiUrl, function (err, response, info){
        let weather = JSON.parse(info);
        
        //firebase update acion
        fire.update(db, weather.name, weather.main.temp, weather.main.temp_min, weather.main.temp_max, weather.wind.speed, weather.wind.deg, weather.clouds.all);

        console.log(weather)
        res.write('true');
        res.end();
    })
})

// delete the city by the city name
server.del('/del/:name', (req, res) => {
    var selectedCity = JSON.stringify(req.params)
    var city = JSON.parse(selectedCity);
    console.log(city.name)
    
    if(fire.delete(db, city.name)){
        console.log('Delete ' + city.name + " done!" );
        res.write('true');
    }
    else{
        console.log('Delete action error!');
        res.write('false');
    }
    
    res.end();
    
});

server.listen((process.env.PORT || 5000), function(err){
   if(err){
       console.error(err)
   } 
   else{
       console.log('App is ready at : ' + port)
   }
});


