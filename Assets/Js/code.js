/**
 * pulls information from the form and build the query URL
 * @returns {string} URL forWeather API base  ad on form inputs
 */

//Global Scope
// This is our API key
var APIKey = "243229173542e326e8a4bb8eaf9bb745";
var search= JSON.parse(localStorage.getItem("History")) || []
var city = "<h1>Previous Search</h1>"
for(let i =0;i < search.length;i++){
    
  console.log(city)
  city += `<p>${search[i]}</p>`
}
console.log("After for",search)
$("#searchHistory").html(city)

function buildQueryURL(userSearch) {
  // queryURL is the url we'll use to query the API
  //var queryURL = "https://api.nytimes.com/svc/search/v2/WeatherRecordsearch.json?";
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?";

  console.log(userSearch);

  var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${userSearch}&appid=${APIKey}&units=imperial`;




  // Logging the URL so we have access to it for troubleshooting
  console.log("---------------\nURL: " + queryURL + "\n---------------");
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (apiResults) {
    console.log(apiResults)
    var lat = apiResults.coord.lat
    var lon = apiResults.coord.lon
    $("#currentweather").html(`
  <div class="card b-primary">
  <h1>${userSearch}</h1>
  <h6>Temp: ${apiResults.main.temp}</h6>
  <h5>Humidity: ${apiResults.main.humidity}</h6>
  <p>Wind Speed: ${apiResults.wind.speed}</p>
  <p>Description: ${apiResults.weather[0].description}</p>
  <img src="https://openweathermap.org/img/wn/${apiResults.weather[0].icon}@2x.png" />
  </div>
  `)
    search.push(userSearch)
    localStorage.setItem("History",JSON.stringify(search))
  })
}

/**
 * takes API data (JSON/object) and turns it into elements on the page
 * @param {object} WeatherData - object containing Weather API data
 */
function update5day(userSearch) {
  // Get from the form the number of results to display
  // API doesn't have a "limit" parameter, so we have to do this ourselves
  var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${userSearch}&appid=${APIKey}&units=imperial`;
  // Logging the URL so we have access to it for troubleshooting
  console.log("---------------\nURL: " + queryURL + "\n---------------");
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (apiResults) {
    console.log(apiResults)
    var numWeatherRecords = apiResults.list
    var forecast = ""


    // console.log("------------------------------------");

    // Loop through and build elements for the defined number of WeatherRecords
    for (var i = 0; i < numWeatherRecords.length; i = i+8) {
    forecast += `
      <div class="card b-primary">
      <h6>${numWeatherRecords[i].dt_txt}}</h1>
      <h6>Temp: ${numWeatherRecords[i].main.temp}</h6>
      <h5>Humidity: ${numWeatherRecords[i].main.humidity}</h6>
      <p>Wind Speed: ${numWeatherRecords[i].wind.speed}</p>
      <p>Description: ${numWeatherRecords[i].weather[0].description}</p>
      <img src="https://openweathermap.org/img/wn/${numWeatherRecords[i].weather[0].icon}@2x.png" />
      </div>
      `
    }
    // ;

      // Add the newly created element to the DOM
      $("#weatherRecord-section").append(forecast);




  })
}
  // Function to empty out the WeatherRecords
  function clear() {
    $("#WeatherRecord-section").empty();
  }

  // CLICK HANDLERS
  // ==========================================================

  // .on("click") function associated with the Search Button
  $("#run-search").on("click", function (event) {
    // This line allows us to take advantage of the HTML "submit" property
    // This way we can hit enter on the keyboard and it registers the search
    // (in addition to clicks). Prevents the page from reloading on form submit.
    event.preventDefault();

    // Empty the region associated with the WeatherRecords
    clear();
    var userSearch = $("#search-term").val().trim();
    // Build the query URL for the ajax request to the Weather API
    buildQueryURL(userSearch);
    update5day(userSearch)
    // Make the AJAX request to the API - GETs the JSON data at the queryURL.
    // The data then gets passed as an argument to the updatePage function

  });

  //  .on("click") function associated with the clear button
  $("#clear-all").on("click", clear);
