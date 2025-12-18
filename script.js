let currentCity = "";

function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}

function saveFavorites(data) {
    localStorage.setItem("favorites", JSON.stringify(data));
}

async function getWeather() {
    const city = document.getElementById("cityInput").value;
    if (!city) return;

    const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
    );
    const geoData = await geoRes.json();

    if (!geoData.results) {
        alert("Şehir bulunamadı");
        return;
    }

    const { latitude, longitude, name } = geoData.results[0];
    currentCity = name;

    const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );
    const weather = await weatherRes.json();

    const temp = weather.current_weather.temperature;
    const wind = weather.current_weather.windspeed;

    updateUI(name, temp, wind);
}

function updateUI(city, temp, wind) {
    const card = document.getElementById("weatherCard");
    const icon = document.getElementById("icon");
    const page = document.getElementById("page");

    document.getElementById("cityName").innerText = city;
    document.getElementById("temp").innerText = `🌡️ ${temp} °C`;
    document.getElementById("wind").innerText = `🌬️ ${wind} km/h`;

    // Hava durumuna göre tema
    if (temp > 25) {
        icon.innerText = "☀️";
        page.style.background = "linear-gradient(to bottom, #fddb92, #d1fdff)";
    } else if (wind > 20) {
        icon.innerText = "🌬️";
        page.style.background = "linear-gradient(to bottom, #cfd9df, #e2ebf0)";
    } else {
        icon.innerText = "⛅";
        page.style.background = "linear-gradient(to bottom, #a1c4fd, #c2e9fb)";
    }

    card.classList.remove("hidden");
}

function addFavorite() {
    const favs = getFavorites();
    if (!favs.includes(currentCity)) {
        favs.push(currentCity);
        saveFavorites(favs);
        renderFavorites();
    }
}

function renderFavorites() {
    const list = document.getElementById("favoritesList");
    list.innerHTML = "";
    getFavorites().forEach(city => {
        const li = document.createElement("li");
        li.textContent = city;
        list.appendChild(li);
    });
}

renderFavorites();
