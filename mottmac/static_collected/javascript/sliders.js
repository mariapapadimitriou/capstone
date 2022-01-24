// SHARROWS COST SLIDER

const sharrows_cost_slider_1 = document.getElementById("sharrows_cost_slider_1");
const sharrows_cost_slider_2 = document.getElementById("sharrows_cost_slider_2");
const sharrows_cost_range_1 = document.getElementById("sharrows_cost_range_1");
const sharrows_cost_range_2 = document.getElementById("sharrows_cost_range_2");
const sharrows_cost_track = document.querySelector(".sharrows_cost_track");
const sharrows_cost_slider_max = document.getElementById("sharrows_cost_slider_1").max;

function sharrowsCostSlide1(){
    if(parseInt(sharrows_cost_slider_2.value) - parseInt(sharrows_cost_slider_1.value) <= 0){
        sharrows_cost_slider_1.value = parseInt(sharrows_cost_slider_2.value);
    }
    sharrows_cost_range_1.innerHTML = numbertoCurrency(-sharrows_cost_slider_1.value);
    fillColor(sharrows_cost_slider_1, sharrows_cost_slider_2, sharrows_cost_slider_max, sharrows_cost_track);
}

function sharrowsCostSlide2(){
    if(parseInt(sharrows_cost_slider_2.value) - parseInt(sharrows_cost_slider_1.value) <= 0){
        sharrows_cost_slider_2.value = parseInt(sharrows_cost_slider_1.value);
    }
    sharrows_cost_range_2.innerHTML = numbertoCurrency(-sharrows_cost_slider_2.value);
    fillColor(sharrows_cost_slider_1, sharrows_cost_slider_2, sharrows_cost_slider_max, sharrows_cost_track);
}

// STRIPED COST SLIDER 

const striped_cost_slider_1 = document.getElementById("striped_cost_slider_1");
const striped_cost_slider_2 = document.getElementById("striped_cost_slider_2");
const striped_cost_range_1 = document.getElementById("striped_cost_range_1");
const striped_cost_range_2 = document.getElementById("striped_cost_range_2");
const striped_cost_track = document.querySelector(".striped_cost_track");
const striped_cost_slider_max = document.getElementById("striped_cost_slider_1").max;

function stripedCostSlide1(){
    if(parseInt(striped_cost_slider_2.value) - parseInt(striped_cost_slider_1.value) <= 0){
        striped_cost_slider_1.value = parseInt(striped_cost_slider_2.value);
    }
    striped_cost_range_1.innerHTML = numbertoCurrency(-striped_cost_slider_1.value);
    fillColor(striped_cost_slider_1, striped_cost_slider_2, striped_cost_slider_max, striped_cost_track);
}

function stripedCostSlide2(){
    if(parseInt(striped_cost_slider_2.value) - parseInt(striped_cost_slider_1.value) <= 0){
        striped_cost_slider_2.value = parseInt(striped_cost_slider_1.value);
    }
    striped_cost_range_2.innerHTML = numbertoCurrency(-striped_cost_slider_2.value);
    fillColor(striped_cost_slider_1, striped_cost_slider_2, striped_cost_slider_max, striped_cost_track);
}

// PROTECT COST SLIDER 

const protected_cost_slider_1 = document.getElementById("protected_cost_slider_1");
const protected_cost_slider_2 = document.getElementById("protected_cost_slider_2");
const protected_cost_range_1 = document.getElementById("protected_cost_range_1");
const protected_cost_range_2 = document.getElementById("protected_cost_range_2");
const protected_cost_track = document.querySelector(".protected_cost_track");
const protected_cost_slider_max = document.getElementById("protected_cost_slider_1").max;

function protectedCostSlide1(){
    if(parseInt(protected_cost_slider_2.value) - parseInt(protected_cost_slider_1.value) <= 0){
        protected_cost_slider_1.value = parseInt(protected_cost_slider_2.value);
    }
    protected_cost_range_1.innerHTML = numbertoCurrency(-protected_cost_slider_1.value);
    fillColor(protected_cost_slider_1, protected_cost_slider_2, protected_cost_slider_max, protected_cost_track);
}

function protectedCostSlide2(){
    if(parseInt(protected_cost_slider_2.value) - parseInt(protected_cost_slider_1.value) <= 0){
        protected_cost_slider_2.value = parseInt(protected_cost_slider_1.value);
    }
    protected_cost_range_2.innerHTML = numbertoCurrency(-protected_cost_slider_2.value);
    fillColor(protected_cost_slider_1, protected_cost_slider_2, protected_cost_slider_max, protected_cost_track);
}

// % BIKE COMMUTERS SLIDER

