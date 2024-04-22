const cityInput = $('#city-input');
const cityForm = $('#city-form');
const cityHistory = $('#city-history');
const currentDisplay = $('#weather-current');
const fDisplay = $('#weather-forecast');

function handleFormSubmit(event){
    event.preventDefault();
    const cityName = cityInput.val().trim();
    if(cityName === ""){
        return;
    }
    cityInput.val("");
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=26e6654053a3f70f24251088f54026d0`
    fetch(url).then(function (response){
        if(response.ok){
            response.json().then(function (data){
                const city = {
                    name: cityName,
                    lat: data[0].lat,
                    lon: data[0].lon,
                };
                saveCities(city);
                displayCities();
                displayWeather(city.lat, city.lon);
                displayForecast(city.lat, city.lon);
                
            });
        }
    });
}

function getCities(){
    const storedCities = JSON.parse(localStorage.getItem('cities'));
    if(storedCities !== null){
        return storedCities;
    }else{
        const emptyCity = [];
        return emptyCity;
    }
}

function saveCities(cities){
    const tempCities = getCities();
    tempCities.push(cities);
    localStorage.setItem('cities', JSON.stringify(tempCities));
}

function displayCities(){
    cityHistory.empty();
    const tempCities = getCities();
    tempCities.forEach((city, i) => {
        const cityCard = $('<div>');
        cityCard.attr('class', 'city-card bg-secondary text-white text-center border border-light rounded');
        cityCard.attr('data-id', i);
        cityCard.text(city.name);
        cityHistory.append(cityCard);
    });
}

function displayWeather(lat, lon){
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=26e6654053a3f70f24251088f54026d0&units=imperial`
    fetch(url).then(function (response){
        if(response.ok){
            response.json().then(function (data){
                currentDisplay.empty();
                const weatherCard = $('<div>');
                const cityName = $('<h2>');
                const curDate = dayjs().format("M/DD/YYYY");
                const weatherIcon = $('<img>');
                weatherIcon.attr('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
                cityName.text(data.name + " (" + curDate + ")");
                cityName.append(weatherIcon);
                const curTemp = $('<p>');
                curTemp.text("Temp: " + data.main.temp + " °F")
                const curWind = $('<p>');
                curWind.text("Wind: " + data.wind.speed + " MPH");
                const curHumidity = $('<p>');
                curHumidity.text("Humidity: " + data.main.humidity + " %");

                weatherCard.append(cityName, curTemp, curWind, curHumidity);
                currentDisplay.append(weatherCard);
            });
        }
    });
}

function displayForecast(lat, lon){
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=26e6654053a3f70f24251088f54026d0&units=imperial`
    fetch(url).then(function (response){
        if(response.ok){
            response.json().then(function (data){
                let dayOffset = 0;
                fDisplay.empty();
                for(i = 0; i < 5; i++){
                    const fCard = $('<div>');
                    fCard.attr('class', 'col-2 bg-secondary text-white text-center border border-light rounded');
                    const fDate = $('<p>');
                    fDate.text(dayjs().add(i + 1, 'day').format("M/DD/YYYY"));
                    const wIcon = $('<img>');
                    wIcon.attr('src', `https://openweathermap.org/img/wn/${data.list[dayOffset].weather[0].icon}@2x.png`);
                    const fTemp = $('<p>');
                    fTemp.text("Temp: " + data.list[dayOffset].main.temp + " °F")
                    const fWind = $('<p>');
                    fWind.text("Wind: " + data.list[dayOffset].wind.speed + " MPH");
                    const fHumidity = $('<p>');
                    fHumidity.text("Humidity: " + data.list[dayOffset].main.humidity + " %");
                    dayOffset = dayOffset + 8;
                    fCard.append(fDate, wIcon, fTemp, fWind, fHumidity);
                    fDisplay.append(fCard);
                }
            });
        }
    });
}

cityForm.on('submit', handleFormSubmit);
cityHistory.on('click', '.city-card', function(){
    cityID = $(this).attr('data-id');
    savedCities = getCities();
    currentDisplay.empty();
    fDisplay.empty();
    displayWeather(savedCities[cityID].lat, savedCities[cityID].lon);
    displayForecast(savedCities[cityID].lat, savedCities[cityID].lon);
});

window.onload = displayCities;