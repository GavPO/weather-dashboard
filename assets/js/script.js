var apiKey = "&appid=797e5dfb12b23de3a71f034e7574feae";
var apiCall = "https://api.openweathermap.org/data/2.5/onecall?";
var geoCall = "https://api.openweathermap.org/geo/1.0/direct?q=";
var apiExclude = "&exclude=minutely,hourly,alerts";
var searchField = $("#search-field");
var searchBtn = $("#search-button");
var currentContainer = $("#current-container");
var forecastContainer = $("#forecast-container");
var searchContainer = $("#search-container");
var historyContainer = $("#history-container");

// USES CITY THAT THEY TYPED AND GETS ITS LATITUDE AND LONGITUDE
function getLatLon() {
    // GRABS CITY FROM TEXT INPUT 
    var city = searchField.val().trim();
    // UPDATE THE HISTORY FIELD 
    showHistory();
    fetch(geoCall+city+apiExclude+apiKey)
    .then (function(response) {    
        return response.json();
    })
    .then (function(data) {
        var cityLat = "lat="+data[0].lat;
        var cityLon = "&lon="+data[0].lon;
        // USING THE CITIES LAT AND LON SEND IT TO GET THE WEATHER 
        getCityData(cityLat, cityLon, city);
        // SAVE THE CITY THEY TYPED INTO LOCAL STORAGE WITH ITS LAT AND LON 
        saveCity(cityLat, cityLon, city);
    })
    
};

function saveCity(cityLat, cityLon, city) {
    // OBJECT FOR EACH CITY 
    var savedInfo = {
        theCity: city,
        lati: cityLat,
        longi: cityLon
    };
    // SAVE OBJECT INTO LOCAL STORAGE 
    localStorage.setItem(city, JSON.stringify(savedInfo));
};

function showHistory() {
    historyContainer.children().remove();
    if (localStorage.length === 0) {
        console.log("Empty");
        return
    } else {
        console.log("Not Empty");
        for (i=0; i < localStorage.length; i++) {
            var localKey = localStorage.key(i);
            var savedCity = JSON.parse(localStorage.getItem(localKey));
            var cityBtn = $("<button>");
            cityBtn.addClass("btn btn-dark d-block w-75 m-2 ml-5 history");
            historyContainer.append(cityBtn);
            cityBtn.text(savedCity.theCity);
            console.log(savedCity.theCity)
        }
    };
};

// USES CITIES LATITUDE AND LONGITUDE TO GET WEATHER DATA
function getCityData(cityLat, cityLon, city) {
    fetch(apiCall+cityLat+cityLon+"&units=imperial"+apiExclude+apiKey)
    .then (function(response) {
        return response.json()
    })
    .then (function(data) {
        var cityData = data;
        showWeather(cityData, city, city);
    })
};

// USES CITY DATA TO PUT THE DATA ON THE SCREEN
function showWeather(cityData, city) {
    currentContainer.children().remove();
    var currentWeather = cityData.current;
    // MAKE A TITLE AND SUB-TITLE TEXT ELEMENT 
    var headEl = $("<h3>");
    var paraEl = $("<p>");
    // GRAB THE WEATHER CONDITION AND ITS ICON 
    var weatherCon = currentWeather.weather[0].description;
    var weatherIcon = currentWeather.weather[0].icon;
    var imgSrc = "http://openweathermap.org/img/wn/"+weatherIcon+"@2x.png";
    // GRAB ALL OF THE WEATHER DATA 
    var tempText = currentWeather.feels_like;
    var humidText = currentWeather.humidity;
    var windText = currentWeather.wind_speed;
    var uvText = currentWeather.uvi;
    // CHANGE ALL OF THE TEXT ELEMENTS USING THE DATA GRABBED TO SHOW CURRENT WEATHER
    headEl.text(city + " " + moment.unix(currentWeather.dt)._d.toDateString());
    paraEl.html("Weather Condition: " + weatherCon + "<img src="+imgSrc+">" + "</br>" + "Currently: " + tempText + "°F" + "</br>" + "Humidity: " + humidText + "</br>" + "Wind Speed: " + windText + "MPH" + "</br>" + "UV Index: " + uvText);
    headEl.append(paraEl);
    currentContainer.append(headEl);
    // SEND CITY DATA TO SHOW FORECAST
    showForecast(cityData, city);
};

// USE CITY DATA TO PUT FORECAST ON SCREEN
function showForecast(cityData, city) {
    forecastContainer.children().remove();
    var dailyWeather = cityData.daily;
    // FOR EACH DAY IN THE WEATHER OBJECT
    for (i=1; i < dailyWeather.length-1; i++) {
        // GRAB THE CURRENT WEATHER AND ITS ICON 
        var weatherCon = dailyWeather[i].weather[0].description;
        var weatherIcon = dailyWeather[i].weather[0].icon;
        var imgSrc = "http://openweathermap.org/img/wn/"+weatherIcon+"@2x.png";
        // MAKING THE CARD ELEMENT FOR EACH DAY
        // CARD ASSEMBLY 
        var cardEl = $("<div>")
        var cardBodyEl = $("<div>");
        var cardTitle = $("<h5>");
        var cardText = $("<p>");
        var cardList = $("<ul>");
        var listTemp = $("<li>");
        var listHumid = $("<li>");
        var listWind = $("<li>");
        var listUV = $("<li>");
        cardEl.addClass("card col-4");
        cardBodyEl.addClass("card-body");
        cardTitle.addClass("card-title");
        cardText.addClass("card-text");
        listTemp.addClass("list-group-item");
        listHumid.addClass("list-group-item");
        listWind.addClass("list-group-item");
        listUV.addClass("list-group-item");
        cardList.addClass("list-group list-group-flush");
        cardBodyEl.append(cardTitle, cardText);
        cardEl.append(cardBodyEl);
        cardList.append(listTemp);
        cardList.append(listHumid);
        cardList.append(listWind);
        cardList.append(listUV);
        cardEl.append(cardList);
        forecastContainer.append(cardEl);
        // CARD ASSEMBLY 
        searchField.val("");
        cardTitle.text(city + " " + moment.unix(dailyWeather[i].dt)._d.toDateString());
        cardText.html("Weather Condition: " + weatherCon + "<img src="+imgSrc+">");
        // SET ALL OF THE TEXT TO THE DATA IN THE CURRENT DAY 
        listTemp.text("Temperature: " + dailyWeather[i].feels_like.day);
        listHumid.text("Humidity: " + dailyWeather[i].humidity);
        listWind.text("Wind Speed: " + dailyWeather[i].wind_speed);
        listUV.text("UV Index: " + dailyWeather[i].uvi);
    };
};

// USE THE TEXT OF THE BUTTON TO SEARCH THE LOCAL MEMORY FOR THAT CITY 
function searchFromHistory() {
    var cityToSearch = $(this).text();
    var citySearched = JSON.parse(localStorage.getItem(cityToSearch));
    console.log(citySearched)
    var cityLat = citySearched.lati;
    var cityLon = citySearched.longi;
    var city = citySearched.theCity;
    // USE THE DATA GRABBED FROM LOCAL MEMORY AND SEARCH FOR THAT CITY USING LAT AND LON 
    getCityData(cityLat, cityLon, city);
};

// WHEN CLICKING A HISTORY BUTTON 
historyContainer.on("click", "button", searchFromHistory); 

// WHEN CLICKING THE SEARCH BUTTON 
searchContainer.on("click", "#search-button", getLatLon);

function init() {
    showHistory();
};

init();