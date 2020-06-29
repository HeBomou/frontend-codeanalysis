<template>
  <v-app id="dependency">
    <v-app-bar app clipped-left color="amber">
      <span class="title ml-3 mr-5">我的消息</span>
      <!-- <v-spacer /> -->
    </v-app-bar>
    <v-content>
      <v-container class="fill-height pa-0">
        <v-row class="no-gutters elevation-4">
          <v-col
            cols="3"
            class="flex-grow-1 flex-shrink-0"
            style="border-right: 1px solid #0000001f;"
          >
            <v-responsive class="overflow-y-auto fill-height" height="650">
              <v-list subheader>
                <v-list-item-group>
                  <template v-for="(item, index) in people">
                    <v-list-item :key="item.id" :value="item.id" @click="changePerson(index)">
                      <v-list-item-avatar color="grey lighten-2 white--text">
                        <v-icon>mdi-chat</v-icon>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title v-text="item.name"></v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-icon>
                        <v-icon>mdi-chat</v-icon>
                      </v-list-item-icon>
                    </v-list-item>
                    <v-divider :key="`divider-${item.id}`" class="my-0"></v-divider>
                  </template>
                </v-list-item-group>
              </v-list>
            </v-responsive>
          </v-col>
          <v-col cols="3" style="max-width: 100%;" class="flex-grow-1 flew-shrink-0">
            <v-responsive v-if="activeChat" class="overflow-y-auto fill-height" height="650">
              <v-card flat class="d-flex flex-column fill-height">
                <v-card-title>{{people[curPersonIndex].name}}</v-card-title>
                <v-divider class="my-0"></v-divider>
                <v-card-text class="flex-grow-1 overflow-y-auto">
                  <template v-for="item in messages">
                    <div :key="item.id" :class="{'d-flex flex-row-reverse': item.me}">
                      <v-chip
                        :color="item.me ? 'primary' : ''"
                        dark
                        class="pa-4 mb-2"
                        style="height:auto; white-space:normal;"
                      >{{item.text}}</v-chip>
                    </div>
                  </template>
                </v-card-text>
                <v-card-text class="flex-shrink-1">
                  <v-text-field
                    v-model="inputText"
                    label="输入您的消息"
                    type="text"
                    no-details
                    outlined
                    append-outer-icon="mdi-send"
                    @keyup.enter="sendMessage()"
                    @click:append-outer="sendMessage()"
                  ></v-text-field>
                </v-card-text>
              </v-card>
            </v-responsive>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { getContacts, getMessages } from "../request/api";
export default {
  name: "Chat",
  data() {
    return {
      path: "ws://127.0.0.1:8080/chat",
      socket: undefined,
      people: [
        { id: 1, name: "章鱼王" },
        { id: 2, name: "永不翘课" },
        { id: 3, name: "胡子哥" }
      ],
      activeChat: false,
      curPersonIndex: 0,
      messages: [
        { id: 1, me: false, time: "2020-06-29 20:20", text: "cnm" },
        { id: 2, me: true, time: "2020-06-29 20:21", text: "cnm2" },
        { id: 3, me: false, time: "2020-06-29 20:32", text: "cnm3" },
        { id: 4, me: true, time: "2020-06-29 20:34", text: "cnm4" },
        { id: 5, me: false, time: "2020-06-29 20:51", text: "cnm5" }
      ],
      inputText: ""
    };
  },
  mounted() {
    if (typeof WebSocket == undefined) alert("您的浏览器不支持该聊天室");
    else {
      this.socket = new WebSocket(this.path);
      this.socket.onopen = this.onopen;
      this.socket.onerror = this.onerror;
      this.socket.onmessage = this.onmessage;
      this.socket.onclose = this.onclose;

      // 获取联系人列表
      getContacts(this.$store.getters.userId).then(res => {
        console.log("contacts", res);
        this.people = [];
        res.data.forEach(p => {
          this.people.push({
            id: p.id,
            name: p.username
          });
        });
      });
    }
  },
  methods: {
    onopen() {
      console.log("WS: 连接成功");
      this.socket.send(this.$store.getters.userId);
    },
    onclose() {
      console.log("WS: 连接关闭");
    },
    onerror() {
      console.log("WS: 错误发生");
    },
    onmessage(msg) {
      let msgRawObj = JSON.parse(msg.data);
      let msgObj = {
        id: msgRawObj.id,
        me: msgRawObj.senderId == this.$store.getters.userId,
        time: msgRawObj.time,
        text: msgRawObj.content
      };
      console.log("WS: 收到消息 ", msgObj);
      this.messages.push(msgObj);
    },
    changePerson(index) {
      this.activeChat = true;
      this.curPersonIndex = index;
      // 获取用户聊天记录
      getMessages(this.$store.getters.userId, this.people[index].id).then(
        res => {
          console.log(res);
          this.messages = [];
          res.data.forEach(msgRawObj => {
            this.messages.push({
              id: msgRawObj.id,
              me: msgRawObj.senderId == this.$store.getters.userId,
              time: msgRawObj.time,
              text: msgRawObj.content
            });
          });
        }
      );
    },
    sendMessage() {
      if (this.inputText == "") return;
      this.socket.send(
        this.people[this.curPersonIndex].id + "," + this.inputText
      );
      console.log("Try to send msg: ", this.inputText);
      this.inputText = "";
    }
  }
};
</script>