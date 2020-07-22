<template>
  <v-slide-y-transition>
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
                @click="btns[0].func()"
              >
                {{btns[0].text}}
              </v-btn>
              <v-spacer />
              <v-btn 
                v-if="btns[1]"
                :color="btns[1].color"
                text
                @click="btns[1].func()"
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
        {text: "取消", func: () => {console.log("haha")}, color: "err"}, 
        {text: "确定", func: () => {console.log("haha2")}, color: "success"}
      ]
    };
  },
  methods: {
    Alert(msg, func1, func2) {
      this.dialog = true;
      this.msg = msg;
      if(typeof func1 === "undefined"){
        //没有传函数，认为只有一个按钮
        console.log("2");
        this.btns = [{text: "确定", func: () => { this.dialog = false }, color: "success"}];
        
      } else if(typeof func2 === "undefined"){
        //只有一个函数
        console.log("3");
        this.btns = [{text: "确定", func: () => {func1(); this.dialog = false}, color: "success"}];

      } else {
        console.log("4");
        this.btns = [{text: "取消", func: () => {func2(); this.dialog = false}, color: "error"}, {text: "确定", func: () => {func1(); this.dialog = false}, color: "success"}];

      }
    }
  }
};
</script>