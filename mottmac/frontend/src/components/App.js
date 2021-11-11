import React, { Component } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { Icon } from "leaflet";
import { render } from "react-dom";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{width:'100%',height:'100%'}}>
          <MapContainer center={[43.6426, -79.3871]} zoom={12} style={{width:'100%',height:'100%'}}>
          <TileLayer
          url="https://api.mapbox.com/styles/v1/johnvolpatti/ckvv5yxhi2itg14ph3tb8o5l6/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoiam9obnZvbHBhdHRpIiwiYSI6ImNrdnY2MzJnMjA1cDYydW9saHBpajFsZzkifQ.yWRTC-l5rfOh8ZDgGgxYDg"
          attribution="© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>"
          />
          </MapContainer>
      </div>
      )
  }
}

/*export default function App (){
    return (
    <Map center = {[45, -75]} zoom={12}>
        <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
    </Map>);
}*/

const appDiv = document.getElementById("app");
render(<App />, appDiv);