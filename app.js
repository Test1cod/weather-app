const form=document.querySelector("#weather-form");
const input=document.querySelector("#city-input");
const weatherBox=document.querySelector("#weather");

const API_KEY = "?";

form.addEventListener("submit", async (e)=>{
    e.preventDefault();

    const city=input.value.trim();
    if (!city)
        {
            weatherBox.textContent = "نام شهر را وارد کن 🙂";
            return
        };

    weatherBox.innerHTML = `
    <div class="loading">
    <div class="spinner"></div>
    <span>در حال دریافت اطلاعات...</span>
    </div>
    `;



    try{
        const res=await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=fa`
        );
    

    if (!res.ok) {
    if (res.status === 404) {
      weatherBox.textContent = "شهر پیدا نشد 😥";
    } else {
      weatherBox.textContent = "مشکلی پیش اومده — دوباره امتحان کن";
    }
    return;
    }

    const data=await res.json();

    const timezoneOffset=data.timezone*1000;
    const utc = Date.now() + new Date().getTimezoneOffset() * 60000;
    const localTime = new Date(utc + timezoneOffset);

    const options={
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    };
    const formattedTime = localTime.toLocaleString("fa-IR", options);

    const temp=data.main.temp;
    document.body.classList.remove("warm","cold","normal");
    
    if (temp <= 10) {
    document.body.classList.add("cold");
    } else if (temp >= 25) {
    document.body.classList.add("warm");
    } else {
    document.body.classList.add("normal");
    }

    const country=data.sys.country;

    const icon=data.weather[0].icon;

    weatherBox.innerHTML = `
      <h2>${data.name},${country}</h2>
      <p class="time">${formattedTime}</p>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" />
      <p>${data.weather[0].description}</p>
      <p>دما: °${data.main.temp}</p>
      <p>احساس دما: °${data.main.feels_like}</p>
      <p>رطوبت: %${data.main.humidity}</p>
      <p>m/sسرعت باد: ${data.wind.speed}</p>
    `;
    localStorage.setItem("lastcity",city);

    }
    catch(err){
        weatherBox.textContent = "❌ اتصال اینترنت بررسی شود";
    }

    input.value="";
    fetchForecast(city);

});

const savedcity = localStorage.getItem("lastcity");

if (savedcity) {
  input.value = savedcity;
  form.dispatchEvent(new Event("submit"));
}

async function fetchForecast(city) {
  const forecastBox = document.querySelector("#forecast");
  forecastBox.innerHTML = "<p>در حال دریافت پیش‌بینی...</p>";

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=fa`
    );

    if (!res.ok) {
      forecastBox.textContent = "پیش‌بینی در دسترس نیست";
      return;
    }

    const data = await res.json();

    // انتخاب ۱ دیتا از هر روز (مثلاً حوالی 12 ظهر)
    const daily = [];

    data.list.forEach(item => {
      if (item.dt_txt.includes("12:00:00")) {
        daily.push(item);
      }
    });

    forecastBox.innerHTML = `
      <h3>پیش‌بینی ۵ روز آینده</h3>
      <div class="forecast-grid">
        ${daily
          .map(day => {
            const date = new Date(day.dt_txt);
            const icon = day.weather[0].icon;

            return `
              <div class="card">
                <p>${date.toLocaleDateString("fa-IR")}</p>
                <img src="https://openweathermap.org/img/wn/${icon}.png" />
                <p>${day.weather[0].description}</p>
                <p>${Math.round(day.main.temp)}°</p>
              </div>
            `;
          })
          .join("")}
      </div>
    `;
  } catch {
    forecastBox.textContent = "❌ خطا در دریافت پیش‌بینی";
  }
}
