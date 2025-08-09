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
    getcity(latitude,longitude);
}

function handleError(error) {
    alert("Error"+error);
}
function getcity(latitude,longitude){
    const promise = fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=56c2fdffa8f9da09b4f2e0b9f421bc03&units=metric`);
    promise.then(response=>response.json())
    .then(result=>{
        let now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds()
        let time=hours+":"+minutes+":"+seconds;
        let day = now.getDate();
        let month = now.getMonth() + 1; // Months are 0-based
        let year = now.getFullYear();
        let date = day+"-"+month+"-"+year;
        document.getElementById("humidity").innerHTML=result["main"]["humidity"];
        document.getElementById("time").innerHTML=time;
        document.getElementById("date").innerHTML=date;
        document.getElementById("tmp").innerHTML= result["main"]["temp"]+"<sup>o</sup>celcius";
        document.getElementById("desc").innerHTML= result["weather"][0]["description"];
        document.getElementById("area").innerHTML = result["name"];
        getfivedayforecast(latitude,longitude);
    })
    .catch(error=>alert(error));
}

function addcity(){
    let city= document.getElementById("city");
    let cityin = document.getElementById("cityinput");
    let opt= document.createElement("option");
    opt.innerHTML=cityin.value();
    city.appendChild(opt);
}

function disptable(){
    document.getElementById("weeklyforecast").style.display="table";
}
function getfivedayforecast(latitude,longitude){
    let i=0;
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
    var forecast=[];
    var datearray = [];
    const promise = fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=56c2fdffa8f9da09b4f2e0b9f421bc03&units=metric`);
    promise.then(response=>response.json())
    .then(result=>{
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
    }).catch(error=>alert(error));
}

function callback(forecast,datearray){
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