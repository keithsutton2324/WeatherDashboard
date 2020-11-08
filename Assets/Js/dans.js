/*
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
WHEN I open the weather dashboard
THEN I am presented with the last searched city forecast
*/

//display date and weather icon next to name in current weather
//uv index color coding
//display date and weather icon in 5 day 

var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q="
var oneCall = "https://api.openweathermap.org/data/2.5/onecall?"
var key = "&appid=567045e16bb34f6e03d7d4dc194e6660"
var cityName = ""
var lat
var lng 
var savedCities = []
var lastCity = ""
var iconURL = "http://openweathermap.org/img/w/"
var iconCode = ""
var iconSpec = ".png"


//get date

var today = new Date();

var date = (today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear();
console.log(date)


//call to get lat & lng, print city name
function weatherData() {
    $.ajax({
        url: weatherURL + cityName + key,
        method: "GET"
    }).then(function(response) {
        $('.city').html(response.name)
        $('.date').html(date)
        //change value of lat & lng
        lat = response.coord.lat
        lng = response.coord.lon
        var coords = "lat=" + lat + "&lon=" + lng 
        //call to get weather data and print
        $.ajax({
            url: oneCall + coords + key,
            method: "GET"
        }).then(function(response) {
            var tempF = (response.current.temp - 273.15) * 1.80 + 32;
            $('.temp').html("Temperature: " +  Math.round(tempF) + "°F")
            $('.humidity').html("Humidity: " +  response.current.humidity + "%")
            $('.windSpeed').html("Wind Speed: " +  response.current.wind_speed + " MPH")
            $('.uvIndex').html("UV Index: " + response.current.uvi)

            //what color is the uvIndex?
            
            if (response.current.uvi < 3) {
                $('.uvIndex').css("border-color", "chartreuse")
            } else if (response.current.uvi < 6) {
                $('.uvIndex').css("border-color", "yellow")
            } else if (response.current.uvi < 8) {
                $('.uvIndex').css("border-color", "orange")
            } else if (response.current.uvi < 11) {
                $('.uvIndex').css("border-color", "red")
            } else {
                $('.uvIndex').css("border-color", "purple")
            }
            
            iconCode = response.current.weather[0].icon
            console.log(iconCode)
            $('#weatherIcon').attr('src', iconURL + iconCode + iconSpec)
            

            //emptys five day forcast div
            $('.fiveDay').empty()
            //creates dayCards and prints weather data
            for(var i = 0; i < 5; i++) {
                var iconCode = response.daily[i].weather[0].icon
                var dayTemp = (response.daily[i].temp.day - 273.15) * 1.80 + 32;
                var dayCard = $('<div class="dayCard"></div>')
                var fiveDay = $(".fiveDay")
                var fiveDayIcon = iconURL + iconCode + iconSpec
                var theDay = (today.getDate() + 1)
                var nextDay = parseInt(theDay) + parseInt([i])
                console.log(nextDay)

                var newDate = (today.getMonth()+1)+'/'+ nextDay +'/'+today.getFullYear()

                dayCard.html(
                    newDate +
                    '<img class="fiveDayIcon" src=' + '"' + fiveDayIcon + '"' + '>' +
                    "Temperature: " + Math.round(dayTemp) + "°F" + "<br>" + 
                    "Humidity: " + response.daily[i].humidity + "%"  
                )
            
        
                fiveDay.append(dayCard)
            }
            
        })
    })
}




//saves to local storage 
function savecity() {
    var str = JSON.stringify(savedCities)
    localStorage.setItem("cities", str)
    localStorage.setItem("last city", lastCity)
}
//get citys from local storage 
function getCities() {
    var str = localStorage.getItem('cities')
    savedCities = JSON.parse(str)
    lastCity = localStorage.getItem("last city")
    if (!savedCities) {
        savedCities = []
    }
}
//prints saved citys to screen
function printSavedCites(){
    for(var i = 0; i < savedCities.length; i++) {
       cityName = savedCities[i]
       creatBtn()
    }
}
function creatBtn(){
var cityBtn = $('<button type="click" class="cityBtn"></button>')
    cityBtn.text(cityName)
    $('aside').append(cityBtn)
    //when user clicks city from history...
    $('.cityBtn').on('click', function(){
        console.log("HERE1", this.textContent)
        cityName = this.textContent
        weatherData()
        lastCity = cityName
        savecity()
        console.log(lastCity)
    })
}
//when page loads...
window.onload = function() {
    getCities()
    if(lastCity === ""){
    cityName = lastCity
    console.log(cityName)
    } else {
        cityName = lastCity
        console.log(cityName)
    }
    weatherData()
    printSavedCites()
}

//if search button is clicked the lastCity = input val
//if citybtn is clicked lastCity = citybtn this textcontent


//when user enters a city...
$('form').on('submit', function(e){
    e.preventDefault()
    cityName = $('input').val().trim()
    lastCity = cityName
    console.log(lastCity)
    savedCities.push(cityName)
    console.log(savedCities)
    savecity()
    creatBtn()
    weatherData()
    
    


})



    
    

© 2020 GitHub, Inc.
Terms
Privacy
Security
Status
Help
Contact GitHub
Pricing
API
Training
Blog
About
