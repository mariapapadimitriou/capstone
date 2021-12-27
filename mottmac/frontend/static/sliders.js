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


function fillColor(s1,s2, m, track){
    percent1 = (s1.value / m) * 100;
    percent2 = (s2.value / m) * 100;
    track.style.background = `linear-gradient(to right, #dadae5 ${percent1}% , #5a5c69 ${percent1}% , #5a5c69 ${percent2}%, #dadae5 ${percent2}%)`;
}

window.slideOne();
window.slideTwo();

window.slideOneRide();
window.slideTwoRide();