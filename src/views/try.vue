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
      <v-dialog v-model="dialog" width="500">
        <v-card justify="center" color="#5A7797" class="white--text">
          <v-card-title>{{msg}}</v-card-title>
          <v-divider />
          <v-card-actions>
              <!-- <v-spacer v-if="i != 0"></v-spacer> -->
              <v-spacer v-if="!btns[1]" />

              <v-btn 
                :color="btns[0].color"
                text
              >
                {{btns[0].text}}
              </v-btn>
              <v-spacer />
              <v-btn 
                v-if="btns[1]"
                :color="btns[1].color"
                text
              >
                {{btns[1].text}}
              </v-btn>
              
          </v-card-actions>
        </v-card>
      </v-dialog>

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
      this.dialog = true;
    },
    debug3(){
      
    },
    debug4(){

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