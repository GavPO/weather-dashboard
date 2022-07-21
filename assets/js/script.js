var apiKey = "&appid=797e5dfb12b23de3a71f034e7574feae";
var apiCall = "https://api.openweathermap.org/data/2.5/onecall?";
var geoCall = "http://api.openweathermap.org/geo/1.0/direct?q=";
var searchField = $("#search-field");
var searchBtn = $("#search-button");

function searchCity() {
    var city = searchField.val().trim();
    searchField.val("");
    getLatLon(city);

};

function getLatLon(city) {
    fetch(geoCall+city+apiKey)
    .then (function(response) {    
        return response.json();
    })
    .then (function(data) {
        console.log(data);
        var cityLat = "lat="+data[0].lat;
        var cityLon = "&lon="+data[0].lon;
        getCityData(cityLat, cityLon);
    })
};

function getCityData(cityLat, cityLon) {
    fetch(apiCall+cityLat+cityLon+apiKey)
    .then (function(response) {
        return response.json()
    })
    .then (function(data) {
        console.log(data);
    })
}





searchBtn.on("click", searchCity);