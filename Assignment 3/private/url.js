exports.allCity = function(){
    return 'https://assignmentinteractiveapi.herokuapp.com/all';
}

exports.getCity = function(city){
    return 'https://assignmentinteractiveapi.herokuapp.com/get/' + city;
}

exports.insertCity = function(city){
    return 'https://assignmentinteractiveapi.herokuapp.com/post/' + city;
}

exports.updateCity = function(city){
    return 'https://assignmentinteractiveapi.herokuapp.com/put/' + city;
}

exports.deleteCity = function(city){
    return 'https://assignmentinteractiveapi.herokuapp.com/del/' + city;
}