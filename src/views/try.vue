<template>
<div>
 <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <!-- <i class="material-icons">face</i> -->
      <v-btn @click="debug1()">1</v-btn>
      <v-btn @click="debug2()">2</v-btn>
      <v-btn @click="debug3()">3</v-btn>
      <v-btn @click="debug4()">4</v-btn>
      <snack ref="ha"></snack>
      <dialogAlert ref="dia"></dialogAlert>
     
</div>
</template>

<script>
import snack from "../components/SnackbarAlert";
import dialogAlert from "../components/DialogAlert";
export default {
  name: "app",

  components: {
   snack,
   dialogAlert
  },
  data(){
    return {
      dialog: false,
      msg: "haha",
      btns: [
        {text: "取消", func: () => {}, color: "error"}, 
        // {text: "确定", func: () => {}, color: "success"}
      ]
    }
  },
  methods: {
    debug1(){
      //this.snack("haha");
      //this.$refs.ha.snack("haha");
      this.$refs.dia.Alert("haha");
    },
    debug2(){
      this.$refs.dia.Alert("haha2", () => {console.log("2")});

    },
    debug3(){
      this.$refs.dia.Alert("haha3", () => {console.log("haha3")}, () => {console.log("haha4")});
      
    },
    debug4(){
      this.$refs.dia.Alert("haha");

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