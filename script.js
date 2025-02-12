const apiKey = "6124d895ac484764bae3e66622ec5915"; 

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherInfo = document.getElementById("weatherInfo");
const errorMessage = document.getElementById("errorMessage");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const description = document.getElementById("description");
const weatherIcon = document.getElementById("weatherIcon");
const toggleUnitBtn = document.getElementById("toggleUnit");
const unit = document.getElementById("unit");
const currentLocationBtn = document.getElementById("currentLocationBtn");

let isCelsius = true;

// 🔍 Search City Weather
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city === "") {
        showError("Please enter a city name.");
        return;
    }
    fetchWeather(city);
});

// 📍 Fetch Weather for Current Location
currentLocationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
            },
            () => showError("Location access denied. Please enter a city.")
        );
    } else {
        showError("Geolocation is not supported by this browser.");
    }
});

// 🌦️ Fetch Weather Data
const fetchWeather = async (city) => {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();
        
        console.log("Weather API Response:", data); // Debugging

        if (data.cod === "404") {
            showError("City not found. Please try again.");
            return;
        }

        displayWeather(data);
    } catch (error) {
        console.error("Weather API Fetch Error:", error);
        showError("Error fetching data. Please try again later.");
    }
};

// 🌍 Fetch Weather by Coordinates
const fetchWeatherByCoords = async (lat, lon) => {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();
        console.log("Weather API Response:", data); // Debugging
        displayWeather(data);
    } catch (error) {
        showError("Error fetching data.");
    }
};

// 📌 Display Weather Data
const displayWeather = (data) => {
    cityName.textContent = data.name;
    temperature.textContent = data.main.temp.toFixed(1);
    humidity.textContent = data.main.humidity;
    windSpeed.textContent = data.wind.speed.toFixed(1);
    description.textContent = data.weather[0].description;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    weatherInfo.classList.remove("hidden");
    errorMessage.classList.add("hidden");
};

// 🔁 Temperature Conversion Button (Fix)
toggleUnitBtn.addEventListener("click", () => {
    let temp = parseFloat(temperature.textContent);
    if (isCelsius) {
        temp = (temp * 9/5) + 32;
        unit.textContent = "F";
        toggleUnitBtn.textContent = "Convert to °C";
    } else {
        temp = (temp - 32) * 5/9;
        unit.textContent = "C";
        toggleUnitBtn.textContent = "Convert to °F";
    }
    temperature.textContent = temp.toFixed(1);
    isCelsius = !isCelsius;
});

// 🚨 Show Error Message
const showError = (message) => {
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
    weatherInfo.classList.add("hidden");
};
