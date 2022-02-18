import { apiKey } from "./apiKey.js";
const key = apiKey.apiKey;

const formCountryZip = document.getElementById("formCountryZip");

formCountryZip.addEventListener("submit", function (e) {
    e.preventDefault();

    var zip = document.getElementById("inputZipCode"),
    inputZipCodeValue = zip.value;

    var country = document.getElementById("selectCountry"),
    selectCountryValue = country.value;

    var url = "http://api.openweathermap.org/geo/1.0/zip?zip=" + inputZipCodeValue + "," + selectCountryValue + "&appid=" + key;

    fetch(url, {
        method: "get"
    }).then(function (response) {
        return response.text();
    }).then(function (text) {
        var data = JSON.parse(text);
        zipCountryToWeatherData(data.lat, data.lon);
    }).catch(function (error) {
        console.error(error);
    });
});

function zipCountryToWeatherData(lat, lon) {

    var url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&units=metric&lang=de&appid=" + key;

    fetch(url, {
        method: "get"
    }).then(function (response) {
        return response.text();
    }).then(function (text) {
        showWeather(text);
        showWeatherPreview(text);
        showWeatherPanel(text);
    }).catch(function (error) {
        console.error(error);
    });
}

function formatDate (unixTimestamp) {

    const options = {weekday: "long", day: "numeric", month: "long"};

    const dtFormat = new Intl.DateTimeFormat("de-DE", options);

    return dtFormat.format(new Date(unixTimestamp * 1000));
}

function formatTime (unixTimestamp) {

    const options = {hour: "numeric", minute: "numeric"};
    
    const dtFormat = new Intl.DateTimeFormat("de-DE", options);

    return dtFormat.format(new Date(unixTimestamp * 1000));
}

function formatDateTime (unixTimestamp) {

    const options = {day: "numeric", month: "long", hour: "numeric", minute: "numeric"};
    
    const dtFormat = new Intl.DateTimeFormat("de-DE", options);

    return dtFormat.format(new Date(unixTimestamp * 1000));
}

function showWeather(json) {
    
    var data = JSON.parse(json);

    document.getElementById("mainDescription").innerHTML = data.current.weather[0].description;
    document.getElementById("mainIcon").innerHTML = data.current.weather[0].icon;
    document.getElementById("mainTemperatur").innerHTML = data.current.temp;
    document.getElementById("mainFeelsLikeTempertatur").innerHTML = data.current.feels_like;
    document.getElementById("mainTemperaturMin").innerHTML = data.daily[0].temp.min;
    document.getElementById("mainTemperaturMax").innerHTML = data.daily[0].temp.max;
    document.getElementById("mainPressure").innerHTML = data.current.pressure;
    document.getElementById("mainHumidity").innerHTML = data.current.humidity;
    document.getElementById("mainVisibility").innerHTML = data.current.visibility;
    document.getElementById("mainWindSpeed").innerHTML = data.current.wind_speed;
    document.getElementById("mainWindDeg").innerHTML = data.current.wind_deg;
    document.getElementById("mainWindGust").innerHTML = data.current.wind_gust;
    document.getElementById("mainClouds").innerHTML = data.current.clouds;
    document.getElementById("mainTime").innerHTML = formatDateTime(data.current.dt);
    document.getElementById("mainSunrise").innerHTML = formatTime(data.current.sunrise);
    document.getElementById("mainSunset").innerHTML = formatTime(data.current.sunset);
    document.getElementById("mainRain").innerHTML = data.daily[0].rain;
    document.getElementById("mainSnow").innerHTML = data.daily[0].snow;
    document.getElementById("mainUVI").innerHTML = data.daily[0].uvi;
}

function showWeatherPreview(json) {

    var data = JSON.parse(json);

    var previewDays = 7;
    var j = 0;

    for (let i = 0; i < previewDays; i++) {

        j = i + 1;

        document.getElementsByClassName("previewDate")[i].innerHTML = formatDate(data.daily[j].dt);
        document.getElementsByClassName("previewText")[i].innerHTML = data.daily[j].weather[0].description;
        document.getElementsByClassName("previewMax")[i].innerHTML = Math.round(data.daily[j].temp.max * 10) / 10 + " °C";
        document.getElementsByClassName("previewMin")[i].innerHTML = Math.round(data.daily[j].temp.min * 10) / 10 + " °C";
    }   
}

function showWeatherPanel(json) {

    var data = JSON.parse(json);

    var previewDays = 7;
    var j = 0;

    for (let i = 0; i < previewDays; i++) {

        j = i + 1;

        document.getElementsByClassName("panelParagraphDataWind")[i].innerHTML = Math.round((data.daily[j].wind_speed * 3.6) * 10) / 10  + " km/h";
        document.getElementsByClassName("panelParagraphDataHumidity")[i].innerHTML = data.daily[j].humidity + " %";
        document.getElementsByClassName("panelParagraphDataUVI")[i].innerHTML = data.daily[j].uvi;
        document.getElementsByClassName("panelParagraphDataCloud")[i].innerHTML = data.daily[j].clouds + " %";

        if (data.daily[j].rain == undefined) {
            document.getElementsByClassName("panelPreviewLeft")[i].getElementsByClassName("panelParagraph")[4].style.display = "none";
            document.getElementsByClassName("panelParagraphDataRain")[i].style.display = "none";
        }
        else {
            document.getElementsByClassName("panelParagraphDataRain")[i].innerHTML = data.daily[j].rain + " l/m²";
            document.getElementsByClassName("panelPreviewLeft")[i].getElementsByClassName("panelParagraph")[4].style.display = "block";
            document.getElementsByClassName("panelParagraphDataRain")[i].style.display = "block";
        }
        
        if (data.daily[j].snow == undefined) {
            document.getElementsByClassName("panelPreviewLeft")[i].getElementsByClassName("panelParagraph")[5].style.display = "none";
            document.getElementsByClassName("panelParagraphDataSnow")[i].style.display = "none";
        }
        else {
            document.getElementsByClassName("panelParagraphDataSnow")[i].innerHTML = data.daily[j].snow + " mm";
            document.getElementsByClassName("panelPreviewLeft")[i].getElementsByClassName("panelParagraph")[5].style.display = "block";
            document.getElementsByClassName("panelParagraphDataSnow")[i].style.display = "block";
        }

        document.getElementsByClassName("panelParagraphDataSunrise")[i].innerHTML = formatTime(data.daily[j].sunrise);
        document.getElementsByClassName("panelParagraphDataSunset")[i].innerHTML = formatTime(data.daily[j].sunset); 
    }
}