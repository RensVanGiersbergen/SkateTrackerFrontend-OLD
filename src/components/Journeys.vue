<script>
import { RouterLink, RouterView } from "vue-router";
export default {
  props: ["SkaterID"],
  data() {
    return {
      journeys: [],
    };
  },
  created() {
    fetch(
      "https://i461941.luna.fhict.nl/api/Skate/GetJourneysBySkater?SkaterID=" +
        this.SkaterID
    )
      .then((response) => response.json())
      .then((url) => (this.journeys = url))
      .then(() => console.log(this.journeys));
  },
};
</script>

<template>
  <h1 class="title">Journeys:</h1>
  <br />
  <div v-for="journey of journeys" :key="journey.id">   
    <router-link :to="`/journey/?journeyID=${journey.id}`">
      <div class="card">
        <div class="textContainer">
          <h1 class="journeytext">{{ journey.name }}</h1>
          <h1 class="timetext">
            {{
              new Date(journey.startTime).toLocaleDateString("en-us", {
                weekday: "long",
                year: "numeric",
                month: "short",
                day: "numeric",
              }) +
              " " +
              new Date(journey.startTime).toLocaleTimeString()
            }}
          </h1>
        </div>
      </div>
    </router-link>
    <br />
  </div>
</template>

<style scoped>
.card {
  background-color: #282828;
  border: 5px solid #ff7912;
  border-radius: 20px 20px 20px 20px;
  margin: 0px 100px 0px 100px;
}

.textContainer {
  float: left;
}

.journeytext {
  margin-left: 10px;
  color: #ff7912;
  width: 40%;
  float: left;
}

.timetext {
  color: #ff7912;
  float: right;
  font-size: 25px;
}

.title {
  color: #ff7912;
  font-size: 80px;
  margin-left: 100px;
}
</style>