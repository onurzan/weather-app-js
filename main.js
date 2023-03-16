const wrapper = document.querySelector(".wrapper"),
inputPart = document.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
weatherPart = wrapper.querySelector(".weather-part"),
wIcon = wrapper.querySelector("img"),
arrowBack = wrapper.querySelector("header i");

let api;

inputField.addEventListener('keyup', e => {
    //if user pressed enter btn and input value is not empty
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", () =>{
    if(navigator.geolocation){ //if browser support geolocation api
        navigator.geolocation.getCurrentPosition(onSuccess, onError)
    } else{
        alert("Your browser not support geolocation api");
    }
});

function onSuccess(position){
    const {latitude, longitude} = position.coords; //getting lat and lot of the user device from coords obj
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    fetchData();
}

function onError(error){
    infoTxt.innerText = "User denied Geolocation";
    infoTxt.classList.add("error");
}

function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetchData();
}

function fetchData(){
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    //Getting api response and returning it with parsing into js obj and in another
    //then funct calling weatherDetails func with passing api result as an argument
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
        infoTxt.classList.replace ("pending", "error");
}

//**********SECRET = API Key*/////////////
var apiKey = "";

function weatherDetails(info){
    infoTxt.classList.replace("pending", "error");
    if(info.cod == "404"){
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    } else{
        // get required properties value from the info obj
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;

        infoTxt.classList.remove("pending", "error");
        wrapper.classList.remove("active");
        

        //using bs icons
        if(id == 800){
            wIcon.src = "icons/brightness-high.svg";
        } else if(id >= 200 && id <= 232){
            wIcon.src = "icons/cloud-rain-heavy.svg";
        } else if(id >= 600 && id <= 622){
            wIcon.src = "icons/cloud-snow.svg";
        } else if(id >= 701 && id <= 781){
            wIcon.src = "icons/cloud-haze2.svg";
        } else if(id >= 801 && id <= 804){
            wIcon.src = "icons/clouds.svg";
        } else if((id >= 300 && id <= 321) || (id >= 500 && id <= 531)){
            wIcon.src = "icons/cloud-rain-heavy.svg";
        }

        // particular html elements value
        wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
        wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText = `${humidity}%`;
        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");
        console.log(info);
    }    
}

arrowBack.addEventListener("click", () =>{
    wrapper.classList.remove("active");
});
