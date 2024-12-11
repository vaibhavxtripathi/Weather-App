const cityName = document.querySelector("input")
const searchBtn = document.querySelector(".search-button")
const apiKey = "1c217b554320ce241d0cc2c7b8daaf41"
const notFoundSection = document.querySelector(".not-found-section")
const weatherSection = document.querySelector(".weather-section")
const searchSection = document.querySelector(".search-city")
//element selection
const locationName = document.querySelector(".location-name")
const currentDate = document.querySelector(".current-date")
const temperature = document.querySelector(".temperature")
const weatherCondition = document.querySelector(".weather-condition")
const humidityValue = document.querySelector(".humidity-value")
const windValue = document.querySelector(".wind-value")
const weatherIcon = document.querySelector(".weather-summary img")
const forecastContainer = document.querySelector(".forecast-container")
const background = document.querySelector("body")

searchBtn.addEventListener("click", () => {
    if (cityName.value.trim() != '') {
        updateWeatherInfo(cityName.value)
    }
    cityName.value = ''
    cityName.blur()
    //.trim() = koi spaces bhi aa jayein agar texts ke bahar "   City  ", so it will display: "City"
    //.blur() = opposite of :focus in css, i.e removes the focus from the element
})
cityName.addEventListener("keydown", (event) => {
    if (event.key === 'Enter' && cityName.value.trim() != '') {
        updateWeatherInfo(cityName.value)
        cityName.value = ''
        cityName.blur()
        //added inside 'if' condition because as we were jotting any key stroke, wo blur kar raha tha focus turant
    }
})
function getWeatherIcon(id) {
    if (id <= 232) return 'thunderstorm'
    if (id <= 321) return 'drizzle'
    if (id <= 531) return 'rain'
    if (id <= 622) return 'snow'
    if (id <= 781) return 'atmosphere'
    if (id <= 800) return 'clear'
    else return 'clouds'
}
function getBackgroundImage(id) {
    if (id <= 232) return 'thunderstorm-bg'
    if (id <= 321) return 'drizzle-bg'
    if (id <= 531) return 'drizzle-bg'
    if (id <= 622) return 'snow-bg'
    else return 'bg'
}
function getCurrentDate() {
    const todayDate = new Date();
    const option = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }
    return todayDate.toLocaleDateString('en-GB', option)
}
async function getFetchData(endPoint, city) {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`)
    let data = await response.json()
    return data
}
async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city)
    if (weatherData.cod != 200) {
        updateSection(notFoundSection)
        return
    }
    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id, main }],
        wind: { speed }
    } = weatherData

    currentDate.textContent = getCurrentDate();
    locationName.textContent = country;
    temperature.textContent = Math.floor(temp) + "°C";
    weatherCondition.textContent = main;
    humidityValue.textContent = humidity + "%";
    windValue.textContent = speed + "M/s";
    weatherIcon.src = `assets/weather/${getWeatherIcon(id)}.svg`
    background.style.backgroundImage = `url(./assets/${getBackgroundImage(id)}.jpg`

    await updateForecastInfo(city)
    updateSection(weatherSection)
    console.log(weatherData);
    
}
async function updateForecastInfo(city) {
    const forecastData = await getFetchData('forecast', city);
    const timeTaken = '12:00:00';
    const todayDate = new Date().toISOString().split('T')[0]
    forecastContainer.innerHTML = ''
    forecastData.list.forEach(forecastWeather => {
        if (forecastWeather.dt_txt.includes(timeTaken)) {
            updateForecastItems(forecastWeather)
        }
    })
}
function updateForecastItems(weatherData) {
    const {
        dt_txt: date,
        weather: [{ id }],
        main: { temp }
    } = weatherData
    const dateTaken = new Date(date);
    const dateOption = {
        day: '2-digit',
        month: 'short'
    }
    const dateResult = dateTaken.toLocaleDateString('en-GB', dateOption)

    const forecastItem = `
                <div class="forecast-item">
                    <h5 class="forecast-date regular-txt">
                        ${dateResult}
                    </h5>
                    <img src="assets/weather/${getWeatherIcon(id)}.svg">
                    <h5 class="forecast-temp regular-txt">${Math.round(temp)}°C</h5>
                </div>
    `
    forecastContainer.insertAdjacentHTML('beforeend', forecastItem)
}
function updateSection(section) {
    [weatherSection, notFoundSection, searchSection]
        .forEach(section => section.style.display = 'none')
    section.style.display = 'flex'

}

