<template>
  <v-app id="dependency">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet">
    <v-app-bar app clipped-left color="#5A7797">
      <span class="title ml-3 mr-5 white--text">我的消息</span>
      <v-spacer />
      <v-spacer />
      <v-spacer />
      <v-btn @click="$router.push('/team')" class="mr-5 white--text" elevation="0" color="#5A7797"><i class="material-icons mr-2">group</i>我的小组</v-btn>
      <v-btn @click="$router.push('/project')" class="mr-5 white--text" elevation="0" color="#5A7797" ><i class="material-icons mr-2">insights</i>我的项目</v-btn>

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
                        <v-icon :color="item.read?'grey':'amber'">mdi-chat</v-icon>
                      </v-list-item-icon>
                    </v-list-item>
                    <v-divider :key="`divider-${item.id}`" class="my-0"></v-divider>
                  </template>
                </v-list-item-group>
              </v-list>
            </v-responsive>
          </v-col>
          <v-col cols="3" style="max-width: 100%;" class="flex-grow-1 flew-shrink-0">
            <v-responsive v-if="activeChat" class="fill-height" height="650">
              <v-card flat class="d-flex flex-column fill-height">
                <v-card-title>{{people[curPersonIndex].name}}</v-card-title>
                <v-divider class="my-0"></v-divider>
                <v-card-text id="message-list" class="flex-grow-1 overflow-y-auto">
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
      // path: "ws://127.0.0.1:8080/chat",
      path: "ws://101.201.150.49:8080/chat",
      socket: undefined,
      people: [
        { id: 1, name: "章鱼王", read: true },
        { id: 2, name: "永不翘课", read: false },
        { id: 3, name: "胡子哥", read: true }
      ],
      activeChat: false,
      curPersonIndex: 0,
      messages: [
        { id: 1, me: false, time: "2020-06-29 20:20:55", text: "cnm" },
        { id: 2, me: true, time: "2020-06-29 20:21:33", text: "cnm2" },
        { id: 3, me: false, time: "2020-06-29 20:32:02", text: "cnm3" },
        { id: 4, me: true, time: "2020-06-29 20:34:22", text: "cnm4" },
        { id: 5, me: false, time: "2020-06-29 20:51:10", text: "cnm5" }
      ],
      inputText: ""
    };
  },
  created() {
    this.newContact = this.$route.query.newContact;
  },
  mounted() {
    let userId = this.$store.getters.userId;
    if (userId == 0) this.$router.push("/login");
    if (typeof WebSocket == undefined) alert("您的浏览器不支持该聊天室");
    else {
      this.socket = new WebSocket(this.path);
      this.socket.onopen = this.onopen;
      this.socket.onerror = this.onerror;
      this.socket.onmessage = this.onmessage;
      this.socket.onclose = this.onclose;

      // 获取联系人列表
      getContacts(userId).then(res => {
        console.log("contacts", res);
        this.people = [];
        res.data.forEach(p => {
          this.people.push({
            id: p.userId,
            name: p.username,
            read: p.read == 1
          });
        });
      });
    }
  },
  methods: {
    onopen() {
      console.log("WS: 连接成功");
      this.socket.send("i" + this.$store.getters.userId);
      console.log(this.newContact);
      if (this.newContact != undefined) this.socket.send("c" + this.newContact);
    },
    onclose() {
      // console.log("WS: 连接关闭");
    },
    onerror() {
      // console.log("WS: 错误发生");
    },
    onmessage(msg) {
      if (msg.data[0] == "c") {
        let p = JSON.parse(msg.data.substr(1));
        console.log("new contact", p);
        this.people.push({
          id: p.userId,
          name: p.username,
          read: p.read == 1
        });
      } else if (msg.data[0] == "m") {
        let msgRawObj = JSON.parse(msg.data.substr(1));
        let msgObj = {
          id: msgRawObj.id,
          me: msgRawObj.senderId == this.$store.getters.userId,
          time: msgRawObj.time,
          text: msgRawObj.content
        };
        let curPersonId = this.people[this.curPersonIndex].id;
        if (
          msgRawObj.senderId == curPersonId ||
          msgRawObj.receiverId == curPersonId
        ) {
          this.messages.push(msgObj);
          this.$nextTick(() => {
            var chatList = this.$el.querySelector("#message-list");
            console.log(chatList);
            chatList.scrollTop = chatList.scrollHeight;
          });
        }
        // console.log("WS: 收到消息 ", msgObj);
      } else if (msg.data[0] == "r") {
        let personId = parseInt(msg.data.substr(2));
        let read = msg.data[1] == "1";
        for (let i = 0; i < this.people.length; i++)
          if (this.people[i].id == personId) this.people[i].read = read;
      }
    },
    changePerson(index) {
      this.activeChat = true;
      this.curPersonIndex = index;
      let curPersonId = this.people[index].id;
      // 更新已读
      this.socket.send("r" + curPersonId);
      console.log("update read", this.people[index]);
      // 获取用户聊天记录
      getMessages(this.$store.getters.userId, curPersonId).then(res => {
        // console.log(res);
        this.messages = [];
        res.data.forEach(msgRawObj => {
          this.messages.push({
            id: msgRawObj.id,
            me: msgRawObj.senderId == this.$store.getters.userId,
            time: msgRawObj.time,
            text: msgRawObj.content
          });
        });
        this.$nextTick(() => {
          var chatList = this.$el.querySelector("#message-list");
          console.log(chatList);
          chatList.scrollTop = chatList.scrollHeight;
        });
      });
    },
    sendMessage() {
      if (this.inputText == "") return;
      this.socket.send(
        "m" + this.people[this.curPersonIndex].id + "," + this.inputText
      );
      // console.log("Try to send msg: ", this.inputText);
      this.inputText = "";
    }
  }
};
</script>