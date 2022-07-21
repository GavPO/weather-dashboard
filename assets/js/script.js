var apiKey = "&appid=797e5dfb12b23de3a71f034e7574feae";
var apiCall = "https://api.openweathermap.org/data/2.5/onecall?";
var geoCall = "http://api.openweathermap.org/geo/1.0/direct?q=";
var apiExclude = "&exclude=minutely,hourly,alerts";
var searchField = $("#search-field");
var searchBtn = $("#search-button");
var currentContainer = $("#current-container");
var forecastContainer = $("#forecast-container");


// USES CITY THAT THEY TYPED AND GETS ITS LATITUDE AND LONGITUDE
function getLatLon() {
    var city = searchField.val().trim();
    fetch(geoCall+city+apiExclude+apiKey)
    .then (function(response) {    
        return response.json();
    })
    .then (function(data) {
        var cityLat = "lat="+data[0].lat;
        var cityLon = "&lon="+data[0].lon;
        getCityData(cityLat, cityLon, city);
    })
};

// USES CITIES LATITUDE AND LONGITUDE TO GET WEATHER DATA
function getCityData(cityLat, cityLon, city) {
    fetch(apiCall+cityLat+cityLon+"&units=imperial"+apiExclude+apiKey)
    .then (function(response) {
        return response.json()
    })
    .then (function(data) {
        var cityData = data;
        showWeather(cityData, city);
    })
};

// USES CITY DATA TO PUT THE DATA ON THE SCREEN
function showWeather(cityData, city) {
    var currentWeather = cityData.current
    console.log(cityData);
    console.log(moment.unix(cityData.current.dt));
    var headEl = $("<h3>");
    var paraEl = $("<p>");
    var weatherCon = currentWeather.weather[0].description;
    var weatherIcon = currentWeather.weather[0].icon;
    var imgSrc = "http://openweathermap.org/img/wn/"+weatherIcon+"@2x.png";
    var tempText = currentWeather.feels_like;
    var humidText = currentWeather.humidity;
    var windText = currentWeather.wind_speed;
    var uvText = currentWeather.uvi;
    headEl.text(city + " "+ moment.unix(cityData.current.dt)._d.toDateString());
    paraEl.html("Weather Condition: " + weatherCon + "<img src="+imgSrc+">" + "</br>" + "Currently: " + tempText + "°F" + "</br>" + "Humidity: " + humidText + "</br>" + "Wind Speed: " + windText + "MPH" + "</br>" + "UV Index: " + uvText);
    headEl.append(paraEl);
    currentContainer.append(headEl);
    var cardEl = $("<div>");
};


searchBtn.on("click", getLatLon);