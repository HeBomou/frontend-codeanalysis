<template>
  <v-slide-y-transition>
    <v-snackbar v-model="snack_alert" timeout="10000" bottom color="#5A7797" rounded="pill">
      {{ snack_alert_text }}
      <template v-slot:action="{ attrs }">
        <div>
          <v-btn
            v-for="(btn, i) in snack_alert_btns"
            :key="i"
            color="white"
            text
            v-bind="attrs"
            @click="snack_alert = false;btn.func()"
          >{{btn.text}}</v-btn>
        </div>
      </template>
    </v-snackbar>
  </v-slide-y-transition>
</template>
<script>
export default {
  name: "snackbar_alert_component",
  data() {
    return {
      snack_alert_text: "",
      snack_alert: false,
      snack_alert_btns: [
        { text: "确定", func: () => {} },
        { text: "取消", func: () => {} },
        { text: "取消", func: () => {} }
      ]
    };
  },
  methods: {
    snack(msg, btns) {
      if (typeof btns === "undefined") {
        //只提示信息的情况(没有，非数组，数组长度为0)
        this.snack_alert_btns = [{ text: "确定", func: () => {} }];
      } else if (typeof btns === "function") {
        //只传入一个函数，当作是确认
        this.snack_alert_btns = [
          { text: "确定", func: btns },
          { text: "取消", func: () => {} }
        ];
      } else if (typeof btns == "object" && btns.constructor == Array) {
        //传入多个函数，对每个按钮有详细要求
        this.snack_alert_btns = btns;
      } else {
        console.log("error in snack()");
        this.snack_alert_btns = [{ text: "确定", func: () => {} }];
      }
      this.snack_alert_text = msg;
      this.snack_alert = true;
    }
  }
};
</script>