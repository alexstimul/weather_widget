let ready = (callback) => {
    if (document.readyState != "loading") callback();
    else document.addEventListener("DOMContentLoaded", callback);
}

let uniqueKey = "c3c9bc2dbd005c196bdc734eb55c6111";
let xhr = new XMLHttpRequest();
let cities = new Map();

let weather = document.getElementById("weather");
ready(() => {
    fetch("current.city.list.json")
        .then(  
            function(response) {  
                if (response.status !== 200) {  
                    console.log('Looks like there was a problem. Status Code: ' +  
                    response.status);  
                    return;  
                }
                response.json().then(function(data) {
                    let check = document.getElementById("list-town");
                    let checkboxs = '';
                    let selected = "RU";
                    for (let key in data){
                        if (data[key].country == selected) {
                            cities.set(data[key].id, [true, data[key].name]);
                            if (check.childElementCount == 0) {
                                checkboxs += fillModal(true, data[key].id, data[key].name);
                            }
                        }
                    }
                    let list = document.getElementById("city");
                    list.innerHTML = fillCities();

                    if (check.childElementCount == 0) {
                        let checkboxList = document.getElementById('list-town');
                        checkboxList.innerHTML = checkboxs;
                    }
                    
                    $('.city .current-city').eq(0).addClass('active expandUp').fadeIn(1000);
                    getRequest(list.firstChild.getAttribute('value'));
                    $('.temperature').addClass('active').fadeIn(1000);
                    $('.numbers').addClass('active expandUpDown').fadeIn(1000);
                    setInterval('blockAnimate();', 5000);
                });  
            }  
        )  
        .catch(function(err) {  
            console.log('Fetch Error :-S', err);  
        });

    let link = document.getElementById('settings');
    link.onclick = function () {
        let bg = document.getElementById('overlay');
        let modal = document.getElementById('towns');
        bg.style.display = "block";
        requestAnimationFrame(() => bg.style.opacity = 1);
        modal.style.display = "block";
        requestAnimationFrame(() => modal.style.opacity = 1);
    }

    let close = document.getElementById('close');
    close.onclick = function () {
        hideModal();
    }

    let form = document.getElementById('settings-town');
    form.onsubmit = function () {
        hideModal();
        changeTowns();
    }
});

function blockAnimate() {
    let length = document.querySelectorAll('.current-city').length - 1;

    let list = document.querySelectorAll('.current-city');
    for (let i = 0; i <= length; i++) {
        if (i < length && list[i].classList.contains('active')) {
            $('.temperature').removeClass('active').fadeOut(1000);
            $(list[i]).removeClass('active expandUp').addClass('slideDown').fadeOut(1000);
            $('.numbers').removeClass('active expandUpDown').addClass('slideDownNum').fadeOut(1000);
            setTimeout(getRequest, 1000, list[i + 1].getAttribute('value'));
            setTimeout(show, 1000, list[i + 1]);
            return false;
        } else if (i == length) {
            cur = document.getElementById('city');
            if (cur.childElementCount <= 1) {
                $(list[i]).removeClass('active').fadeOut(1000);
                cur.innerHTML = fillCities();
            }
            
            list = document.querySelectorAll('.current-city')
            $(list[0]).addClass('active').fadeIn(1000);
            getRequest(list[0].getAttribute('value'));
            return false;
        }
    }
};

function fillModal(value, id, name) {
    return `<input class="show-town" type="checkbox" checked="${value}" value="${id}">${name}<br>`;
}

function getRequest(id) {
    xhr.open('GET', `http://api.openweathermap.org/data/2.5/weather?id=${id}&appid=${uniqueKey}`);
    xhr.onload = function() {
        data = JSON.parse(xhr.responseText);
        let output = '';
        let temp = '';
        temp += '<span class="rot">' + Math.round(data.main.temp - 273)
                        + '&#176C' + '</span>'
                        + '<img src="https://openweathermap.org/img/wn/' 
                        + data.weather[0].icon 
                        + '@2x.png" class="clouds">';

        output += '<span class="number">' 
                        + data.main.humidity
                        + '%</span>';
        output += '<span class="number">'
                        + data.wind.speed
                        + 'м/с</span>';
        output += '<span class="number">'
                        + Math.round(data.main.pressure * 0.00750063755419211 * 100)
                        + 'мм.рт.ст</span>';;

        let temperature = document.getElementById('temperature');
        temperature.innerHTML = temp;
        let numbers = document.getElementById('numbers');
        numbers.innerHTML = output;
    };
    xhr.send();
}

function fillCities() {
    let output = '';

    for (let [key, value] of cities) {
        if (value[0] == true) { 
            output += "<div class=\"current-city\" value=\"" + key + "\">" + value[1] + "</div>";
        }
    }

    return output;
}

function hideModal() {
    let bg = document.getElementById('overlay');
    let modal = document.getElementById('towns');
    bg.style.display = "none";
    modal.style.display = "none";
}

function changeTowns() {
    let checks = document.getElementsByClassName('show-town');
    for (let i = 0; i < checks.length; i++) {
        cities.get(+checks[i].value)[0] = checks[i].checked;
    }

    let listTowns = document.getElementById('city');
    while (listTowns.firstChild)    {
        listTowns.removeChild(listTowns.firstChild);
    }

    listTowns.innerHTML = fillCities();
    listTowns.firstChild.style.display = "block";
    requestAnimationFrame(() => listTowns.firstChild.style.opacity = 1);
}

function show(el1) {
    $('.temperature').addClass('active').fadeIn(1000);
    $(el1).addClass('active expandUp').removeClass('slideDown').fadeIn(1000);  
    $('.numbers').addClass('active expandUpDown').removeClass('slideDownNum').fadeIn(1000);        
}