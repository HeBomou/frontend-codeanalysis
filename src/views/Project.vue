<template>
    <v-app id="dependency">
        <v-app-bar
        app
        clipped-left
        color="#5A7797"
        class="white--text"
        >
            <span class="title ml-3 mr-5">个人中心</span>
            <v-spacer />
            <v-spacer />
            <v-spacer />
            <v-btn @click="refresh()" class="mr-5 white--text" elevation="0" color="#5A7797" ><i class="material-icons mr-2">refresh</i>刷新</v-btn>
            <v-btn @click="toTeam" class="mr-5 white--text" elevation="0" color="#5A7797"><i class="material-icons mr-2">group</i>我的小组</v-btn>
            <v-btn v-if="haveNewChat" @click="toChat();haveNewChat = false" class="mr-5 white--text amber" elevation="0" color="#5A7797"><i class="material-icons mr-2">sms</i>
                有新消息!
            </v-btn>
            <v-btn v-else @click="toChat();haveNewChat = false" class="mr-5 white--text" elevation="0" color="#5A7797"><i class="material-icons mr-2">sms</i>
                聊天
            </v-btn>
            <v-btn @click="logout" class="mr-5 white--text" elevation="0" color="#5A7797"><i class="material-icons mr-2">login</i>退出登录</v-btn>
        </v-app-bar>
    <v-content>
        <v-container class="mt-0">
            <ProjectComponent ref="ProjectComponent" :getProjectBasicAttribute="func1" :postProject="func2"></ProjectComponent>
        </v-container>
    </v-content>
    </v-app>
</template>
<script>
import {API} from "../request/api";
import ProjectComponent from "../components/ProjectComponent";
export default {
    name: 'Project',
    components:{
        ProjectComponent
    },
    data: () => ({
       userId: 0,
       func1: API.getProjectBasicAttribute_user,
       func2: API.postProject_user,
       haveNewChat: false
    }),methods:{
       
        logout(){
            this.$store.commit("setUserId", 0);
            this.$router.push('/login');
        },
        toTeam(){
            this.$router.push('/team');
        },
        debug(){
            this.$refs.ProjectComponent.haha();
        },
        toChat(){
            let routeUrl = this.$router.resolve({
                path: "/chat",
            });
            window.open(routeUrl.href, '_blank');
        },
        refresh(){
            API.getContactNew(this.userId).then(res => {
                //console.log(res.data);
                this.haveNewChat = res.data;
            }).catch(err => {
                if(typeof(err.response) != undefined){
                    this.Alert(err.response.data.errMsg);
                }else {
                    console.log(err);
                }
            })
            this.$nextTick(() => {
                this.$refs.ProjectComponent.setProjects(this.userId);
                //console.log(this.$refs);

            })
        }

        

    },created(){
        this.userId = this.$store.getters.userId;
        if(this.userId == 0){
            this.$router.push('/login');
        }
        this.refresh();
    }
    
}
</script>