const rainChartElement = document.getElementById("rainChart");
let rainChartInstance;

// Funkcja do aktualizacji wykresu opadów
function updateRainChart(labels, data, xAxisTitle, markLines = [], showMarkLines = false) {
    if (!rainChartInstance) {
        rainChartInstance = echarts.init(rainChartElement);
    }

    const option = {
        tooltip: { trigger: "axis" },
        xAxis: {
            type: "category",
            data: labels,
            name: xAxisTitle,
            axisLabel: { interval: 0, rotate: 0 },
            axisTick: { show: true, length: 5 }
        },
        yAxis: { type: "value", name: "Opady (mm)" },
        series: [{
            name: "Opady",
            type: "bar",
            data: data,
            itemStyle: { color: "lightblue" }
        }]
    };

    if (showMarkLines) {
        option.series[0].markLine = {
            silent: true,
            symbol: "none",
            lineStyle: { type: "dashed", color: "red" },
            label: { show: false },
            data: [...markLines.map(index => ({ xAxis: index })), { xAxis: labels.length - 1 }]
        };
    }

    rainChartInstance.setOption(option);
}

// Pobieranie danych o opadach na dziś
async function fetchTodayRainData(city) {
    const data = await fetchWeatherData(city, "hourly=precipitation");
    if (!data) return;

    const currentHour = new Date().getHours();
    const labels = data.hourly.time.slice(currentHour, currentHour + 24).map(t => parseInt(t.slice(11, 13), 10));
    const precipitation = data.hourly.precipitation.slice(currentHour, currentHour + 24);

    updateRainChart(labels, precipitation, "Godzina");
}

// Pobieranie danych o opadach na tydzień
async function fetchWeekRainData(city) {
    const data = await fetchWeatherData(city, "hourly=precipitation");
    if (!data) return;

    const hourlyTimes = data.hourly.time;
    const hourlyPrecipitation = data.hourly.precipitation;

    const now = new Date();
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const startIndex = hourlyTimes.findIndex(t => new Date(t).getTime() === todayMidnight.getTime());
    const endIndex = startIndex + 7 * 24;

    const filteredTimes = hourlyTimes.slice(startIndex, endIndex);
    const filteredPrecipitation = hourlyPrecipitation.slice(startIndex, endIndex);

    const smoothedPrecipitation = filteredPrecipitation.map((_, index) => {
        if (index === 0) {
            return (2 * filteredPrecipitation[index] + filteredPrecipitation[index + 1]) / 4;
        } else if (index === filteredPrecipitation.length - 1) {
            return (filteredPrecipitation[index - 1] + 2 * filteredPrecipitation[index]) / 4;
        } else {
            return (filteredPrecipitation[index - 1] + filteredPrecipitation[index] + filteredPrecipitation[index + 1]) / 3;
        }
    });

    const daysOfWeek = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
    const labels = filteredTimes.map(time => {
        const date = new Date(time);
        return date.getHours() === 12 ? daysOfWeek[date.getDay()] : "";
    });

    const markLines = filteredTimes.map((time, index) => {
        const date = new Date(time);
        return date.getHours() === 0 ? index : null;
    }).filter(index => index !== null);

    updateRainChart(labels, smoothedPrecipitation, "Dni", markLines, true);
}

// Automatyczne wczytanie pogody po odświeżeniu strony
document.addEventListener("DOMContentLoaded", () => {
    if (cityInput.value) {
        fetchWeekRainData(cityInput.value);
    }
});

// Podpinanie do przycisków
getWeatherButton.addEventListener("click", () => fetchWeekRainData(cityInput.value));
todayWeatherButton.addEventListener("click", () => fetchTodayRainData(cityInput.value));
weekWeatherButton.addEventListener("click", () => fetchWeekRainData(cityInput.value));