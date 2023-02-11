let weatherAPIKey="731bc9ace7e7b1806fd4196dbf617b05";
let WeatherBasedEndPoint="https://api.openweathermap.org/data/2.5/weather? &appid="+weatherAPIKey+"&units=metric";
let foreCastBasedEndPoint="https://api.openweathermap.org/data/2.5/forecast?appid="+weatherAPIKey+"&units=metric";
let GeoBasedEndPoint="http://api.openweathermap.org/geo/1.0/direct?limit=5&appid="+weatherAPIKey+"&q=";
let LocationBasedEndPoint="http://api.openweathermap.org/geo/1.0/reverse?limit=10&appid="+weatherAPIKey;
let dataList=document.querySelector("#suggestion");
let inputCityName=document.querySelector(".weather_search>.weather_search");
let city=document.querySelector(".weather_city");
let day=document.querySelector(".weather_day");
let humidity=document.querySelector(".weather_indicator_humidity>.value");
let  wind=document.querySelector(".weather_indicator_wind>.value");
let pressure=document.querySelector(".weather_indicator_pressure>.value")
let images=document.querySelector(".weather_image");
let temprature=document.querySelector(".wether_temprature>.value");
let ForeCastBlock=document.querySelector(".weather_forecast");

let weatherImages=
[
    {
        url:"images/broken-clouds.png",
        ids:[803,804]
    },
    {
        url:"images/clear-sky.png",
        ids:[800]
    },
    {
        url:"images/few-clouds.png",
        ids:[801]
    },
    {
        url:"images/mist.png",
        ids:[701,711,721,731,741,751,761,762,771,781]
    },
    {
        url:"images/rain.png",
        ids:[500,501,502,503,504]
    },
    {
      url:"images/scattered-clouds.png",
      ids:[802]
    },
    {
        url:"images/shower-rain.png",
        ids:[520,521,522,531,300,301,302,310,311,312,313,314,321]
    },
    {
        url:"images/snow.png",
        ids:[511,600,601,602,611,612,613,615,616,620,621,620],
    },
    {
        url:"images/thunderstorm.png",
        ids:[200,201,202,210,211,212,221,230,231,232 ]
    },
]
 async function callWeatherByCityName(city)
{
   let endpoint=WeatherBasedEndPoint+"&q="+city;
   let response= await fetch(endpoint);
    let weather=await response.json();
    return weather;
    
}
async function callweatherForeCastBYId(id)
{
    let endpoint=foreCastBasedEndPoint+"&id="+id;
    let result= await fetch(endpoint);
    let data= await result.json();
    let forecastArr=[];
    let forecastListArr=data.list;
    forecastListArr.forEach((list)=>
    {
        let date=list.dt_txt;
        date=date.replace(" ","T")
         let today=new Date(date);
         let hours=today.getHours();
         if(hours===9)
         {
            forecastArr.push(list);
         }
        
      
    })
    return forecastArr;
    
}
 function updateWeather(weather)
 {   
    // console.log(weather);
    city.innerText=weather.name;
   day.innerText= getDate();
   humidity.innerText=weather.main.humidity;
   pressure.innerText=weather.main.pressure;
   let windDirection;
    let deg=weather.wind.deg;
    if(deg>45 && deg<=135)
    {
        windDirection="East";
    }
    else if(deg>135 && deg<=225)
    {
        windDirection="south";
    }
    else if(deg>225 && deg<=315)
    {
        windDirection="West";

    }
    else
    {
        windDirection="North";
    }
    wind.innerText=windDirection+","+weather.wind.speed;
   temprature.innerText=weather.main.temp>0?"+"+Math.round(weather.main.temp):Math.round(weather.main.temp);
   let imgId=weather.weather[0].id;
   weatherImages.forEach((object)=>
   {
      if(object.ids.indexOf(imgId)!=-1)
      {
       images.src=object.url;
      }
      
   });

   
   
 };
 function updateForeCastWeather(forecastArr)
 {
 
   ForeCastBlock.innerHTML="";
   let forecastItem="";
   forecastArr.forEach((data)=>
   {
       let icon=data.weather[0].icon;
       let imglink="http://openweathermap.org/img/wn/"+icon+"@2x.png";
       
       let forecastTemp=data.main.temp>0?"+"+Math.round(data.main.temp):Math.round(data.main.temp);
      
       let dayinSeconds=data.dt;
       let miliseconds=dayinSeconds*1000;
       let date=new Date(miliseconds);
       let day= date.toLocaleDateString("en-En",{weekday:"long"});
       
      forecastItem+=`
          
    <div class="col-xs-12 col-sm-6 col-md-4 col-lg">        
        <div class="card weather_forecast_item text-center">
          <img src="${imglink}" alt="${data.weather[0].description}" class="weather_forecast_icon card-img-top img-fluid">
            <div class="card-body">
            <h4 class="card-title weathe_forecast_day"> ${day}</h4>
            <p class="weather_forecast_temprature"><span class="value card-subtitle">${forecastTemp}</span>&deg;C</p>
            </div>
      </div>  
    </div>
                
        `;
      
})
  
  ForeCastBlock.innerHTML=forecastItem;
   
 }
 function getDate()
 {
    let date=new Date();
    let today=date.toLocaleDateString("en-En",{weekday:"long"});
    return today;
 }
  async function weatherForCity(city)
 {
    let weather= await callWeatherByCityName(city);
    if(weather.cod=="404")
    {
      swal({icon:"error",title:"Error",text:"You Entered Wrong City"})
    }
        updateWeather(weather);
        let forecast= await callweatherForeCastBYId(weather.id);
         updateForeCastWeather(forecast);
 }
inputCityName.addEventListener("keydown", (e)=>
{
    if(e.keyCode===13)
    {
        weatherForCity(inputCityName.value);
    }
});
inputCityName.addEventListener("input",async ()=>
{
    if(inputCityName.value.length>2)
    {
        let endpoint=GeoBasedEndPoint+inputCityName.value;
        let response=await fetch(endpoint);
        let result= await response.json();
         result.forEach((city)=>
         {
            let option=document.createElement("option");
            option.value=`${city.name},${city.country}${city.state?"," +city.state:" "},`;
            dataList.appendChild(option);
            
         })
        
}
   
})

window.onload=()=>
{
    let options={enableHighFrequency:true}
   navigator.geolocation.getCurrentPosition(async (pos)=>
   {
    let crd=pos.coords;
    let lat=crd.latitude;
    let lon=crd.longitude;
    console.log(lat+" "+lon);
   
    let endpoint=LocationBasedEndPoint+"&lat="+lat+"&lon="+lon;
    let response= await  fetch(endpoint);
    let result= await response.json();
    result.forEach(async (city)=>
    {
        let weather= await callWeatherByCityName(city.name);
        updateWeather(weather);
        let forecast= await callweatherForeCastBYId(weather.id);
         updateForeCastWeather(forecast);
    })
    
    
   }, error,options);
   function error(){

   }

};