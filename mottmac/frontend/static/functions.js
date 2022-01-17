function getValues(dic) {
    var vals = []
    for (var key in dic) {
      vals.push(dic[key])
    }
    return vals
}
  
function getKeys(dic) {
var keys = []
for (var key in dic) {
    keys.push(key)
}
return keys
}

function getNewColour() {
const touse = colours.filter(x => !getValues(id_colours).includes(x))[0]
return touse
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function arraySum(array) {
    var sum = 0
    for (let i=0; i < array.length; i++) {
      sum += array[i]
    }
    return sum
}