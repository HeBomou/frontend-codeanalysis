<template>
  <v-slide-y-transition>
    <v-dialog v-model="dialogErr" width="500">
        <v-card justify="center">
          <v-card-title>{{errMsg}}</v-card-title>
          <v-card-text>
            <v-btn color="error" @click="dialogConfirm">确定</v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>
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