<template>
<div>
  <v-autocomplete
    @input="selectThreshold()"
    v-model="thresholdSelected"
    :items="thresholds"
    append-outer-icon="mdi-plus"
    @click:append-outer="add()"
  >
  </v-autocomplete>
     
</div>
</template>

<script>

export default {
  name: "app",
  data(){
    return {
      thresholds: [0, 1],
      thresholdSelected: 0,
    }
  },
  methods: {
   selectThreshold(){
     console.log(this.thresholdSelected);
   },
   debug(){
     console.log("debug");
   },
   add(){
     let haha = Math.ceil(Math.random()*10);
     this.thresholds.push(haha);
     this.thresholdSelected = haha;
   }
  }
};
</script>
<style scoped>
.pa{position: absolute;}
.haha{position: absolute;top: 10;left: 90%}
.text-wrapper {
  white-space: pre-wrap;
}
</style>