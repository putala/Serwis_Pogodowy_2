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

// Funkcja do inicjalizacji mapy z danymi opadów
async function initializeRainMap() {
    const map = L.map('rainMap').setView([52.237, 19.017], 6); // Centrum Polski

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const rainData = await fetchRainStationsData();
    if (!rainData) {
        console.error("Brak danych o opadach.");
        return;
    }

    rainData.forEach(async station => {
        const { stacja, suma_opadu } = station;
        let coords = stationCoordinates[stacja];

        if (!coords) {
            coords = await getCoordinates(stacja);
            if (!coords) return;
        }

        const opady = parseFloat(suma_opadu);
        const color = getRainColor(opady);

        L.circleMarker([coords.lat, coords.lon], {
            radius: 7,
            fillColor: color,
            color: "#000",
            weight: 0.5,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map).bindPopup(`${stacja}<br>Opady: ${opady} mm`);
    });
}

// Funkcja pobierająca dane o opadach ze stacji
async function fetchRainStationsData() {
    const apiUrl = "https://danepubliczne.imgw.pl/api/data/synop";

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching rain data:", error);
        return null;
    }
}

// Ręczne przypisanie współrzędnych dla wybranych stacji
const stationCoordinates = {
    "Warszawa": { lat: 52.2298, lon: 21.0118 },
    "Gdańsk": { lat: 54.3520, lon: 18.6466 },
    "Kraków": { lat: 50.0647, lon: 19.9450 },
    "Wrocław": { lat: 51.1079, lon: 17.0385 },
    "Poznań": { lat: 52.4064, lon: 16.9252 }
};

// Funkcja pobierająca współrzędne dla stacji na podstawie nazwy
async function getCoordinates(stationName) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(stationName)}, Polska`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.length > 0) {
            return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
        } else {
            console.warn(`Nie znaleziono współrzędnych dla: ${stationName}`);
            return null;
        }
    } catch (error) {
        console.error(`Błąd pobierania współrzędnych dla ${stationName}:`, error);
        return null;
    }
}

// Funkcja określająca kolor dla wartości opadów
function getRainColor(rainfall) {
    if (rainfall === 0) return "white"; 
    if (rainfall < 1) return "#b3e5fc"; // Jasnoniebieski
    if (rainfall < 5) return "#64b5f6"; // Średni niebieski
    if (rainfall < 10) return "#1976d2"; // Ciemniejszy niebieski
    return "#0d47a1"; // Ciemny granatowy dla największych opadów
}

// Automatyczne wczytanie mapy po odświeżeniu strony
if (document.getElementById("rainMap")) {
    document.addEventListener("DOMContentLoaded", initializeRainMap);
}
