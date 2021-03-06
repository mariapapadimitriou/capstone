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

const pSBC=(p,c0,c1,l)=>{
  let r,g,b,P,f,t,h,i=parseInt,m=Math.round,a=typeof(c1)=="string";
  if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))return null;
  if(!this.pSBCr)this.pSBCr=(d)=>{
      let n=d.length,x={};
      if(n>9){
          [r,g,b,a]=d=d.split(","),n=d.length;
          if(n<3||n>4)return null;
          x.r=i(r[3]=="a"?r.slice(5):r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1
      }else{
          if(n==8||n==6||n<4)return null;
          if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");
          d=i(d.slice(1),16);
          if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=m((d&255)/0.255)/1000;
          else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1
      }return x};
  h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=this.pSBCr(c0),P=p<0,t=c1&&c1!="c"?this.pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;
  if(!f||!t)return null;
  if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);
  else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);
  a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;
  if(h)return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";
  else return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)
}

Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

function validate(e, id) {
  if (!/^[a-zA-Z0-9 ]+$/.test(e.value) & document.getElementById(id).value.length > 0) {
    document.getElementById(id).value = document.getElementById(id).value.slice(0, document.getElementById(id).value.length-1)
    document.getElementById(id+"-valid-chars").innerHTML = "Input must contain only letters or numbers."
  }
}

function getCoords(i){
  save_routes = []
  save_id = []
  var routeid = draw.getAll().features[i].id
  var coords = id_coords[routeid].coordinates
  save_id.push(routeid)
  save_routes.push([coords[0], coords[coords.length-1]])
}

window.onclick = function(event) {
if(event.target.className == "modal") {
  event.target.style.display = "none";
}
}

document.getElementById('status-cancel').onclick =  function(e){
  e.preventDefault();
  document.getElementById('status-popup').style.display = "none";
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function toggle(id, objarray) {

  if (dropdown_click[id] == 1) {
    objarray[id] = 0
  }
  else {
    objarray[id] = 1
  }
}

function getButtonColour(clr, type) {
  if(type=="share") {
    return clr
  }
  else if (type=="strip") {
    return pSBC(-0.5, clr)
  }
  else {
    return pSBC(-0.8, clr)
  }
}

document.getElementById("how-to-btn").addEventListener("click", function() {

  if (document.getElementById("how-to-btn").style.color == "black") {
    document.getElementById("how-to-text").style.display = "block"
    document.getElementById("how-to-box").style.display = "block"
    document.getElementById("how-to-btn").style.color = "#808080"
  }
  else {
    document.getElementById("how-to-text").style.display = "none"
    document.getElementById("how-to-box").style.display = "none"
    document.getElementById("how-to-btn").style.color = "black"
  }
});

document.getElementById("close-how-to-btn").addEventListener("click", function() {

  document.getElementById("how-to-text").style.display = "none"
  document.getElementById("how-to-box").style.display = "none"
  document.getElementById("how-to-btn").style.color = "black"
  
});