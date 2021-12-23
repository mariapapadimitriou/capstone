const sliderOne = document.getElementById("slider1");
const sliderTwo = document.getElementById("slider2");
const displayValOne = document.getElementById("range1");
const displayValTwo = document.getElementById("range2");
const minGap = 0;
const sliderTrack = document.querySelector(".slider-track1");
const sliderMaxValue = document.getElementById("slider1").max;

function slideOne(){
    if(parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap){
        sliderOne.value = parseInt(sliderTwo.value) - minGap;
    }
    displayValOne.textContent = sliderOne.value;
    fillColor();
}
function slideTwo(){
    if(parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap){
        sliderTwo.value = parseInt(sliderOne.value) + minGap;
    }
    displayValTwo.textContent = sliderTwo.value;
    fillColor();
}
function fillColor(){
    percent1 = (sliderOne.value / sliderMaxValue) * 100;
    percent2 = (sliderTwo.value / sliderMaxValue) * 100;
    sliderTrack.style.background = `linear-gradient(to right, #dadae5 ${percent1}% , #5a5c69 ${percent1}% , #5a5c69 ${percent2}%, #dadae5 ${percent2}%)`;
}

const sliderRide1 = document.getElementById("sliderRide1");
const sliderRide2 = document.getElementById("sliderRide2");
const displayValOneRide = document.getElementById("rangeRide1");
const displayValTwoRide = document.getElementById("rangeRide2");
const minGap2 = 0;
const sliderTrack2 = document.querySelector(".slider-track2");
const sliderMaxValue2 = document.getElementById("sliderRide1").max;

function slideOneRide(){
    if(parseInt(sliderRide2.value) - parseInt(sliderRide1.value) <= minGap2){
        sliderRide1.value = parseInt(sliderRide2.value) - minGap2;
    }
    displayValOneRide.textContent = sliderRide1.value;
    fillColor2();
}
function slideTwoRide(){
    if(parseInt(sliderRide2.value) - parseInt(sliderRide1.value) <= minGap2){
        sliderRide2.value = parseInt(sliderRide1.value) + minGap2;
    }
    displayValTwoRide.textContent = sliderRide2.value;
    fillColor2();
}
function fillColor2(){
    percent1Ride = (sliderRide1.value / sliderMaxValue2) * 100;
    percent2Ride = (sliderRide2.value / sliderMaxValue2) * 100;
    sliderTrack2.style.background = `linear-gradient(to right, #dadae5 ${percent1Ride}% , #5a5c69 ${percent1Ride}% , #5a5c69 ${percent2Ride}%, #dadae5 ${percent2Ride}%)`;
}

window.slideOne();
window.slideTwo();

window.slideOneRide();
window.slideTwoRide();