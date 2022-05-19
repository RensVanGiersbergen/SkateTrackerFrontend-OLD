<script>
import L from "leaflet";

export default {
  data() {
    return {
      positions: [],
      maxSpeed: 0,
    };
  },
  methods: {
    getArrayLatLng(positionlist) {
      var latlong = [];
      positionlist.forEach(element =>
        latlong.push([element.latitude, element.longitude]),
      );
      return latlong;
    },
    getMaxSpeed(positionslist){
      var speeds = [];
      positionslist.forEach(element =>
        speeds.push(element.speed * 3.6)
      );
      return Math.max(...speeds);
    }
  },
  mounted() {
    var map;
    var polyline;
    fetch(
      "https://i461941.luna.fhict.nl/api/Skate/GetPositionsByJourney?JourneyID=" +
        this.$route.query.journeyID
    )
      .then((response) => response.json())
      .then((url) => (this.positions = url))
      .then(() => console.table(this.positions))
      .then(
        () =>
          (map = L.map("map").setView(
            [this.positions[0].latitude, this.positions[0].longitude],
            13
          ))
      )
      .then(() =>
        L.tileLayer(
          "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoibml0cm9jYXQyMiIsImEiOiJjbDBqZWV1bDgwNTZvM21wOGkxajA3M3A2In0.DlgfsqJwmBNvu31_S4Khmg",
          {
            attribution:
              'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: "mapbox/dark-v10",
            tileSize: 512,
            zoomOffset: -1,
            accessToken:
              "pk.eyJ1Ijoibml0cm9jYXQyMiIsImEiOiJjbDBqZWV1bDgwNTZvM21wOGkxajA3M3A2In0.DlgfsqJwmBNvu31_S4Khmg",
          }
        ).addTo(map)
      )
      .then(
        () =>
          (polyline = L.polyline(this.getArrayLatLng(this.positions), {
            color: "#ff7912",
            weight: 5,
          }).addTo(map))
      )
      .then(() => map.fitBounds(polyline.getBounds()))
      .then(() => 
        this.maxSpeed = this.getMaxSpeed(this.positions)
      );
  },
};
</script>

<template>
  <div id="map"></div>
  <h1>{{maxSpeed}}</h1>
</template>

<style scoped>
#map {
  margin: 3vh;
  height: 70vh; 
}
</style>
