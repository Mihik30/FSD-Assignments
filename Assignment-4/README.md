# Assignment 4 - Interactive Weather Dashboard

## Description

This assignment is an interactive weather dashboard built with HTML, CSS,
JavaScript, and Chart.js. It visualizes weather patterns using real data from
OpenWeather and supports live refresh per selected city.

## Features

- interactive weather dashboard with responsive layout
- line chart for temperature trends (Now + next 5 days)
- bar chart for humidity levels (Now + next 5 days)
- donut chart for rainfall share with percentage tooltips and peak-day highlight
- live API-backed updates using OpenWeather data
- refresh button to reload real weather feed
- city rotation with uncommon Indian city datasets:
  Shillong, Leh, Kochi, Jaisalmer, Gangtok
- quick KPI cards for average temperature, average humidity, and total rainfall
- weather condition chip, sync status banner, error handling with retry button
- temperature unit toggle between Celsius and Fahrenheit

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6)
- Chart.js
- OpenWeather APIs (`geo`, `weather`, `forecast`)

## Files

- `index.html` - dashboard structure and chart containers
- `style.css` - visual styling, responsive layout, and animation
- `script.js` - OpenWeather fetch logic, data aggregation, and chart rendering

## How To Run

Open `index.html` in any browser.

## API Key Note

- The OpenWeather API key is embedded in frontend JavaScript with basic
  obfuscation for convenience.
- Obfuscation does not secure a frontend key; it can still be extracted from
  browser/network tools.
