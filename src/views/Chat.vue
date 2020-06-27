<template>
  <v-app id="dependency">
    <v-app-bar app clipped-left color="amber">
      <span class="title ml-3 mr-5">我的消息</span>
      <!-- <v-spacer /> -->
    </v-app-bar>
    <v-content>
      <v-container style="height: 100%;">
        <v-row style="margin-top: 5%; height: 80%; background: #eee;">
          <v-col cols="2" style="height: 100%; ">
            <v-scroll>
              <v-card height="80px"></v-card>
              <v-card height="80px"></v-card>
              <v-card height="80px"></v-card>
              <v-card height="80px"></v-card>
              <v-card height="80px"></v-card>
              <v-card height="80px"></v-card>
              <v-card height="80px"></v-card>
              <v-card height="80px"></v-card>
              <v-card height="80px"></v-card>
              <v-card height="80px"></v-card>
            </v-scroll>
          </v-col>
          <v-col cols="8">sdfsd</v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "Chat",
  data() {
    return {
      path: "ws://127.0.0.1:8080/chat",
      socket: undefined
    };
  },
  mounted() {
    if (typeof WebSocket == undefined) alert("您的浏览器不支持聊天室");
    else {
      this.socket = new WebSocket(this.path);
      this.socket.onopen = this.onopen;
      this.socket.onerror = this.onerror;
      this.socket.onmessage = this.onmessage;
      this.socket.onclose = this.onclose;
    }
  },
  methods: {
    onopen() {
      console.log("WS: 连接成功");
    },
    onclose() {
      console.log("WS: 连接关闭");
    },
    onerror() {
      console.log("WS: 错误发生");
    },
    onmessage(msg) {
      console.log("WS: 收到消息 ", msg.data);
    }
  }
};
</script>