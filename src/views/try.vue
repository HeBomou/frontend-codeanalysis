<template>
<div>
 <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <!-- <i class="material-icons">face</i> -->
      <v-btn @click="snack_alert = true">1</v-btn>
      <v-btn @click="debug1()">2</v-btn>
      <v-btn @click="debug2()">3</v-btn>
      <v-snackbar
            v-model="snack_alert"
            timeout="10000"
            bottom
            color="#5A7797"
            rounded="pill"
        >
            {{ snack_alert_text }}
            <template v-slot:action="{ attrs }">
                <v-btn
                color="white"
                text
                v-bind="attrs"
                @click="snack_alert = false;snack_alert_func()"
                >
                确定
                </v-btn>
                <v-btn
                color="white"
                text
                v-bind="attrs"
                @click="snack_alert = false;snack_alert_func = () => {}"
                >
                取消
                </v-btn>
            </template>
        </v-snackbar>

</div>
</template>

<script>
export default {
  name: "app",

  components: {
   
  },
  data(){
    return {
      snack_alert_text: "",
      snack_alert: false,
    }
  },
  methods: {
    debug1(){
      this.snack("111111111111111111111111111111111111111111111", () => {
        console.log(1);
      })
    },
    debug2(){
      this.snack("2", () => {
        console.log(2);
      })
    },
    snack(msg, func){
            this.snack_alert_func = func;
            this.snack_alert_text = msg;
            this.snack_alert = true;
    },
    snack_alert_func: () => {},
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