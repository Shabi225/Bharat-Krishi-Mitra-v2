const apiKey = "5a67f363ab3346e327b54cb90896c5b0";

// MAIN
function getWeather() {
  const citySelect = document.getElementById("city");
  if (!citySelect) {
    console.warn("City select not found");
    return;
  }

  const city = citySelect.value;
  const season = document.getElementById("season").value;

  if (!city || city.trim() === "") {
    alert("Please select a city first.");
    return;
  }

  console.log("Fetching weather for:", city);

  // CURRENT WEATHER
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},IN&units=metric&appid=${apiKey}`)
    .then(res => res.json())
    .then(current => {
      console.log("Current weather:", current);

      if (!current || current.cod !== 200) {
        document.getElementById("currentWeather").innerHTML =
          `<p>Could not load current weather for "${city}".</p>`;
        return;
      }

      document.getElementById("currentWeather").innerHTML = `
        <h3>${current.name}</h3>
        <p><b>Temp:</b> ${current.main.temp} °C</p>
        <p>Humidity: ${current.main.humidity}%</p>
        <p>Wind: ${current.wind.speed} m/s</p>
        <p>${current.weather[0].description}</p>
      `;

      generateAlerts(current);
      generateCropSuggestion(current.main.temp, season);
    })
    .catch(err => {
      console.error("Fetch current weather failed:", err);
    });

  // FORECAST
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)},IN&units=metric&appid=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      console.log("Forecast:", data);

      if (!data || data.cod !== "200" || !Array.isArray(data.list)) {
        document.getElementById("forecast").innerHTML = "<p>Could not load forecast.</p>";
        document.getElementById("hourly").innerHTML = "";
        document.getElementById("advisory").innerHTML = "";
        return;
      }

      generateForecast(data);
      generateHourly(data);
      generateAdvisory(data);
    })
    .catch(err => {
      console.error("Fetch forecast failed:", err);
    });
}


// ALERTS
function generateAlerts(data) {
  let alertHTML = "";

  if (data.main.temp > 40)
    alertHTML += `<div class="alert red">🔥 Heat wave alert – Avoid afternoon work.</div>`;

  if (data.wind.speed > 10)
    alertHTML += `<div class="alert amber">💨 High wind – Avoid spraying.</div>`;

  if (alertHTML === "")
    alertHTML = `<div class="alert green">✅ No extreme weather alerts.</div>`;

  document.getElementById("alertBox").innerHTML = alertHTML;
}

// CROP SUGGESTION
function generateCropSuggestion(temp, season) {
  let crops = "";

  if (season === "Kharif") {
    crops = "🌾 Rice, Maize, Cotton, Soybean";
  } else if (season === "Rabi") {
    crops = "🌾 Wheat, Mustard, Barley, Gram";
  } else {
    crops = "🌾 Watermelon, Cucumber, Fodder Crops";
  }

  if (temp > 38)
    crops += "<br>⚠ Consider heat-resistant varieties.";

  document.getElementById("cropSuggestion").innerHTML =
    `<h3>Recommended Crops</h3><p>${crops}</p>`;
}

// 5-DAY FORECAST
function generateForecast(data) {
  if (!data || !Array.isArray(data.list)) return;

  let forecastHTML = "";

  for (let i = 0; i < data.list.length; i += 8) {
    const item = data.list[i];
    const date = new Date(item.dt_txt);

    forecastHTML += `
      <div class="forecast-day">
        <b>${date.toLocaleDateString('en-IN', { weekday: 'short' })}</b>
        <p>${item.main.temp}°C</p>
        <p>Rain: ${(item.pop * 100).toFixed(0)}%</p>
      </div>
    `;
  }

  document.getElementById("forecast").innerHTML = forecastHTML;
}

// HOURLY TABLE
function generateHourly(data) {
  if (!data || !Array.isArray(data.list)) return;

  let hourlyHTML = `
    <tr>
      <th>Time</th>
      <th>Temp</th>
      <th>Rain %</th>
      <th>Wind</th>
    </tr>
  `;

  // next 8 x 3h = 24 hours
  for (let i = 0; i < 8 && i < data.list.length; i++) {
    const item = data.list[i];
    const rain = (item.pop || 0) * 100;
    const good = (rain < 20 && item.wind.speed < 5) ? "good-window" : "";

    hourlyHTML += `
      <tr class="${good}">
        <td>${new Date(item.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
        <td>${item.main.temp}</td>
        <td>${rain.toFixed(0)}%</td>
        <td>${item.wind.speed}</td>
      </tr>
    `;
  }

  document.getElementById("hourly").innerHTML = hourlyHTML;
}

// ADVISORY
function generateAdvisory(data) {
  if (!data || !Array.isArray(data.list) || data.list.length === 0) return;

  const first = data.list[0];
  const rain = (first.pop || 0) * 100;
  const humidity = first.main.humidity;
  const temp = first.main.temp;
  const wind = first.wind.speed;

  let advice = "<h3>Weather-based Advisory</h3><ul>";

  if (rain > 60)
    advice += "<li>🌧 Delay irrigation – heavy rain expected.</li>";

  if (humidity > 80 && temp > 25)
    advice += "<li>🦠 High fungal disease risk – monitor crops.</li>";

  if (wind < 5 && rain < 20)
    advice += "<li>✅ Good time for spraying.</li>";

  if (temp > 38)
    advice += "<li>🔥 Avoid fertilizer application during peak heat.</li>";

  advice += "</ul>";

  document.getElementById("advisory").innerHTML = advice;
}

// AUTO-DETECT LOCATION
function detectLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation not supported on this device.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      console.log("Got coords:", lat, lon);

      fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {
          console.log("Reverse geo result:", data);

          if (!Array.isArray(data) || data.length === 0) {
            alert("Could not detect nearest city. Please select from list.");
            return;
          }

          const place = data[0];
          const knownCities = ["Ashta", "Bhopal", "Sehore", "Indore"];
          let matched = null;

          for (const c of knownCities) {
            if (place.name.toLowerCase().includes(c.toLowerCase())) {
              matched = c;
              break;
            }
          }

          const citySelect = document.getElementById("city");

          if (matched) {
            citySelect.value = matched;
            console.log("Matched dropdown city:", matched);
          } else {
            alert(`Detected location: ${place.name}${place.state ? ", " + place.state : ""}. Please choose the nearest city manually.`);
          }

          getWeather();
        })
        .catch(err => {
          console.error("Error in reverse geocoding:", err);
          alert("Unable to detect district automatically. Please select from list.");
        });
    },
    error => {
      console.error("Geolocation error:", error);
      alert("Location access denied. Please allow location or select city manually.");
    }
  );
}

// Auto-load Bhopal weather on page load
document.addEventListener('DOMContentLoaded', function() {
  // Set Bhopal as default
  const citySelect = document.getElementById("city");
  if (citySelect) {
    citySelect.value = "Bhopal";
  }
  
  // Load weather after 500ms (DOM ready)
  setTimeout(getWeather, 500);
});


// NEW: Nav Toggle
function toggleNavMenu() {
  document.getElementById('navMenu').classList.toggle('show');
}

// Close on click outside
document.addEventListener('click', function(e) {
  const navDrop = document.querySelector('.nav-dropdown');
  if (navDrop && !navDrop.contains(e.target)) {
    document.getElementById('navMenu').classList.remove('show');
  }
});


// Refresh translate after weather load
setTimeout(() => {
  const combo = document.querySelector('.goog-te-combo');
  if (combo) combo.dispatchEvent(new Event('change'));
}, 3000);


