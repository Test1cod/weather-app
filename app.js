const form=document.querySelector("#weather-form");
const input=document.querySelector("#city-input");
const weatherBox=document.querySelector("#weather");

const API_KEY = "006453a0bc0be4d59dc1c590056a7559";

form.addEventListener("submit", async (e)=>{
    e.preventDefault();

    const city=input.value.trim();
    if (!city)
        {
            weatherBox.textContent = "نام شهر را وارد کن 🙂";
            return
        };

    weatherBox.innerHTML=`<p class="loading">در حال دریافت اطلاعات...</p>`;

    try{
        const res=await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=fa`
        );
    

    if (!res.ok){
        weatherBox.textContent="شهر پیدا نشد 😥";
        return;
    }

    const data=await res.json();

    const icon=data.weather[0].icon;

    weatherBox.innerHTML = `
      <h2>${data.name}</h2>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" />
      <p>${data.weather[0].description}</p>
      <p>دما: ${data.main.temp}°</p>
      <p>رطوبت: ${data.main.humidity}%</p>
    `;
    localStorage.setItem("lastcity",city);

    }
    catch(err){
    weatherBox.textContent="خطا! دوباره تلاش کن";
    }

    input.value="";
});
const savedcity = localStorage.getItem("lastcity");

if (savedcity) {
  input.value = savedcity;
  form.dispatchEvent(new Event("submit"));
}
