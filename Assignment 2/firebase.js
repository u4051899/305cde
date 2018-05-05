// function for display all firebase data
exports.showAll = function(db, callback){
    var ref = db.ref("/City/");
    ref.once("value", function(snapshot) {
    callback(snapshot);
    });
}

// function for display a city by the city name
exports.show = function(db, city, callback){
    var ref = db.ref("/City/").child(city).once('value', function(snapshot){
      callback(snapshot); 
    });
}

// function for insert a city data by the city name
exports.insert = function(db, name, temp, temp_min, temp_max, wind_speed, wind_deg, cloud){

    var ref = db.ref("/City/"+name);
        
    var weather_value = {
        name: name,
        temp: temp,
        temp_min : temp_min,
        temp_max : temp_max,
         wind_speed : wind_speed,
    wind_deg : wind_deg,
    cloud : cloud
    }
    
    if(ref.set(weather_value)){
        return true;
    }
    
    else{
        return false;
    }
}

// function for update the existsed city by the city name from openweathermap data
exports.update = function(db, name, temp, temp_min, temp_max, wind_speed, wind_deg, cloud){
    
var ref = db.ref("/City/");

ref.once('value', function(snapshot) {
  if (snapshot.hasChild(name)) {
      ref.child(name).update({
    name : name,
    temp: temp,
    temp_min : temp_min,
    temp_max : temp_max,
    wind_speed : wind_speed,
    wind_deg : wind_deg,
    cloud : cloud
})
  }
})
}

// function for delete the city by the city name
exports.delete = function(db, name){
    var ref = db.ref("/City/"+name)
    
    if(ref.remove()){
        return true;
    }
    return false;
}