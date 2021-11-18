import React, { Component } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Icon } from "leaflet";
import { render } from "react-dom";
import * as intersection_data from "../../static/data/intersection_nodes.json";
//import * as bike_ways_data from "../../static/data/subset_bike_ways_nodes.json";

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
          {intersection_data.elements.map(
          intersection => <Marker key={intersection.id} position ={[intersection.lat, intersection.lon]}/>)}
          </MapContainer>
      </div>
      )
  }
}

//{intersection_data.elements.map(
  //intersection => <Marker key={intersection.id} position ={[intersection.lat, intersection.lon]}/>)}

const appDiv = document.getElementById("app");
render(<App />, appDiv);