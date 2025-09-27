
const API_KEY="3ae2eb4141f48d89996c125a4469f5d6"
const userTab=document.querySelector(".userWeather")
const searchTab=document.querySelector(".searchWeather")
const UserContainer=document.querySelector(".weather-container")
const GrantAccessContainer=document.querySelector(".grant-location-container")
const searchform=document.querySelector(".data-search-from")
const loadingScreen=document.querySelector(".loading-container")
const UserInfoContainer=document.querySelector(".user-info-container")

let currentTab=userTab;
currentTab.classList.add("current-tab");
getfromSessionStorage();
function switchTab(clickedTab)
{
    if(clickedTab!==currentTab){
          currentTab.classList.remove("current-tab");
          currentTab=clickedTab;
          currentTab.classList.add("current-tab");

         if(!searchform.classList.contains("active"))
         {
            UserInfoContainer.classList.remove("active");
            GrantAccessContainer.classList.remove("active");
            searchform.classList.add("active");
         }
         else {
            // main pahle search  wale tab par tha ab usko invisible krana hoga
            searchform.classList.remove("active");
            UserInfoContainer.classList.remove("active");
            notFound.classList.remove("active");
            // ab main your weather tab me aagya hoo ,toh weather bhi display karna padega let's check first 
            // for coordinates if we  haved saved them there,
            getfromSessionStorage();

         }  
        }
    
}
// ek kaam
userTab.addEventListener("click",()=>{
    switchTab(userTab);
});

searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
});

function  getfromSessionStorage(){
    //check if coordinate stored or not
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        GrantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchWeatherDetailbylonAndLat(coordinates);
    }
}

async function fetchWeatherDetailbylonAndLat(coordinates)
{
     const {lat,lon}=coordinates;
     // makes grant container invisible
     notFound.classList.remove("active");
     GrantAccessContainer.classList.remove("active");
     loadingScreen.classList.add("active");
    try{
        
    const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

    const data=await response.json();
     loadingScreen.classList.remove("active");
     UserInfoContainer.classList.add("active");
         renderUserInfoUser(data);
          console.log("Weather data-" ,data);
    
    

    
    }
    catch(e)
    {
         loadingScreen.classList.remove("active");
        notFound.classList.add("active"); // Also show error on network failure
        console.log("Error fetching city weather", e);
    }

}

function renderUserInfoUser(weatherInfo) {
    const cityName = document.querySelector(".data-cityName");
    const countryIcon = document.querySelector(".data-countryIcon");
    const desc = document.querySelector(".data-weather-description");
    const weatherIcon = document.querySelector(".data-weather-icon");
    const temp = document.querySelector(".data-weather-temp");
    const humidity = document.querySelector(".data-humidity");
    const windspeed = document.querySelector(".data-windspeed");
    const clouds = document.querySelector(".data-clouds");

    cityName.innerText = weatherInfo?.name || "N/A";
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country?.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description || "N/A";
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;

    // Convert Kelvin → Celsius properly
    temp.innerText=`${(weatherInfo?.main?.temp.toFixed(2))} °C`;

   windspeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    clouds.innerText = `${weatherInfo?.clouds?.all}%`;
}


function renderUserInfoSearch(weatherInfo) {
    const cityName = document.querySelector(".data-cityName");
    const countryIcon = document.querySelector(".data-countryIcon");
    const desc = document.querySelector(".data-weather-description");
    const weatherIcon = document.querySelector(".data-weather-icon");
    const temp = document.querySelector(".data-weather-temp");
    const humidity = document.querySelector(".data-humidity");
    const windspeed = document.querySelector(".data-windspeed");
    const clouds = document.querySelector(".data-clouds");

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.textContent = `${(weatherInfo?.main?.temp - 273.15).toFixed(2)} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    clouds.innerText = `${weatherInfo?.clouds?.all}%`;
}



function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition)
    }
    else{
        alert("No geoLocation found")
        
    }
}
function showPosition(position)
{
    const userCoordinates={
       lat:position.coords.latitude,
       lon:position.coords.longitude};

      sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
      fetchWeatherDetailbylonAndLat(userCoordinates);
}

const grantAccessBtn=document.querySelector(".data-grantAccess");
grantAccessBtn.addEventListener("click",getLocation)
const searchItem = document.querySelector(".data-search-input");

searchform.addEventListener("submit" ,(e)=>{
    e.preventDefault();
    

    let city=searchItem.value;
    if(city==="") return ;

    fetchWeatherDetailByCity(city);
})

const notFound= document.querySelector(".not-found-container");




async function fetchWeatherDetailByCity(city) {
    // Hide the previous weather info and the 'not found' message
    UserInfoContainer.classList.remove("active");
    notFound.classList.remove("active");
    
    loadingScreen.classList.add("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");

        // The API returns a "404" code when the city is not found
        if (data?.cod === "404") {
            notFound.classList.add("active");
        } else {
            // Make the weather info visible and render the data
            UserInfoContainer.classList.add("active");
            renderUserInfoUser(data); // Using your existing render function
        }
    } catch (e) {
        loadingScreen.classList.remove("active");
        notFound.classList.add("active"); // Also show error on network failure
        console.log("Error fetching city weather", e);
    }
}