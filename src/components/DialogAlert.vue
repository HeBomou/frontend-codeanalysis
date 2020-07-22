<template>
  <v-slide-y-transition>
    <v-dialog v-model="dialog" width="500">
        <v-card justify="center" color="#5A7797" class="white--text">
          <v-card-title>{{msg}}</v-card-title>
          <v-divider />
          <v-card-actions>
              <!-- <v-spacer v-if="i != 0"></v-spacer> -->
              <v-btn 
                :color="btns[0].color"
                text
              >
                {{btns[0].text}}
              </v-btn>
              <v-spacer />
              <v-btn 
                :color="btns[1].color"
                text
              >
                {{btns[1].text}}
              </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  </v-slide-y-transition>
</template>
<script>
export default {
  name: "snackbar_alert_component",
  data() {
    return {
      dialog: false,
      msg: "",
      btns: [
        {text: "取消", func: () => {}, color: "err"}, 
        {text: "确定", func: () => {}, color: "success"}
      ]
    };
  },
  methods: {
    Alert(msg, func1, func2) {
      this.dialog = true;
      if (!(typeof func1 === "function") || !(typeof func2 === "function")) {
        console.log("error in alert dialog");
      } else if(typeof func1 === "undefined"){
        //没有传函数，认为只有一个按钮
        console.log("2");
        
      } else if(typeof func2 === "undefined"){
        //只有一个函数
        console.log("3");

      } else {
        console.log("4");

      }
    }
  }
};
</script>