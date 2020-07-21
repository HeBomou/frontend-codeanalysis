<template>
<div>
 <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <!-- <i class="material-icons">face</i> -->
      <v-btn @click="debug1()">1</v-btn>
      <v-btn @click="debug2()">2</v-btn>
      <v-btn @click="debug3()">3</v-btn>
      <v-btn @click="debug4()">4</v-btn>
      <snack ref="ha"></snack>

</div>
</template>

<script>
import snack from "../components/SnackbarAlert";
export default {
  name: "app",

  components: {
   snack
  },
  data(){
    return {
      
    }
  },
  methods: {
    debug1(){
      //this.snack("haha");
      this.$refs.ha.snack("haha");
    },
    debug2(){
      this.$refs.ha.snack("2", () => {
        console.log(2);
      })
    },
    debug3(){
      this.$refs.ha.snack("3", [{text: "确定1", func: () => {console.log(3)}}, {text: "取消2", func: () => {console.log(4)}}]);
    },
    debug4(){
      this.$refs.ha.snack("4", 1);
    },
    
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