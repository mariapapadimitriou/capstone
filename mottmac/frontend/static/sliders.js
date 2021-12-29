const sliderOne = document.getElementById("slider1");
const sliderTwo = document.getElementById("slider2");
const displayValOne = document.getElementById("range1");
const displayValTwo = document.getElementById("range2");
const sliderTrack = document.querySelector(".slider-track1");
const sliderMaxValue = document.getElementById("slider1").max;

function slideOne(){
    if(parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= 0){
        sliderOne.value = parseInt(sliderTwo.value);
    }
    displayValOne.textContent = sliderOne.value;
    fillColor(sliderOne, sliderTwo, sliderMaxValue, sliderTrack);
    updateCharts()
}
function slideTwo(){
    if(parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= 0){
        sliderTwo.value = parseInt(sliderOne.value);
    }
    displayValTwo.textContent = sliderTwo.value;
    fillColor(sliderOne, sliderTwo, sliderMaxValue, sliderTrack);
    updateCharts()
}

const sliderRide1 = document.getElementById("sliderRide1");
const sliderRide2 = document.getElementById("sliderRide2");
const displayValOneRide = document.getElementById("rangeRide1");
const displayValTwoRide = document.getElementById("rangeRide2");
const sliderTrack2 = document.querySelector(".slider-track2");
const sliderMaxValue2 = document.getElementById("sliderRide1").max;

function slideOneRide(){
    if(parseInt(sliderRide2.value) - parseInt(sliderRide1.value) <= 0){
        sliderRide1.value = parseInt(sliderRide2.value) - 0;
    }
    displayValOneRide.textContent = sliderRide1.value;
    fillColor(sliderRide1, sliderRide2, sliderMaxValue2, sliderTrack2);
    updateCharts()
}
function slideTwoRide(){
    if(parseInt(sliderRide2.value) - parseInt(sliderRide1.value) <= 0){
        sliderRide2.value = parseInt(sliderRide1.value) + 0;
    }
    displayValTwoRide.textContent = sliderRide2.value;
    fillColor(sliderRide1, sliderRide2, sliderMaxValue2, sliderTrack2);
    updateCharts()
}

const sliderOne_striped = document.getElementById("slider1-striped");
const sliderTwo_striped = document.getElementById("slider2-striped");
const displayValOne_striped = document.getElementById("range1-striped");
const displayValTwo_striped = document.getElementById("range2-striped");
const sliderTrack_striped = document.querySelector(".slider-striped");
const sliderMaxValue_striped = document.getElementById("slider1-striped").max;

function slideOneStriped(){
    if(parseInt(sliderTwo_striped.value) - parseInt(sliderOne_striped.value) <= 0){
        sliderOne_striped.value = parseInt(sliderTwo_striped.value);
    }
    displayValOne_striped.textContent = sliderOne_striped.value;
    fillColor(sliderOne_striped, sliderTwo_striped, sliderMaxValue_striped, sliderTrack_striped);
    updateCharts()
}
function slideTwoStriped(){
    if(parseInt(sliderTwo_striped.value) - parseInt(sliderOne_striped.value) <= 0){
        sliderTwo_striped.value = parseInt(sliderOne_striped.value);
    }
    displayValTwo_striped.textContent = sliderTwo_striped.value;
    fillColor(sliderOne_striped, sliderTwo_striped, sliderMaxValue_striped, sliderTrack_striped);
    updateCharts()
}

const sliderOne_protect = document.getElementById("slider1-protect");
const sliderTwo_protect = document.getElementById("slider2-protect");
const displayValOne_protect = document.getElementById("range1-protect");
const displayValTwo_protect = document.getElementById("range2-protect");
const sliderTrack_protect = document.querySelector(".slider-protect");
const sliderMaxValue_protect = document.getElementById("slider1-protect").max;

function slideOneProtect(){
    if(parseInt(sliderTwo_protect.value) - parseInt(sliderOne_protect.value) <= 0){
        sliderOne_protect.value = parseInt(sliderTwo_protect.value);
    }
    displayValOne_protect.textContent = sliderOne_protect.value;
    fillColor(sliderOne_protect, sliderTwo_protect, sliderMaxValue_protect, sliderTrack_protect);
    updateCharts()
}
function slideTwoProtect(){
    if(parseInt(sliderTwo_protect.value) - parseInt(sliderOne_protect.value) <= 0){
        sliderTwo_protect.value = parseInt(sliderOne_protect.value);
    }
    displayValTwo_protect.textContent = sliderTwo_protect.value;
    fillColor(sliderOne_protect, sliderTwo_protect, sliderMaxValue_protect, sliderTrack_protect);
    updateCharts()
}


function fillColor(s1,s2, m, track){
    percent1 = (s1.value / m) * 100;
    percent2 = (s2.value / m) * 100;
    track.style.background = `linear-gradient(to right, #dadae5 ${percent1}% , #5a5c69 ${percent1}% , #5a5c69 ${percent2}%, #dadae5 ${percent2}%)`;
}

window.slideOne();
window.slideTwo();

window.slideOneRide();
window.slideTwoRide();

window.slideOneStriped();
window.slideTwoStriped();

window.slideOneProtect();
window.slideTwoProtect();