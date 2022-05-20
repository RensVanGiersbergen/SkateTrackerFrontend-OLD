<script>
import L from "leaflet";

export default {
  props: {},
  data() {
    return {
      positions: [],
      journey: 0,
      maxSpeed: 0,
      avgSpeed: 0,
      startTime: 0,
      endTime: 0,
      rideTime: 0,
    };
  },
  methods: {
    getArrayLatLng(positionlist) {
      var latlong = [];
      positionlist.forEach((element) =>
        latlong.push([element.latitude, element.longitude])
      );
      return latlong;
    },
    getMaxSpeed(positionslist) {
      var speeds = [];
      positionslist.forEach((element) => speeds.push(element.speed * 3.6));
      var topspeed = Math.max(...speeds);
      return topspeed.toFixed(2);
    },
    getAvgSpeed(positionslist) {
      var total = 0;
      var amount = 0;
      positionslist.forEach((element) => {
        if (element.speed > 0.3) {
          total = element.speed * 3.6 + total;
          amount = amount + 1;
        }
      });
      return (total / amount).toFixed(2);
    },
    getRideTime(date1, date2) {
      var startdate = new Date(date1);
      var enddate = new Date(date2);

      var difference = Math.abs(startdate - enddate) / 1000;
      return difference;
    },
    convertHMS(value) {
      const sec = parseInt(value, 10); // convert value to number if it's string
      let hours = Math.floor(sec / 3600); // get hours
      let minutes = Math.floor((sec - hours * 3600) / 60); // get minutes
      let seconds = sec - hours * 3600 - minutes * 60; //  get seconds
      // add 0 if value < 10; Example: 2 => 02
      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      return hours + ":" + minutes + ":" + seconds; // Return is HH : MM : SS
    },
  },
  mounted() {
    var map;
    var polyline;
    fetch(
      "https://i461941.luna.fhict.nl/api/Skate/GetJourneyById?ID=" +
        this.$route.query.journeyID
    )
      .then((response) => response.json())
      .then((url) => (this.journey = url))
      .then(() => console.table(this.journey));

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
          "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
          {
            attribution:
              'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: "mapbox/dark-v10",
            tileSize: 512,
            zoomOffset: -1,
            accessToken: import.meta.env.VITE_MAPBOX_KEY,
          }
        ).addTo(map)
      )
      .then(
        () =>
          (polyline = L.polyline(this.getArrayLatLng(this.positions), {
            color: "#ff7912",
            weight: 4,
          }).addTo(map))
      )
      .then(() => map.fitBounds(polyline.getBounds()))
      .then(() => {
        this.maxSpeed = this.getMaxSpeed(this.positions);
        this.avgSpeed = this.getAvgSpeed(this.positions);
        this.startTime = this.positions[0].timeStamp;
        this.endTime = this.positions[this.positions.length - 1].timeStamp;
        this.rideTime = this.getRideTime(this.startTime, this.endTime);
      })
      .then(() => {
        var startIcon = L.icon({
          iconUrl: "https://imgur.com/dPC3K0e.png",
          iconSize: [30, 50],
          iconAnchor: [1, 50],
          popupAnchor: [0, 0],
        });
        L.marker([this.positions[0].latitude, this.positions[0].longitude], {
          icon: startIcon,
        }).addTo(map);

        var endIcon = L.icon({
          iconUrl: "https://imgur.com/vjLDcQa.png",
          iconSize: [30, 50],
          iconAnchor: [1, 50],
          popupAnchor: [0, 0],
        });
        L.marker(
          [
            this.positions[this.positions.length - 1].latitude,
            this.positions[this.positions.length - 1].longitude,
          ],
          { icon: endIcon }
        ).addTo(map);
      });
  },
};
</script>

<template>
  <div id="map"></div>
  <div class="row">
    <div id="column1">
      <h1>Journey</h1>
      <h2>Name: {{ journey.name }}</h2>
      <h2>Skater: {{ journey.skaterID }}</h2>
    </div>
    <div id="column2">
      <h1>Speed</h1>
      <h2>Max: {{ maxSpeed }} km/h</h2>
      <h2>Average: {{ avgSpeed }} km/h</h2>
    </div>
    <div id="column3">
      <h1>Time</h1>
      <h2>Ride Time: {{ this.convertHMS(rideTime) }}</h2>
      <h2>
        Start:
        {{
          new Date(startTime).toLocaleDateString({
            year: "numeric",
            month: "numeric",
            day: "numeric",
          }) +
          " " +
          new Date(startTime).toLocaleTimeString()
        }}
      </h2>
      <h2>
        End:
        {{
          new Date(endTime).toLocaleDateString({
            year: "numeric",
            month: "numeric",
            day: "numeric",
          }) +
          " " +
          new Date(endTime).toLocaleTimeString()
        }}
      </h2>
    </div>
  </div>
</template>

<style scoped>
h1 {
  color: #ff7912;
  font-size: 50px;
}

h2 {
  color: #ff994c;
}
#map {
  margin: 3vh;
  height: 70vh;
}

.stats-wrapper {
  margin: 3vh;
  height: 20vh;
}

.stat {
  color: #ff7912;
}

.row {
  width: 90vw;
  margin: 3vh;
}

#column1 {
  float: left;
  width: 40%;
}

#column2 {
  float: left;
  width: 30%;
}

#column3 {
  float: left;
  width: 30%;
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}

@media screen and (max-width: 600px) {
  #column1 {
    float: left;
    width: 100%;
  }

  #column2 {
    float: left;
    width: 100%;
  }

  #column3 {
    float: left;
    width: 100%;
  }
}
</style>