const bike_commuters_slider_1 = document.getElementById("bike_commuters_slider_1");
const bike_commuters_slider_2 = document.getElementById("bike_commuters_slider_2");
const bike_commuters_range_1 = document.getElementById("bike_commuters_range_1");
const bike_commuters_range_2 = document.getElementById("bike_commuters_range_2");
const bike_commuters_track = document.querySelector(".bike_commuters_track");
const bike_commuters_slider_max = document.getElementById("bike_commuters_slider_1").max;

function bikeCommutersSlide1(){
    if(parseInt(bike_commuters_slider_2.value) - parseInt(bike_commuters_slider_1.value) <= 0){
        bike_commuters_slider_1.value = parseInt(bike_commuters_slider_2.value);
    }
    bike_commuters_range_1.innerHTML = numbertoPercentage(bike_commuters_slider_1.value);
    fillColor(bike_commuters_slider_1, bike_commuters_slider_2, bike_commuters_slider_max, bike_commuters_track);
}

function bikeCommutersSlide2(){
    if(parseInt(bike_commuters_slider_2.value) - parseInt(bike_commuters_slider_1.value) <= 0){
        bike_commuters_slider_2.value = parseInt(bike_commuters_slider_1.value);
    }
    bike_commuters_range_2.innerHTML = numbertoPercentage(bike_commuters_slider_2.value);
    fillColor(bike_commuters_slider_1, bike_commuters_slider_2, bike_commuters_slider_max, bike_commuters_track);
}

// % NEW RIDERS

const modal_shift_slider_1 = document.getElementById("modal_shift_slider_1");
const modal_shift_slider_2 = document.getElementById("modal_shift_slider_2");
const modal_shift_range_1 = document.getElementById("modal_shift_range_1");
const modal_shift_range_2 = document.getElementById("modal_shift_range_2");
const modal_shift_track = document.querySelector(".modal_shift_track");
const modal_shift_slider_max = document.getElementById("modal_shift_slider_1").max;

function modalShiftSlide1(){
    if(parseInt(modal_shift_slider_2.value) - parseInt(modal_shift_slider_1.value) <= 0){
        modal_shift_slider_1.value = parseInt(modal_shift_slider_2.value);
    }
    modal_shift_range_1.innerHTML = numbertoPercentage(modal_shift_slider_1.value);
    fillColor(modal_shift_slider_1, modal_shift_slider_2, modal_shift_slider_max, modal_shift_track);
}

function modalShiftSlide2(){
    if(parseInt(modal_shift_slider_2.value) - parseInt(modal_shift_slider_1.value) <= 0){
        modal_shift_slider_2.value = parseInt(modal_shift_slider_1.value);
    }
    modal_shift_range_2.innerHTML = numbertoPercentage(modal_shift_slider_2.value);
    fillColor(modal_shift_slider_1, modal_shift_slider_2, modal_shift_slider_max, modal_shift_track);
}

// SAVED CO2

const emissions_slider_1 = document.getElementById("emissions_slider_1");
const emissions_slider_2 = document.getElementById("emissions_slider_2");
const emissions_range_1 = document.getElementById("emissions_range_1");
const emissions_range_2 = document.getElementById("emissions_range_2");
const emissions_track = document.querySelector(".emissions_track");
const emissions_slider_max = document.getElementById("emissions_slider_1").max;

function emissionsSlide1(){
    if(parseInt(emissions_slider_2.value) - parseInt(emissions_slider_1.value) <= 0){
        emissions_slider_1.value = parseInt(emissions_slider_2.value);
    }
    emissions_range_1.innerHTML = numbertoGPerKm(emissions_slider_1.value);
    fillColor(emissions_slider_1, emissions_slider_2, emissions_slider_max, emissions_track);
}

function emissionsSlide2(){
    if(parseInt(emissions_slider_2.value) - parseInt(emissions_slider_1.value) <= 0){
        emissions_slider_2.value = parseInt(emissions_slider_1.value);
    }
    emissions_range_2.innerHTML = numbertoGPerKm(emissions_slider_2.value);
    fillColor(emissions_slider_1, emissions_slider_2, emissions_slider_max, emissions_track);
}

function fillColor(s1,s2, m, track){
    percent1 = (s1.value / m) * 100;
    percent2 = (s2.value / m) * 100;
    track.style.background = `linear-gradient(to right, #dadae5 ${percent1}% , #5a5c69 ${percent1}% , #5a5c69 ${percent2}%, #dadae5 ${percent2}%)`;
}

sharrowsCostSlide1();
sharrowsCostSlide2();

stripedCostSlide1();
stripedCostSlide2();

protectedCostSlide1();
protectedCostSlide2();

bikeCommutersSlide1();
bikeCommutersSlide2();

modalShiftSlide1();
modalShiftSlide2();

emissionsSlide1();
emissionsSlide2();

updateCharts();