const chartTextColor = "#dbeefe";
const axisGridColor = "rgba(161, 206, 255, 0.2)";
const cityCountryCode = "IN";

const citySelect = document.getElementById("city-select");
const refreshButton = document.getElementById("refresh-btn");
const retryButton = document.getElementById("retry-btn");
const unitToggleButton = document.getElementById("unit-toggle");

const syncStatus = document.getElementById("sync-status");
const conditionChip = document.getElementById("condition-chip");
const lastUpdated = document.getElementById("last-updated");
const errorBanner = document.getElementById("error-banner");
const errorText = document.getElementById("error-text");

const avgTemp = document.getElementById("avg-temp");
const avgHumidity = document.getElementById("avg-humidity");
const totalRainfall = document.getElementById("total-rainfall");
const tempUnit = document.getElementById("temp-unit");

let temperatureChart;
let humidityChart;
let rainfallChart;
let latestMetricData = null;
let currentUnit = "C";

const geocodeCache = new Map();
const weatherCache = new Map();

function decodeApiKey() {
  const encodedReversed = "Nzk2OGZhYTlhNmM4NDMyMzVmMzNiNDQzYmVmNGJiNzU=";
  const reversed = atob(encodedReversed);
  return reversed.split("").reverse().join("");
}

function toTempUnit(metricValue, unit) {
  return unit === "F" ? (metricValue * 9) / 5 + 32 : metricValue;
}

function toDayLabel(unixSeconds, timezoneOffset) {
  return new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "UTC" }).format(
    new Date((unixSeconds + timezoneOffset) * 1000)
  );
}

