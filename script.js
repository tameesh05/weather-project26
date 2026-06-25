const API_KEY = "13288afe9c755d0167887dc57d93ac00";
 
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
 
// DOM References
const cityInput   = document.getElementById("cityInput");
const searchBtn   = document.getElementById("searchBtn");
const weatherCard = document.getElementById("weatherCard");
const errorMsg    = document.getElementById("errorMsg");
const loader      = document.getElementById("loader");
 
// Weather display elements
const cityNameEl   = document.getElementById("cityName");
const countryDate  = document.getElementById("countryDate");
const weatherIcon  = document.getElementById("weatherIcon");
const temperatureEl= document.getElementById("temperature");
const descriptionEl= document.getElementById("description");
const feelsLikeEl  = document.getElementById("feelsLike");
const humidityEl   = document.getElementById("humidity");
const windSpeedEl  = document.getElementById("windSpeed");
const visibilityEl = document.getElementById("visibility");
const pressureEl   = document.getElementById("pressure");
const cloudinessEl = document.getElementById("cloudiness");
 
// ── Event Listeners ──────────────────────────────────────────
searchBtn.addEventListener("click", handleSearch);
 
cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSearch();
});
 
// ── Main Flow ─────────────────────────────────────────────────
function handleSearch() {
  const city = cityInput.value.trim();
  if (!city) return;
  fetchWeather(city);
}
 
async function fetchWeather(city) {
  // Show loader, hide previous results
  showLoader();
 
  const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
 
  try {
    const response = await fetch(url);
 
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
 
    const data = await response.json();
    displayWeather(data);
 
  } catch (error) {
    showError();
    console.error("Weather fetch failed:", error);
  }
}
 
// ── Display Data ──────────────────────────────────────────────
function displayWeather(data) {
  hideAll();
 
  // City & Country
  cityNameEl.textContent = `${data.name}, ${data.sys.country}`;
 
  // Current date
  const now = new Date();
  countryDate.textContent = now.toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });
 
  // Icon
  const iconCode = data.weather[0].icon;
  weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  weatherIcon.alt = data.weather[0].description;
 
  // Temperature
  temperatureEl.textContent = Math.round(data.main.temp);
 
  // Description
  descriptionEl.textContent = data.weather[0].description;
 
  // Stats
  feelsLikeEl.textContent  = `${Math.round(data.main.feels_like)}°C`;
  humidityEl.textContent   = `${data.main.humidity}%`;
  windSpeedEl.textContent  = `${data.wind.speed} m/s`;
  visibilityEl.textContent = data.visibility
    ? `${(data.visibility / 1000).toFixed(1)} km`
    : "N/A";
  pressureEl.textContent   = `${data.main.pressure} hPa`;
  cloudinessEl.textContent = `${data.clouds.all}%`;
 
  // Show card
  weatherCard.classList.remove("hidden");
}
 
// ── Helpers ───────────────────────────────────────────────────
function showLoader() {
  errorMsg.classList.add("hidden");
  weatherCard.classList.add("hidden");
  loader.classList.remove("hidden");
}
 
function hideAll() {
  loader.classList.add("hidden");
  errorMsg.classList.add("hidden");
  weatherCard.classList.add("hidden");
}
 
function showError() {
  loader.classList.add("hidden");
  weatherCard.classList.add("hidden");
  errorMsg.classList.remove("hidden");
}
