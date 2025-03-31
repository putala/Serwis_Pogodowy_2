const API_URL = "https://api.open-meteo.com/v1/forecast";
const GEO_API_URL = "https://geocoding-api.open-meteo.com/v1/search";

const cityInput = document.getElementById("city");
const getWeatherButton = document.getElementById("getWeather");
const todayWeatherButton = document.getElementById("todayWeather");
const weekWeatherButton = document.getElementById("weekWeather");
const weatherChart = document.getElementById("weatherChart");

let chartInstance;

// Zachowanie nazwy miejscowości w localStorage
cityInput.value = localStorage.getItem("city") || "";
cityInput.addEventListener("input", () => {
    localStorage.setItem("city", cityInput.value);
});

// Pobieranie współrzędnych miasta
async function getCoordinates(city) {
    try {
        const response = await fetch(`${GEO_API_URL}?name=${city}&count=1`);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            return {
                latitude: data.results[0].latitude,
                longitude: data.results[0].longitude
            };
        } else {
            alert("Nie znaleziono miasta!");
            return null;
        }
    } catch (error) {
        alert("Błąd podczas pobierania współrzędnych!");
        console.error(error);
        return null;
    }
}

// Pobieranie danych pogodowych
async function fetchWeatherData(city, params) {
    const coords = await getCoordinates(city);
    if (!coords) return;

    try {
        const response = await fetch(`${API_URL}?latitude=${coords.latitude}&longitude=${coords.longitude}&${params}`);
        const data = await response.json();
        return data;
    } catch (error) {
        alert("Nie udało się pobrać danych pogodowych.");
        console.error(error);
    }
}

// Rysowanie wykresu
function updateChart(labels, data, xAxisTitle, markLines = [], showMarkLines = false) {
    if (!chartInstance) {
        chartInstance = echarts.init(weatherChart);
    }
    
    const option = {
        tooltip: { trigger: "axis" },
        xAxis: {
            type: "category",
            data: labels,
            name: xAxisTitle,
            axisLabel: { interval: 0, rotate: 0 },
            axisTick: { show: true, length: 5 },
            axisPointer: { show: true }
        },
        yAxis: { type: "value", name: "Temperatura (°C)" },
        series: [{
            name: "Temperatura",
            type: "line",
            data: data,
            smooth: true,
            lineStyle: { color: "blue" },
            itemStyle: { color: "blue" },
            markLine: showMarkLines ? {
                silent: true,
                symbol: "none",
                lineStyle: { type: "dashed", color: "red" },
                label: { show: false },
                data: [...markLines.map(index => ({ xAxis: index })), { xAxis: labels.length - 1 }]
            } : undefined
        }]
    };

    chartInstance.setOption(option);
}

// Pogoda na dziś
async function showTodayWeather() {
    const data = await fetchWeatherData(cityInput.value, "hourly=temperature_2m");
    if (!data) return;

    const currentHour = new Date().getHours();
    const labels = data.hourly.time.slice(currentHour, currentHour + 24).map(t => parseInt(t.slice(11, 13), 10));
    const temperatures = data.hourly.temperature_2m.slice(currentHour, currentHour + 24);
    updateChart(labels, temperatures, "Godzina", [], false);
}

// Pogoda na tydzień
async function showWeekWeather() {
    const data = await fetchWeatherData(cityInput.value, "hourly=temperature_2m");
    if (!data) return;

    const hourlyTimes = data.hourly.time;
    const hourlyTemps = data.hourly.temperature_2m;

    const now = new Date();
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const startIndex = hourlyTimes.findIndex(t => new Date(t).getTime() === todayMidnight.getTime());
    const endIndex = startIndex + 7 * 24 + 1;

    const filteredTimes = hourlyTimes.slice(startIndex, endIndex);
    const filteredTemps = hourlyTemps.slice(startIndex, endIndex);

    const reducedTimes = filteredTimes.filter((_, index) => index % 3 === 0 || index === filteredTimes.length - 1);
    const reducedTemps = filteredTemps.filter((_, index) => index % 3 === 0 || index === filteredTemps.length - 1);

    const daysOfWeek = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
    const labels = reducedTimes.map((time) => {
        const date = new Date(time);
        return date.getHours() === 12 ? daysOfWeek[date.getDay()] : "";
    });

    const markLines = reducedTimes.map((time, index) => {
        const date = new Date(time);
        return date.getHours() === 0 ? index : null;
    }).filter(index => index !== null);

    updateChart(labels, reducedTemps, "Dni", markLines, true);
}

// Automatyczne wczytanie pogody po odświeżeniu strony
document.addEventListener("DOMContentLoaded", () => {
    if (cityInput.value) {
        showWeekWeather();
    }
});

// Obsługa przycisków
getWeatherButton.addEventListener("click", showWeekWeather);
todayWeatherButton.addEventListener("click", showTodayWeather);
weekWeatherButton.addEventListener("click", showWeekWeather);
