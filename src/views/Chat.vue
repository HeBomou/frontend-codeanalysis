<template>
  <v-container>
    <h1>Chat test</h1>
  </v-container>
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