function toDateKey(unixSeconds, timezoneOffset) {
  const localDate = new Date((unixSeconds + timezoneOffset) * 1000);
  const year = localDate.getUTCFullYear();
  const month = String(localDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(localDate.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function setLoadingState(isLoading) {
  refreshButton.disabled = isLoading;
  retryButton.disabled = isLoading;
  citySelect.disabled = isLoading;
  unitToggleButton.disabled = isLoading;

  if (isLoading) {
    syncStatus.textContent = `Loading live feed for ${citySelect.value}...`;
  }
}

function setError(message) {
  errorText.textContent = message;
  errorBanner.classList.remove("hidden");
}

function clearError() {
  errorBanner.classList.add("hidden");
  errorText.textContent = "";
}

async function fetchCoords(city) {
  const cacheKey = `${city},${cityCountryCode}`;
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey);
  }

  const apiKey = decodeApiKey();
  const query = encodeURIComponent(cacheKey);
  const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${apiKey}`;

  const response = await fetch(geocodeUrl);
  if (!response.ok) {
    throw new Error(`Geocode request failed (${response.status}).`);
  }

  const results = await response.json();
  if (!Array.isArray(results) || results.length === 0) {
    throw new Error(`No coordinates found for ${city}.`);
  }

  const coords = { lat: results[0].lat, lon: results[0].lon, name: results[0].name };
  geocodeCache.set(cacheKey, coords);
  return coords;
}

function aggregateForecast(weather, forecast) {
  const timezoneOffset = forecast.city.timezone;
  const currentDateKey = toDateKey(weather.dt, timezoneOffset);
  const dayBuckets = new Map();

  for (const item of forecast.list) {
    const dateKey = toDateKey(item.dt, timezoneOffset);
    if (dateKey <= currentDateKey) {
      continue;
    }

    if (!dayBuckets.has(dateKey)) {
      dayBuckets.set(dateKey, {
        dt: item.dt,
        tempSum: 0,
        humiditySum: 0,
        rainSum: 0,
        count: 0
      });
    }

    const bucket = dayBuckets.get(dateKey);
    bucket.tempSum += item.main.temp;
    bucket.humiditySum += item.main.humidity;
    bucket.rainSum += item.rain && item.rain["3h"] ? item.rain["3h"] : 0;
    bucket.count += 1;
  }

  const labels = ["Now"];
  const temperature = [weather.main.temp];
  const humidity = [weather.main.humidity];
  const rainfall = [weather.rain && weather.rain["1h"] ? weather.rain["1h"] : weather.rain && weather.rain["3h"] ? weather.rain["3h"] : 0];

  const orderedKeys = [...dayBuckets.keys()].slice(0, 5);
  for (const key of orderedKeys) {
    const bucket = dayBuckets.get(key);
    labels.push(toDayLabel(bucket.dt, timezoneOffset));
    temperature.push(bucket.tempSum / bucket.count);
    humidity.push(bucket.humiditySum / bucket.count);
    rainfall.push(bucket.rainSum);
  }

  while (labels.length < 6) {
    labels.push(`D+${labels.length - 1}`);
    temperature.push(temperature[temperature.length - 1]);
    humidity.push(humidity[humidity.length - 1]);
    rainfall.push(0);
  }

  return {
    labels,
    temperature,
    humidity,
    rainfall,
    condition: weather.weather && weather.weather[0] ? weather.weather[0].main : "Unknown",
    description: weather.weather && weather.weather[0] ? weather.weather[0].description : "No details"
  };
}

async function fetchCityWeather(city, forceRefresh = false) {
  if (!forceRefresh && weatherCache.has(city)) {
    return weatherCache.get(city);
  }

  const coords = await fetchCoords(city);
  const apiKey = decodeApiKey();

  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=metric`;

  const [weatherRes, forecastRes] = await Promise.all([fetch(weatherUrl), fetch(forecastUrl)]);

  if (!weatherRes.ok || !forecastRes.ok) {
    throw new Error("Weather API request failed. Check API key, quota, or network.");
  }

  const [weather, forecast] = await Promise.all([weatherRes.json(), forecastRes.json()]);
  const combined = aggregateForecast(weather, forecast);

  weatherCache.set(city, combined);
  return combined;
}

function getDisplayData(metricData) {
  return {
    labels: metricData.labels,
    temperature: metricData.temperature.map((value) => toTempUnit(value, currentUnit)),
    humidity: metricData.humidity,
    rainfall: metricData.rainfall,
    condition: metricData.condition,
    description: metricData.description
  };
}

function updateStats(displayData) {
  const tempAverage = displayData.temperature.reduce((sum, n) => sum + n, 0) / displayData.temperature.length;
  const humidityAverage = displayData.humidity.reduce((sum, n) => sum + n, 0) / displayData.humidity.length;
  const rainfallTotal = displayData.rainfall.reduce((sum, n) => sum + n, 0);

  avgTemp.textContent = tempAverage.toFixed(1);
  avgHumidity.textContent = humidityAverage.toFixed(1);
  totalRainfall.textContent = rainfallTotal.toFixed(1);
  tempUnit.textContent = currentUnit === "F" ? "°F" : "°C";
}

function updateHeaderMeta(displayData) {
  conditionChip.textContent = `${displayData.condition} - ${displayData.description}`;
  lastUpdated.textContent = `Last synced: ${new Date().toLocaleString()}`;
  syncStatus.textContent = `Live OpenWeather feed loaded for ${citySelect.value}.`;
}

const donutCenterPlugin = {
  id: "donutCenterPlugin",
  beforeDraw(chart) {
    if (chart.config.type !== "doughnut") {
      return;
    }

    const centerText = chart.options.plugins.centerText;
    if (!centerText) {
      return;
    }

    const meta = chart.getDatasetMeta(0);
    if (!meta || !meta.data || meta.data.length === 0 || !meta.data[0]) {
      return;
    }

    const { ctx } = chart;
    const x = meta.data[0].x;
    const y = meta.data[0].y;

    ctx.save();
    ctx.fillStyle = "#e9f4ff";
    ctx.textAlign = "center";
    ctx.font = "700 16px Space Grotesk";
    ctx.fillText(centerText.total, x, y - 2);
    ctx.fillStyle = "#a8bed8";
    ctx.font = "500 12px Space Grotesk";
    ctx.fillText(centerText.focus, x, y + 16);
    ctx.restore();
  }
};

Chart.register(donutCenterPlugin);

function createTemperatureChart() {
  const ctx = document.getElementById("temperature-chart");
  return new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [{
        label: "Temperature (°C)",
        data: [],
        borderColor: "#2dd4ff",
        backgroundColor: "rgba(45, 212, 255, 0.22)",
        fill: true,
        tension: 0.33,
        pointRadius: 3.8
      }]
    },
    options: {
      responsive: true,
      animation: { duration: 650 },
      plugins: {
        legend: { labels: { color: chartTextColor } }
      },
      scales: {
        x: { ticks: { color: chartTextColor }, grid: { color: axisGridColor } },
        y: { ticks: { color: chartTextColor }, grid: { color: axisGridColor } }
      }
    }
  });
}

