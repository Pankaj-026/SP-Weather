const cityInput = document.querySelector(".search__input");
const placeName = document.querySelector(".place__name");
const currentTime = document.querySelector(".currentTime");
const weatherInfo = document.querySelector(".weather__button");
const weatherIcon = document.querySelector(".weather__icon");
const degree = document.querySelector(".weather__degree");
const min = document.querySelector(".min");
const max = document.querySelector(".max");
const feelLike = document.querySelector(".FeelLike__bar");
const humidity = document.querySelector(".Humidity__bar");
const wind = document.querySelector(".Wind__bar");
const pressure = document.querySelector(".Pressure__bar");
const visibility = document.querySelector(".Visibility__bar");
const seaLevel = document.querySelector(".SeaLevel__bar");
const sunrise = document.querySelector("#sunrise");
const sunset = document.querySelector("#sunset");

const apiKey = "d6cb20f8aab5ac3303fdc1a616e25693";

cityInput.addEventListener("input", async (event) => {
  const query = event.target.value.trim();
  if (query.length > 2) {
    const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=d6cb20f8aab5ac3303fdc1a616e25693`);
    const suggestions = await res.json();

    // Display suggestions in a dropdown or console
    console.log(suggestions.map((s) => `${s.name}, ${s.country}`));
  }
});

const fullCountryName = (code) => {
  return new Intl.DisplayNames([code],{type: 'region'}).of(code)
}

const formatDateTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return date.toLocaleDateString("en", options);
};

const updateBackground = (condition,dt) => {
  const videoSource = document.getElementById("bg-source");
  const bgVideo = document.getElementById("bg-video");
  const body = document.body;
  const time = dt

  // Remove existing weather classes
  body.className = "";

  // Update the background video and text color class
  if (condition.includes("sunny")) {
    videoSource.src = "img/sunny.mp4";
    body.classList.add("sunny");
  } else if (condition.includes("rain")) {
    videoSource.src = "img/rain.mp4";
    body.classList.add("rainy");
  } else if (condition.includes("cloud")) {
    videoSource.src = "img/cloud.mp4";
    body.classList.add("cloudy");
  } else if (condition.includes("clear sky")) {
    if(time.includes('PM')){
      videoSource.src = "img/night_sky.mp4";
      body.classList.add("else");
    }else{
      videoSource.src = "img/clear_sky.mp4";
      body.classList.add("clear");
    }
  } else if (condition.includes("smoke")) {
    videoSource.src = "img/fog1.mp4";
    body.classList.add("smoke");
  } else if (condition.includes("haze")) {
    videoSource.src = "img/fog2.mp4";
    body.classList.add("haze");
  } else {
    videoSource.src = "img/night_sky.mp4";
    body.classList.add("else");
  }

  bgVideo.load();
  
  console.log(`Condition: ${condition}, Video Source: ${videoSource.src}`);
};




// Update function with background logic
const getWeatherData = async (city = "Mumbai") => {
  try {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    let res = await fetch(weatherURL);
    if (!res.ok) throw new Error("City not found!");
    let data = await res.json();

    console.log(data);

    // Extracting required fields
    const { main, name, weather, wind: windData, sys, dt } = data;

    // Background change
    updateBackground(weather[0].description, formatDateTime(dt));

    // Update UI
    placeName.innerHTML = `<i class="fa-solid fa-location-dot"></i>  ${name}, ${fullCountryName(sys.country)}`;
    currentTime.textContent = formatDateTime(dt);
    weatherInfo.textContent = weather[0].description;
    degree.textContent = `${Math.round(main.temp)}°C`;
    min.textContent = `Min: ${Math.round(main.temp_min)}°C`;
    max.textContent = `Max: ${Math.round(main.temp_max)}°C`;
    feelLike.innerHTML = `<i class="fa-solid fa-temperature-half"></i> Feels Like <br> <span> ${Math.round(
      main.feels_like
    )}°C </span>`;
    humidity.innerHTML = `<i class="fa-solid fa-droplet"></i> Humidity <br> <span>${main.humidity}%  </span>`;
    wind.innerHTML = `<i class="fa-solid fa-wind"></i> Wind <br> <br>  <span>${Math.round(
      windData.speed
    )} m/s </span>`;
    pressure.innerHTML = `<i class="fa-solid fa-arrow-down-wide-short"></i> Pressure <br> <span>${main.pressure} hPa  </span>`;
    visibility.innerHTML = `<i class="fa-solid fa-eye"></i> Visibility <br> <span>${data.visibility} mi  </span>`;
    seaLevel.innerHTML = `<i class="fa-solid fa-water"></i> Sea Level <br> <span>${main.sea_level}  </span>`;

    // Add weather icon
    const iconURL = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
    weatherIcon.innerHTML = `<img src="${iconURL}" alt="${weather[0].description}">`;
    
  } catch (error) {
    alert(error.message);
    console.error("Error fetching weather data:", error);
  }
};

// Event listener for search input
document
  .querySelector(".city__search")
  .addEventListener("keypress", (event) => {
    if (event.key === "Enter" && cityInput.value.trim() !== "") {
      getWeatherData(cityInput.value.trim());
      cityInput.value = ""; // Clear input field
    }
  });

// Load default weather data on page load
window.addEventListener("load", () => getWeatherData());
