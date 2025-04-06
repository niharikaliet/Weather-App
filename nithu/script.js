const kelvin = 273.15;
const apiKey = "6d055e39ee237af35ca066f35474e9df";

// DOM Elements
const tempC = document.querySelector(".temp");
const tempF = document.querySelector(".temp-f");
const summary = document.querySelector(".summary");
const summaryF = document.querySelector(".summary-f");
const loc = document.querySelector(".location");
const locF = document.querySelector(".location-f");
const icon = document.querySelector(".icon");
const iconF = document.querySelector(".icon-f");
const cityInput = document.getElementById("cityInput");
const cityDropdown = document.getElementById("cityDropdown");
const historyDropdown = document.getElementById("historyDropdown");
const darkToggle = document.getElementById("darkModeToggle");

function getWeather(cityName) {
    const city = cityName || cityInput.value.trim();
    if (!city) {
        alert("Please enter or select a city");
        return;
    }

    const base = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    fetch(base)
        .then(response => {
            if (!response.ok) throw new Error("City not found");
            return response.json();
        })
        .then(data => {
            const celsius = Math.floor(data.main.temp - kelvin);
            const fahrenheit = Math.floor((data.main.temp - kelvin) * 9 / 5 + 32);
            const description = data.weather[0].description;
            const place = `${data.name}, ${data.sys.country}`;
            const iconCode = data.weather[0].icon;

            // Celsius card
            tempC.textContent = `${celsius}°C`;
            summary.textContent = description;
            loc.textContent = place;
            icon.innerHTML = `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="weather icon">`;

            // Fahrenheit card
            tempF.textContent = `${fahrenheit}°F`;
            summaryF.textContent = description;
            locF.textContent = place;
            iconF.innerHTML = `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="weather icon">`;

            saveToHistory(city);
            localStorage.setItem("lastCity", city);
        })
        .catch(err => {
            alert("Error: " + err.message);
        });
}

function saveToHistory(city) {
    let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem("searchHistory", JSON.stringify(history));
        updateHistoryDropdown();
    }
}

function updateHistoryDropdown() {
    const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    historyDropdown.innerHTML = '<option value="">-- Search History --</option>';
    history.forEach(city => {
        const opt = document.createElement("option");
        opt.value = city;
        opt.textContent = city;
        historyDropdown.appendChild(opt);
    });
}

function clearHistory() {
    localStorage.removeItem("searchHistory");
    updateHistoryDropdown();
    alert("Search history cleared!");
}

function selectCity(select) {
    const city = select.value;
    cityInput.value = city;
    getWeather(city);
}

function selectHistory(select) {
    const city = select.value;
    cityInput.value = city;
    getWeather(city);
}

// Toggle dark mode
function toggleDarkMode(checkbox) {
    document.body.classList.toggle("dark", checkbox.checked);
    localStorage.setItem("darkMode", checkbox.checked ? "enabled" : "disabled");
}

// Apply on load
window.addEventListener("load", () => {
    updateHistoryDropdown();
    const lastCity = localStorage.getItem("lastCity");
    if (lastCity) {
        cityInput.value = lastCity;
        getWeather(lastCity);
    }

    const darkMode = localStorage.getItem("darkMode");
    if (darkMode === "enabled") {
        document.body.classList.add("dark");
        darkToggle.checked = true;
    }
});