function createHumidityChart() {
  const ctx = document.getElementById("humidity-chart");
  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: [],
      datasets: [{
        label: "Humidity (%)",
        data: [],
        backgroundColor: "rgba(248, 193, 90, 0.8)",
        borderColor: "#f8c15a",
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      animation: { duration: 650 },
      plugins: {
        legend: { labels: { color: chartTextColor } }
      },
      scales: {
        x: { ticks: { color: chartTextColor }, grid: { color: axisGridColor } },
        y: {
          ticks: { color: chartTextColor },
          grid: { color: axisGridColor },
          beginAtZero: true,
          suggestedMax: 100
        }
      }
    }
  });
}

function createRainfallChart() {
  const ctx = document.getElementById("rainfall-chart");
  return new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: [],
      datasets: [{
        label: "Rainfall (mm)",
        data: [],
        backgroundColor: ["#2dd4ff", "#38a6ff", "#2aa6bd", "#4ed4a8", "#f8c15a", "#f39f6a"],
        borderColor: "rgba(7, 17, 36, 0.95)",
        borderWidth: 2,
        hoverOffset: 12,
        offset: []
      }]
    },
    options: {
      responsive: true,
      cutout: "62%",
      animation: { duration: 700 },
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: chartTextColor, boxWidth: 14, padding: 16 }
        },
        centerText: {
          total: "0.0 mm",
          focus: "Peak: --"
        },
        tooltip: {
          callbacks: {
            label(context) {
              const value = Number(context.raw || 0);
              const allValues = context.dataset.data.map((n) => Number(n || 0));
              const total = allValues.reduce((sum, n) => sum + n, 0);
              const share = total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
              return `${context.label}: ${value.toFixed(1)} mm (${share}%)`;
            }
          }
        }
      }
    }
  });
}

function ensureCharts() {
  if (!temperatureChart) {
    temperatureChart = createTemperatureChart();
    humidityChart = createHumidityChart();
    rainfallChart = createRainfallChart();
  }
}

function updateCharts(displayData) {
  const maxRainValue = Math.max(...displayData.rainfall);
  const peakIndex = displayData.rainfall.findIndex((value) => value === maxRainValue);

  temperatureChart.data.labels = displayData.labels;
  temperatureChart.data.datasets[0].data = displayData.temperature;
  temperatureChart.data.datasets[0].label = `Temperature (°${currentUnit})`;

  humidityChart.data.labels = displayData.labels;
  humidityChart.data.datasets[0].data = displayData.humidity;

  rainfallChart.data.labels = displayData.labels;
  rainfallChart.data.datasets[0].data = displayData.rainfall;
  rainfallChart.data.datasets[0].offset = displayData.rainfall.map((_, index) => (index === peakIndex ? 16 : 4));
  rainfallChart.options.plugins.centerText = {
    total: `${displayData.rainfall.reduce((sum, n) => sum + n, 0).toFixed(1)} mm`,
    focus: `Peak: ${displayData.labels[peakIndex] || "Now"}`
  };

  temperatureChart.update();
  humidityChart.update();
  rainfallChart.update();
}

function renderDashboard(metricData) {
  latestMetricData = metricData;
  const displayData = getDisplayData(metricData);
  updateCharts(displayData);
  updateStats(displayData);
  updateHeaderMeta(displayData);
}

async function loadDashboard(forceRefresh = false) {
  setLoadingState(true);
  clearError();

  try {
    const metricData = await fetchCityWeather(citySelect.value, forceRefresh);
    ensureCharts();
    renderDashboard(metricData);
  } catch (error) {
    setError(error.message || "Unable to load weather feed.");
    syncStatus.textContent = `Failed to load weather feed for ${citySelect.value}.`;
  } finally {
    setLoadingState(false);
  }
}

function toggleUnit() {
  currentUnit = currentUnit === "C" ? "F" : "C";
  unitToggleButton.textContent = currentUnit === "C" ? "Use °F" : "Use °C";
  if (latestMetricData) {
    renderDashboard(latestMetricData);
  }
}

citySelect.addEventListener("change", () => loadDashboard(false));
refreshButton.addEventListener("click", () => loadDashboard(true));
retryButton.addEventListener("click", () => loadDashboard(true));
unitToggleButton.addEventListener("click", toggleUnit);

ensureCharts();
loadDashboard(false);
