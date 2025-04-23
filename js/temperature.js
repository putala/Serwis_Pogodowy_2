const API_URL = "https://api.open-meteo.com/v1/forecast";
const GEO_API_URL = "https://geocoding-api.open-meteo.com/v1/search";

const cityInput = document.getElementById("city");
const getWeatherButton = document.getElementById("getWeather");
todayWeatherButton = document.getElementById("todayWeather");
weekWeatherButton = document.getElementById("weekWeather");
const weatherChart = document.getElementById("weatherChart");

let chartInstance;

cityInput.value = localStorage.getItem("city") || "";
cityInput.addEventListener("input", () => {
    localStorage.setItem("city", cityInput.value);
});

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

function smoothData(data) {
    return data.map((_, index) => {
        if (index === 0) {
            return (2 * data[index] + data[index + 1]) / 3;
        } else if (index === data.length - 1) {
            return (data[index - 1] + 2 * data[index]) / 3;
        } else {
            return (data[index - 1] + 2 * data[index] + data[index + 1]) / 4;
        }
    });
}

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

async function showTodayWeather() {
    const data = await fetchWeatherData(cityInput.value, "hourly=temperature_2m");
    if (!data) return;

    const currentHour = new Date().getHours();
    const labels = data.hourly.time.slice(currentHour, currentHour + 24).map(t => parseInt(t.slice(11, 13), 10));
    let temperatures = data.hourly.temperature_2m.slice(currentHour, currentHour + 24);
    
    temperatures = smoothData(temperatures);
    
    updateChart(labels, temperatures, "Godzina", [], false);
}

async function showWeekWeather() {
    const data = await fetchWeatherData(cityInput.value, "hourly=temperature_2m");
    if (!data) return;

    const hourlyTimes = data.hourly.time;
    let hourlyTemps = data.hourly.temperature_2m;

    const now = new Date();
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const startIndex = hourlyTimes.findIndex(t => new Date(t).getTime() >= todayMidnight.getTime());
    const endIndex = startIndex + 7 * 24;

    const daysOfWeek = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
    const labels = hourlyTimes.slice(startIndex, endIndex).map(time => {
        const date = new Date(time);
        return date.getHours() === 12 ? daysOfWeek[date.getDay()] : "";
    });

    hourlyTemps = smoothData(hourlyTemps.slice(startIndex, endIndex));

    const markLines = hourlyTimes.slice(startIndex, endIndex).map((time, index) => {
        const date = new Date(time);
        return date.getHours() === 0 ? index : null;
    }).filter(index => index !== null);
    markLines.push(hourlyTemps.length - 1); 
    
    updateChart(labels, hourlyTemps, "Dni", markLines, true);
}

document.addEventListener("DOMContentLoaded", () => {
    if (cityInput.value) {
        showWeekWeather();
    }
});

getWeatherButton.addEventListener("click", showWeekWeather);
todayWeatherButton.addEventListener("click", showTodayWeather);
weekWeatherButton.addEventListener("click", showWeekWeather);