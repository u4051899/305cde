// api url
exports.insertCity = function(city, key){
    return 'http://api.openweathermap.org/data/2.5/weather?q='+city+'&appid='+key+'&units=metric'
}

// exports.insertLocation = function(lat, lon , key){
//     console.log('http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&appid='+key+'&units=metric'
// )
//     return 'http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&appid='+key+'&units=metric'
// }