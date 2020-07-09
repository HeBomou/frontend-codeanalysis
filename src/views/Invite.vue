<template>
<div>
    <v-carousel
      cycle
      :height="screenHeight"
      hide-delimiter-background
      show-arrows-on-hover
      fluid
    >
      <v-carousel-item
        v-for="(item,i) in imageUrls"
        :key="i"
        :src="item.src">
        <v-overlay absolute
          opacity="0.8"
        >
        </v-overlay>
      </v-carousel-item>
    </v-carousel>
    <v-dialog
        v-model="dialogErr"
        width="500">
        <v-card>
            <v-card-title>{{errMsg}}</v-card-title>
            <v-card-text>
                <v-btn color="error" @click="$router.push('/team')">确定</v-btn>
            </v-card-text>
        </v-card>
    </v-dialog>
    <v-dialog
        v-model="dialogAdd"
        no-click-animation
        persistent
        width="500">
        <v-card>
            <v-card-title>{{leader}}邀请您加入小组 {{groupName}}</v-card-title>
            <v-card-text>
                <v-btn color="success" @click="dialogAdd=false;confirmJoinGroup()" class="mr-5">确定</v-btn>
                <v-btn color="error" @click="$router.push('/team')">拒绝</v-btn>
            </v-card-text>
        </v-card>
    </v-dialog>
</div>
</template>
<script>
import {postMember} from "../request/api";
export default {
    data(){
        return {
            errMsg: "",
            dialogErr: false,
            dialogAdd: false,
            groupName: "勇中间全球粉丝后援会",
            leader: "勇中间",
            userId: 0,
            imageUrls: [
                {
                    src: require("@/assets/images/login/1.jpg"),
                },
                {
                    src: require("@/assets/images/login/2.jpg"),
                },
                {
                    src: require("@/assets/images/login/3.jpg"),
                },
                {
                    src: require("@/assets/images/login/4.jpg"),
                },
                {
                    src: require("@/assets/images/login/5.jpg"),
                }
            ],
        }
    },
    methods:{
        Alert(msg){
            this.errMsg = msg;
            this.dialogErr = true;
        },
        confirmJoinGroup(){
            postMember(this.$route.query.groupId, this.userId, this.$route.query.inviteCode).then(res => {
                console.log(res);
                this.$router.push("/team");
            }).catch(err => {
                err;
                this.Alert(err.response.data.errMsg);
            })
        }
    },
    mounted(){
        this.userId = this.$store.getters.userId;
        if(this.userId == 0){
            this.$router.push('/login');
        }
        console.log(this.$route.query);
        if(this.$route.query.groupId == undefined || this.$route.query.inviteCode == undefined){
            this.Alert("组长的邀请链接有错误，请重新获取");
        }else{
            this.groupName = unescape(this.$route.query.groupName);
            this.leader = unescape(this.$route.query.leader);
            this.dialogAdd = true;

        }
    },computed: {
      screenHeight() {
        return document.documentElement.clientHeight;
      }
    },
}
</script>