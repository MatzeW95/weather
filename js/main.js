const formCountryZip = document.getElementById("formCountryZip");

formCountryZip.addEventListener("submit", function (e) {
    e.preventDefault();

    var zip = document.getElementById("inputZipCode"),
    inputZipCodeValue = zip.value;

    var country = document.getElementById("selectCountry"),
    selectCountryValue = country.value;

    var url = "http://api.openweathermap.org/geo/1.0/zip?zip=" + inputZipCodeValue + "," + selectCountryValue + "&appid=ecbf905015707902c8d1532d644a4ea6"

    fetch(url, {
        method: "get"
    }).then(function (response) {
        return response.text();
    }).then(function (text) {

        var data = JSON.parse(text);
        zipCountryToWeatherData(data.lat, data.lon);

    }).catch(function (error) {
        console.error(error);
    })
});

function zipCountryToWeatherData(lat, lon) {

    url = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=metric&lang=de&appid=ecbf905015707902c8d1532d644a4ea6";

    fetch(url, {
        method: "get"
    }).then(function (response) {
        return response.text();
    }).then(function (text) {
        console.log(text);
    }).catch(function (error) {
        console.error(error);
    }) 
}