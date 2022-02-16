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

function showWeather() {

}

function showWeatherPreview(json) {

    var data = JSON.parse(json);

    document.getElementsByClassName("previewDate")[0].innerHTML = formatDate(data.daily[0].dt);
    document.getElementsByClassName("previewText")[0].innerHTML = data.daily[0].weather[0].description;
    document.getElementsByClassName("previewMax")[0].innerHTML = data.daily[0].temp.max;
    document.getElementsByClassName("previewMin")[0].innerHTML = data.daily[0].temp.min;
}

function showWeatherPanel(json) {

    var data = JSON.parse(json);

    document.getElementsByClassName("panelParagraphDataWind")[0].innerHTML = data.daily[0].wind_speed;
    document.getElementsByClassName("panelParagraphDataHumidity")[0].innerHTML = data.daily[0].humidity;
    document.getElementsByClassName("panelParagraphDataUVI")[0].innerHTML = data.daily[0].uvi;
    document.getElementsByClassName("panelParagraphDataCloud")[0].innerHTML = data.daily[0].clouds;
    document.getElementsByClassName("panelParagraphDataRain")[0].innerHTML = data.daily[0].rain;
    document.getElementsByClassName("panelParagraphDataSnow")[0].innerHTML = data.daily[0].snow;
    document.getElementsByClassName("panelParagraphDataSunrise")[0].innerHTML = formatTime(data.daily[0].sunrise);
    document.getElementsByClassName("panelParagraphDataSunset")[0].innerHTML = formatTime(data.daily[0].sunset);
}