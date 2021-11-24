import React, { Component } from "react";
<<<<<<< HEAD
import { MapContainer, TileLayer } from "react-leaflet";
import { Icon } from "leaflet";
import { render } from "react-dom";
=======
<<<<<<< HEAD
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Icon } from "leaflet";
import { render } from "react-dom";
import * as intersection_data from "../../static/data/subset_intersections_nodes.json";
//import * as bike_ways_data from "../../static/data/subset_bike_ways_nodes.json";

const marker = new Icon({
  iconUrl:"../../static/data/blue-circle.png",
  iconSize:[7,7]
})
=======
import { MapContainer, TileLayer } from "react-leaflet";
import { Icon } from "leaflet";
import { render } from "react-dom";
>>>>>>> main
>>>>>>> origin/john

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{width:'100%',height:'100%'}}>
          <MapContainer center={[43.6426, -79.3871]} zoom={12} style={{width:'100%',height:'100%'}}>
          <TileLayer
          url="https://api.mapbox.com/styles/v1/johnvolpatti/ckvvgtt4p28vi14ob4r1buo8o/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoiam9obnZvbHBhdHRpIiwiYSI6ImNrdnY2MzJnMjA1cDYydW9saHBpajFsZzkifQ.yWRTC-l5rfOh8ZDgGgxYDg"
          attribution="© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>"
          />
<<<<<<< HEAD
=======
<<<<<<< HEAD
          {intersection_data.elements.map(
          intersection => <Marker key={intersection.id} position ={[intersection.lat, intersection.lon]}
          icon={marker}/>)}
=======
>>>>>>> main
>>>>>>> origin/john
          </MapContainer>
      </div>
      )
  }
}

<<<<<<< HEAD
=======
<<<<<<< HEAD
//{intersection_data.elements.map(
  //intersection => <Marker key={intersection.id} position ={[intersection.lat, intersection.lon]}/>)}
=======
>>>>>>> origin/john
/*export default function App (){
    return (
    <Map center = {[45, -75]} zoom={12}>
        <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
    </Map>);
}*/
<<<<<<< HEAD
=======
>>>>>>> main
>>>>>>> origin/john

const appDiv = document.getElementById("app");
render(<App />, appDiv);