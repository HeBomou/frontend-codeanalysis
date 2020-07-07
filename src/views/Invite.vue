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
                <v-btn color="error" @click="dialogErr=false">确定</v-btn>
            </v-card-text>
        </v-card>
    </v-dialog>
    <v-dialog
        v-model="dialogAdd"
        no-click-animation
        persistent
        width="500">
        <v-card>
            <v-card-title>张雨奇邀请您加入小组 反共地下组织</v-card-title>
            <v-card-text>
                <v-btn color="success" @click="dialogAdd=false" class="mr-5">确定</v-btn>
                <v-btn color="error" @click="$router.push('/team')">同意</v-btn>
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
            dialogErr: true,
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
            this.dialogAdd = true;
            postMember(this.$route.query.groupId, this.userId, this.$route.query.inviteCode).then(res => {
                console.log(res);
            }).catch(err => {
                err;
                console.log(this.$route.query.inviteCode);
                //this.Alert(err.response.data.errMsg);
            })
        }
    },computed: {
      screenHeight() {
        return document.documentElement.clientHeight;
      }
    },
}
</script>