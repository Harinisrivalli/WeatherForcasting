document.addEventListener("DOMContentLoaded",function(){
    let cities= document.getElementById("city");
    const city=localStorage.getItem("city");
    const cityarr=JSON.parse(city);
    for(let i=0;i<cityarr;i++){
        let opt= document.createElement("option");
        opt.innerHTML=cityarr[i];
        console.log(opt);
        cities.appendChild(opt);
    }
    console.log(cities);
});

function selectloc(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, handleError);
    } else {
        alert("Location unavailable");
    }
}

function showPosition(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    getdatausinglatlong(latitude,longitude);
}

function handleError(error) {
    alert("Something Wrong with your Location access"+error);
}

var i=1;
var obj=[];
function addcity(cityin){
    let city= document.getElementById("city");
    let opt= document.createElement("option");
    if(obj.indexOf(cityin) == -1){
        obj.push(cityin);
        opt.innerHTML=cityin;
        city.appendChild(opt);
        i++;
        localStorage.setItem("city",JSON.stringify(obj));
    }
}

function disptable(){
    document.getElementById("weeklyforecast").style.display="table";
}

function getweatherdata(){
    let cityin = document.getElementById("cityinput").value;
    if(cityin==""){
        alert("Location cannot be empty");
        return;
    }
    setdateofweek();
    const promise = fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityin}&appid=56c2fdffa8f9da09b4f2e0b9f421bc03&units=metric`);
    promise.then(response=>response.json())
    .then(result=>{
        processResponse(result);
        addcity(cityin);
    }).catch(error=>alert("Invalid Location!!!"+error));
}

function setdateofweek(){
    let today = new Date();
    let first = new Date(today);
    first.setDate(today.getDate() + 1);
    document.getElementById("date1").innerHTML=first;

    let second = new Date(today);
    second.setDate(today.getDate()+2);
    document.getElementById("date2").innerHTML=second;

    let third = new Date(today);
    third.setDate(today.getDate()+3);
    document.getElementById("date3").innerHTML=third;

    let four = new Date(today);
    four.setDate(today.getDate()+4);
    document.getElementById("date4").innerHTML=four;

    let five = new Date(today);
    five.setDate(today.getDate()+5);
    document.getElementById("date5").innerHTML=five;
}

function getdatausinglatlong(latitude,longitude){
    let i=0;
    setdateofweek();
    const promise = fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=56c2fdffa8f9da09b4f2e0b9f421bc03&units=metric`);
    promise.then(response=>response.json())
    .then(result=>{
        processResponse(result);
    }).catch(error=>alert("Could not get your location!!!"+error));
}

function processResponse(result){
    var forecast=[];
    var datearray = [];
    document.getElementById("area").innerHTML=result["city"]["name"];
    document.getElementById("lat").innerHTML= result["city"]["coord"]["lat"];
    document.getElementById("long").innerHTML= result["city"]["coord"]["lon"];
    for(let day of result["list"]){
        let date=day["dt_txt"].split(" ")[0];
        if(!forecast[date]){
            let obj = {};
            obj["date"] = date;
            obj["description"]=day["weather"][0]["description"];
            obj["temperature"] = day["main"]["temp"];
            obj["humidity"] = day["main"]["humidity"];
            forecast[date]=obj;
            datearray.push(date);
        }
    }
    callback(forecast,datearray);
}

function callback(forecast,datearray){
    getbackgroundimage(forecast[datearray[0]].humidity,forecast[datearray[0]].temperature);
    document.getElementById("date").innerHTML=datearray[0];
    document.getElementById("tmp").innerHTML=forecast[datearray[0]].temperature+"<sup>o</sup>celcius";
    document.getElementById("humidity").innerHTML=forecast[datearray[0]].humidity;
    document.getElementById("desc").innerHTML= forecast[datearray[0]].description;
    

    document.getElementById("hmd1").innerHTML=forecast[datearray[1]].humidity;
    document.getElementById("desc1").innerHTML=forecast[datearray[1]].description;
    document.getElementById("tmp1").innerHTML= forecast[datearray[1]].temperature+"<sup>o</sup>celcius";

    document.getElementById("hmd2").innerHTML=forecast[datearray[2]].humidity;
    document.getElementById("desc2").innerHTML=forecast[datearray[2]].description;
    document.getElementById("tmp2").innerHTML= forecast[datearray[2]].temperature+"<sup>o</sup>celcius";

    document.getElementById("hmd3").innerHTML=forecast[datearray[3]].humidity;
    document.getElementById("desc3").innerHTML=forecast[datearray[3]].description;
    document.getElementById("tmp3").innerHTML= forecast[datearray[3]].temperature+"<sup>o</sup>celcius";

    document.getElementById("hmd4").innerHTML=forecast[datearray[4]].humidity;
    document.getElementById("desc4").innerHTML=forecast[datearray[4]].description;
    document.getElementById("tmp4").innerHTML= forecast[datearray[4]].temperature+"<sup>o</sup>celcius";

    document.getElementById("hmd5").innerHTML=forecast[datearray[5]].humidity;
    document.getElementById("desc5").innerHTML=forecast[datearray[5]].description;
    document.getElementById("tmp5").innerHTML= forecast[datearray[5]].temperature+"<sup>o</sup>celcius";

}

function viewmap(){
    // 1. Initialize map
    const map = L.map('map').setView([20.5937, 78.9629], 5); // India center

    // 2. Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);

    // 3. Marker variable
    let marker;

    // 4. Click event to get coordinates
    map.on('click', function(e) {
        const lat = e.latlng.lat.toFixed(6);
        const lng = e.latlng.lng.toFixed(6);

        // Remove old marker
        if (marker) {
        map.removeLayer(marker);
        }

        // Add new marker
        marker = L.marker([lat, lng]).addTo(map);
        getdatausinglatlong(lat,lng);
    });
}