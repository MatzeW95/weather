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

function windDegrees(degrees) {

    var result = "";
    
    if(degrees == 0 || degrees > 337.5 && degrees <= 360) {
        result = "Nord";
    }
    else if(degrees <= 22.5) {
        result = "Nordnordost";
    }
    else if(degrees <= 45) {
        result = "Nordost";
    }
    else if(degrees <= 67.5) {
        result = "Ostnordost";
    }
    else if(degrees <= 90) {
        result = "Ost";
    }
    else if(degrees <= 112.5) {
        result = "Ostsüdost";
    }
    else if(degrees <= 135) {
        result = "Südost";
    }
    else if(degrees <= 157.5) {
        result = "Südsüdost";
    }
    else if(degrees <= 180) {
        result = "Süd";
    }
    else if(degrees <= 202.5) {
        result = "Südsüdwest";
    }
    else if(degrees <= 225) {
        result = "Südwest";
    }
    else if(degrees <= 247.5) {
        result = "Westsüdwest";
    }
    else if(degrees <= 270) {
        result = "West";
    }
    else if(degrees <= 292.5) {
        result = "Westnordwest";
    }
    else if(degrees <= 315) {
        result = "Nordwest";
    }
    else if(degrees <= 337.5) {
        result = "Nordnordwest";
    }

    return result;
}

function showWeather(json) {
    
    var data = JSON.parse(json);

    document.getElementById("mainTime").innerHTML = formatDateTime(data.current.dt);
    
    document.getElementById("mainTemperaturMax").innerHTML = data.daily[0].temp.max + " °C";
    document.getElementById("mainTemperaturMin").innerHTML = data.daily[0].temp.min + " °C";
    
    document.getElementById("mainTemperatur").innerHTML = data.current.temp;
    document.getElementById("mainFeelsLikeTempertatur").innerHTML = "Gefühlte Temperatur: " + data.current.feels_like + " °C";

    document.getElementById("mainIcon").innerHTML = data.current.weather[0].icon;
    document.getElementById("mainDescription").innerHTML = data.current.weather[0].description;

    document.getElementById("mainWindSpeed").innerHTML = Math.round((data.current.wind_speed * 3.6) * 10) / 10  + " km/h";
    document.getElementById("mainWindDeg").innerHTML = windDegrees(data.current.wind_deg);

    if (data.current.wind_gust == undefined) {
        document.getElementById("mainWindGust").style.display = "none";
        document.getElementsByClassName("weatherInfo")[2].style.display = "none";
    }
    else {
        document.getElementById("mainWindGust").innerHTML = Math.round((data.current.wind_gust * 3.6) * 10) / 10  + " km/h";
        document.getElementById("mainWindGust").style.display = "block"; 
        document.getElementsByClassName("weatherInfo")[2].style.display = "block";
    }

    document.getElementById("mainClouds").innerHTML = data.current.clouds + " %";
    document.getElementById("mainSunrise").innerHTML = formatTime(data.current.sunrise);
    document.getElementById("mainSunset").innerHTML = formatTime(data.current.sunset);
    
    if (data.daily[0].rain == undefined) {
        document.getElementById("mainRain").style.display = "none";
        document.getElementsByClassName("weatherInfo")[6].style.display = "none";
    }
    else {
        document.getElementById("mainRain").innerHTML = data.daily[0].rain + " l/m²";
        document.getElementById("mainRain").style.display = "block"; 
        document.getElementsByClassName("weatherInfo")[6].style.display = "block";
    }

    if (data.daily[0].snow == undefined) {
        document.getElementById("mainSnow").style.display = "none";
        document.getElementsByClassName("weatherInfo")[7].style.display = "none";
    }
    else {
        document.getElementById("mainSnow").innerHTML = data.daily[0].snow + " mm";
        document.getElementById("mainSnow").style.display = "block"; 
        document.getElementsByClassName("weatherInfo")[7].style.display = "block";
    }
    
    document.getElementById("mainUVI").innerHTML = data.daily[0].uvi;
    document.getElementById("mainVisibility").innerHTML = data.current.visibility / 1000 + " km";
    document.getElementById("mainHumidity").innerHTML = data.current.humidity  + " %";
    document.getElementById("mainPressure").innerHTML = data.current.pressure + " hPa"; 
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