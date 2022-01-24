function numbertoCurrency(x) {

    var location_id = document.getElementById("locationpicker").value;
    var currency = {1: "$", 2:"£"}

    if (x < 0) {
        return "-" + currency[location_id] + x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",").replace("-", "");
    }
    else {
        return currency[location_id] + x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }
  
  function numbertoComma(x) {
  
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  function numbertoPercentage(x) {
  
    return x.toString() + "%";
  }
  
  function numbertoGPerKm(x) {
  
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " g/km";
  }
  
  function numbertoKg(x) {
  
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " kg";
  }
  
  function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
  }
