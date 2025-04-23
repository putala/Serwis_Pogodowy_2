
// Ręczne przypisanie współrzędnych dla wybranych stacji
const stationCoordinates = {
    "Białystok": { lat: 53.1345, lon: 23.1630 },
    "Bielsko-Biała": { lat: 49.8225, lon: 19.0440 },
    "Chojnice": { lat: 53.6951, lon: 17.5575 },
    "Częstochowa": { lat: 50.8118, lon: 19.1203 },
    "Elbląg": { lat: 54.1522, lon: 19.4088 },
    "Gdańsk": { lat: 54.3520, lon: 18.6466 },
    "Gorzów Wielkopolski": { lat: 52.7368, lon: 15.2288 },
    "Hel": { lat: 54.6087, lon: 18.7999 },
    "Jelenia Góra": { lat: 50.9049, lon: 15.7345 },
    "Kalisz": { lat: 51.7611, lon: 18.0910 },
    "Kasprowy Wierch": { lat: 49.2313, lon: 19.9813 },
    "Katowice": { lat: 50.2649, lon: 19.0238 },
    "Kętrzyn": { lat: 54.0766, lon: 21.3756 },
    "Kielce": { lat: 50.8661, lon: 20.6286 },
    "Kłodzko": { lat: 50.4346, lon: 16.6612 },
    "Koło": { lat: 52.2000, lon: 18.6382 },
    "Kołobrzeg": { lat: 54.1750, lon: 15.5833 },
    "Koszalin": { lat: 54.1944, lon: 16.1722 },
    "Kozienice": { lat: 51.5820, lon: 21.5501 },
    "Kraków": { lat: 50.0647, lon: 19.9450 },
    "Krosno": { lat: 49.6890, lon: 21.7587 },
    "Legnica": { lat: 51.2070, lon: 16.1550 },
    "Lesko": { lat: 49.4700, lon: 22.3300 },
    "Leszno": { lat: 51.8400, lon: 16.5740 },
    "Lębork": { lat: 54.5390, lon: 17.7500 },
    "Lublin": { lat: 51.2500, lon: 22.5680 },
    "Łeba": { lat: 54.7600, lon: 17.5600 },
    "Łódź": { lat: 51.7592, lon: 19.4586 },
    "Mikołajki": { lat: 53.8000, lon: 21.5700 },
    "Mława": { lat: 53.1120, lon: 20.3840 },
    "Nowy Sącz": { lat: 49.6214, lon: 20.6970 },
    "Olsztyn": { lat: 53.7784, lon: 20.4801 },
    "Opole": { lat: 50.6665, lon: 17.9210 },
    "Ostrołęka": { lat: 53.0860, lon: 21.5750 },
    "Piła": { lat: 53.1510, lon: 16.7410 },
    "Płock": { lat: 52.5468, lon: 19.7064 },
    "Poznań": { lat: 52.4064, lon: 16.9252 },
    "Przemyśl": { lat: 49.7830, lon: 22.7670 },
    "Racibórz": { lat: 50.0920, lon: 18.2190 },
    "Resko": { lat: 53.7700, lon: 15.4050 },
    "Rzeszów": { lat: 50.0413, lon: 22.0010 },
    "Sandomierz": { lat: 50.6820, lon: 21.7490 },
    "Siedlce": { lat: 52.1670, lon: 22.2900 },
    "Słubice": { lat: 52.3500, lon: 14.5600 },
    "Sulejów": { lat: 51.3540, lon: 19.8850 },
    "Suwałki": { lat: 54.1110, lon: 22.9300 },
    "Świnoujście": { lat: 53.9103, lon: 14.2478 },
    "Gorzów": { lat: 52.7368, lon: 15.2288 },
    "Bielsko-Biała": { lat: 49.8225, lon: 19.0440 },
    "Terespol": { lat: 52.0750, lon: 23.6190 },
    "Tarnów": { lat: 50.0138, lon: 20.9869 },
    "Śnieżka": { lat: 50.7360, lon: 15.7390 },
    "Szczecin": { lat: 53.4285, lon: 14.5528 },
    "Ustka": { lat: 54.5800, lon: 16.8600 },
    "Szczecinek": { lat: 53.7075, lon: 16.6980 },
    "Toruń": { lat: 53.0138, lon: 18.5984 },
    "Warszawa": { lat: 52.2298, lon: 21.0122 },
    "Włodawa": { lat: 51.5500, lon: 23.5500 },
    "Zielona Góra": { lat: 51.9356, lon: 15.5064 },
    "Zamość": { lat: 50.7231, lon: 23.2519 },
    "Zakopane": { lat: 49.2992, lon: 19.9496 },
    "Wrocław": { lat: 51.1079, lon: 17.0385 },
    "Wieluń": { lat: 51.2203, lon: 18.5704 },
    "Bielsko Biała": { lat: 49.8225, lon: 19.0440 }
};



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
            await new Promise(r => setTimeout(r, 10));
            coords = await getCoordinates(stacja);
            if (!coords) return;
        }

        const opady = parseFloat(suma_opadu);
        const color = getRainColor(opady);

        L.circleMarker([coords.lat, coords.lon], {
            radius: 20,
            fillColor: color,
            color: "#000",
            weight: 0.5,
            opacity: 1,
            fillOpacity: 0.5
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


// Funkcja pobierająca współrzędne dla stacji na podstawie nazwy
async function getCoordinates(stationName) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(stationName)}, Polska`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Błąd HTTP: ${response.status}`);
            return null;
        }
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
