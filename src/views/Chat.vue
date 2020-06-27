<template>
  <v-app id="dependency">
    <v-app-bar app clipped-left color="amber">
      <span class="title ml-3 mr-5">我的消息</span>
      <!-- <v-spacer /> -->
    </v-app-bar>
    <v-content>
      <v-container style="height: 100%;">
        <v-row
          style="margin-top: 5%; padding: 5px 20px 5px 20px; height: 80%; background: #FAF4ED;"
        >
          <v-col cols="3" style="height: 100%; overflow-y: scroll;">
            <v-row justify="center" style="margin: 12px 0 12px 0;">联系人列表</v-row>
            <v-card
              v-for="item in people"
              :key="item.id"
              style="margin-bottom: 3px;"
              height="80px"
              color="#FFEFD5"
            >
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="headline mb-1">{{item.name}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-col>
          <v-col cols="9">
            <v-row style="height: 59%; margin-bottom: 1%; background: #FFFEFE;"></v-row>
            <v-row style="height: 30%; padding: 0 10px 0 10px;">
              <v-textarea :value="inputText"></v-textarea>
            </v-row>
            <v-row justify="end" style="height: 10%; padding: 0 10px 0 10px;">
              <v-btn>发送</v-btn>
            </v-row>
          </v-col>
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
      socket: undefined,
      people: [
        { id: 1, name: "章鱼王" },
        { id: 2, name: "永不翘课" },
        { id: 2, name: "胡子哥" }
      ],
      curPerson: 2,
      messages: [
        { time: new Date(), text: "cnm" },
        { time: new Date(), text: "cnm2" },
        { time: new Date(), text: "cnm3" }
      ],
      inputText: ""
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