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
        zipCountryToWeatherDataPreview(data.lat, data.lon);
    }).catch(function (error) {
        console.error(error);
    });
});

function zipCountryToWeatherData(lat, lon) {

    var url = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=metric&lang=de&appid=" + key;

    fetch(url, {
        method: "get"
    }).then(function (response) {
        return response.text();
    }).then(function (text) {
        showWeather(text);
    }).catch(function (error) {
        console.error(error);
    });
}

function zipCountryToWeatherDataPreview(lat, lon) {

    var url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&units=metric&lang=de&appid=" + key;

    fetch(url, {
        method: "get"
    }).then(function (response) {
        return response.text();
    }).then(function (text) {
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

function showWeather(json) {
    
    var data = JSON.parse(json);
}

function showWeatherPreview(json) {

    var data = JSON.parse(json);

    var previewDays = 7;

    for (let i = 0; i < previewDays; i++) {
        document.getElementsByClassName("previewDate")[i].innerHTML = formatDate(data.daily[i].dt);
        document.getElementsByClassName("previewText")[i].innerHTML = data.daily[i].weather[0].description;
        document.getElementsByClassName("previewMax")[i].innerHTML = data.daily[i].temp.max;
        document.getElementsByClassName("previewMin")[i].innerHTML = data.daily[i].temp.min;
    }

    
}

function showWeatherPanel(json) {

    var data = JSON.parse(json);

    var previewDays = 7;

    for (let i = 0; i < previewDays; i++) {
        document.getElementsByClassName("panelParagraphDataWind")[i].innerHTML = data.daily[i].wind_speed;
        document.getElementsByClassName("panelParagraphDataHumidity")[i].innerHTML = data.daily[i].humidity;
        document.getElementsByClassName("panelParagraphDataUVI")[i].innerHTML = data.daily[i].uvi;
        document.getElementsByClassName("panelParagraphDataCloud")[i].innerHTML = data.daily[i].clouds;

        if (data.daily[i].rain == undefined) {
            document.getElementsByClassName("panelPreviewLeft")[i].getElementsByClassName("panelParagraph")[4].style.display = "none";
            document.getElementsByClassName("panelParagraphDataRain")[i].style.display = "none";
        }
        else {
            document.getElementsByClassName("panelParagraphDataRain")[i].innerHTML = data.daily[i].rain;
            document.getElementsByClassName("panelPreviewLeft")[i].getElementsByClassName("panelParagraph")[4].style.display = "block";
            document.getElementsByClassName("panelParagraphDataRain")[i].style.display = "block";
        }
        
        if (data.daily[i].snow == undefined) {
            document.getElementsByClassName("panelPreviewLeft")[i].getElementsByClassName("panelParagraph")[5].style.display = "none";
            document.getElementsByClassName("panelParagraphDataSnow")[i].style.display = "none";
        }
        else {
            document.getElementsByClassName("panelParagraphDataSnow")[i].innerHTML = data.daily[i].snow;
            document.getElementsByClassName("panelPreviewLeft")[i].getElementsByClassName("panelParagraph")[5].style.display = "block";
            document.getElementsByClassName("panelParagraphDataSnow")[i].style.display = "block";
        }

        document.getElementsByClassName("panelParagraphDataSunrise")[i].innerHTML = formatTime(data.daily[i].sunrise);
        document.getElementsByClassName("panelParagraphDataSunset")[i].innerHTML = formatTime(data.daily[i].sunset); 
    }
}