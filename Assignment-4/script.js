const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const cityWeatherProfiles = {
  Shillong: {
    temperature: [18, 20, 19, 21, 20, 22, 19],
    humidity: [83, 81, 84, 79, 82, 80, 85],
    rainfall: [28, 16, 22, 18, 20, 25, 24]
  },
  Leh: {
    temperature: [9, 11, 10, 12, 13, 12, 10],
    humidity: [38, 35, 36, 33, 32, 34, 37],
    rainfall: [3, 2, 2, 1, 2, 3, 2]
  },
  Kochi: {
    temperature: [30, 31, 30, 29, 30, 31, 29],
    humidity: [86, 88, 87, 89, 88, 86, 87],
    rainfall: [24, 30, 20, 26, 28, 18, 22]
  },
  Jaisalmer: {
    temperature: [34, 35, 36, 37, 36, 35, 34],
    humidity: [29, 27, 26, 25, 28, 30, 29],
    rainfall: [1, 0, 0, 1, 0, 1, 0]
  },
  Gangtok: {
    temperature: [17, 18, 17, 19, 18, 17, 16],
    humidity: [78, 80, 79, 81, 82, 80, 79],
    rainfall: [21, 19, 24, 26, 23, 22, 20]
  }
};

const chartTextColor = "#dbeefe";
const axisGridColor = "rgba(161, 206, 255, 0.2)";

const citySelect = document.getElementById("city-select");
const refreshButton = document.getElementById("refresh-btn");
const lastUpdated = document.getElementById("last-updated");
const avgTemp = document.getElementById("avg-temp");
const avgHumidity = document.getElementById("avg-humidity");
const totalRainfall = document.getElementById("total-rainfall");

let temperatureChart;
let humidityChart;
let rainfallChart;

function numberWithDelta(base, min, max) {
  const delta = Math.floor(Math.random() * (max - min + 1)) + min;
  return Math.max(0, base + delta);
}

function withVariation(values, minDelta, maxDelta) {
  return values.map((value) => numberWithDelta(value, minDelta, maxDelta));
}

function cloneProfile(city) {
  const profile = cityWeatherProfiles[city];
  return {
    temperature: [...profile.temperature],
    humidity: [...profile.humidity],
    rainfall: [...profile.rainfall]
  };
}

function generateCityWeather(city) {
  const profile = cloneProfile(city);
  return {
    temperature: withVariation(profile.temperature, -2, 2),
    humidity: withVariation(profile.humidity, -5, 5),
    rainfall: withVariation(profile.rainfall, -4, 4)
  };
}

function setStats(data) {
  const tempAverage = data.temperature.reduce((sum, n) => sum + n, 0) / data.temperature.length;
  const humidityAverage = data.humidity.reduce((sum, n) => sum + n, 0) / data.humidity.length;
  const rainfallTotal = data.rainfall.reduce((sum, n) => sum + n, 0);

  avgTemp.textContent = tempAverage.toFixed(1);
  avgHumidity.textContent = humidityAverage.toFixed(1);
  totalRainfall.textContent = rainfallTotal.toFixed(0);
}

function updateTimestamp(city) {
  const now = new Date();
  lastUpdated.textContent = `Live feed simulated for ${city} • ${now.toLocaleString()}`;
}

function createTemperatureChart(data) {
  const ctx = document.getElementById("temperature-chart");
  return new Chart(ctx, {
    type: "line",
    data: {
      labels: days,
      datasets: [{
        label: "Temperature (°C)",
        data,
        borderColor: "#2dd4ff",
        backgroundColor: "rgba(45, 212, 255, 0.22)",
        fill: true,
        tension: 0.33,
        pointRadius: 3.8
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: chartTextColor }
        }
      },
      scales: {
        x: {
          ticks: { color: chartTextColor },
          grid: { color: axisGridColor }
        },
        y: {
          ticks: { color: chartTextColor },
          grid: { color: axisGridColor }
        }
      }
    }
  });
}

function createHumidityChart(data) {
  const ctx = document.getElementById("humidity-chart");
  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: days,
      datasets: [{
        label: "Humidity (%)",
        data,
        backgroundColor: "rgba(248, 193, 90, 0.8)",
        borderColor: "#f8c15a",
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: chartTextColor }
        }
      },
      scales: {
        x: {
          ticks: { color: chartTextColor },
          grid: { color: axisGridColor }
        },
        y: {
          ticks: { color: chartTextColor },
          grid: { color: axisGridColor },
          beginAtZero: true
        }
      }
    }
  });
}

function createRainfallChart(data) {
  const ctx = document.getElementById("rainfall-chart");
  return new Chart(ctx, {
    type: "pie",
    data: {
      labels: days,
      datasets: [{
        label: "Rainfall (mm)",
        data,
        backgroundColor: [
          "#2dd4ff",
          "#38a6ff",
          "#2aa6bd",
          "#4ed4a8",
          "#f8c15a",
          "#f39f6a",
          "#9fbdff"
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: chartTextColor }
        }
      }
    }
  });
}

function updateCharts(weatherData) {
  temperatureChart.data.datasets[0].data = weatherData.temperature;
  humidityChart.data.datasets[0].data = weatherData.humidity;
  rainfallChart.data.datasets[0].data = weatherData.rainfall;

  temperatureChart.update();
  humidityChart.update();
  rainfallChart.update();
}

function refreshDashboard() {
  const city = citySelect.value;
  const weatherData = generateCityWeather(city);

  updateCharts(weatherData);
  setStats(weatherData);
  updateTimestamp(city);
}

function initDashboard() {
  const city = citySelect.value;
  const initialData = generateCityWeather(city);

  temperatureChart = createTemperatureChart(initialData.temperature);
  humidityChart = createHumidityChart(initialData.humidity);
  rainfallChart = createRainfallChart(initialData.rainfall);

  setStats(initialData);
  updateTimestamp(city);
}

citySelect.addEventListener("change", refreshDashboard);
refreshButton.addEventListener("click", refreshDashboard);

initDashboard();
