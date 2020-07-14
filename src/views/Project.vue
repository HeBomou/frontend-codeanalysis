<template>
    <v-app id="dependency">
        <v-app-bar
        app
        clipped-left
        color="amber"
        >
            <span class="title ml-3 mr-5">个人中心</span>
            <v-spacer />
            <v-spacer />
            <v-spacer />
            <v-btn @click="toTeam" class="mr-5">我的小组</v-btn>
            <v-btn @click="debug" class="mr-5">debug</v-btn>
            <v-btn @click="logout">退出登录</v-btn>
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
        }

        

    },created(){
        this.userId = this.$store.getters.userId;
        if(this.userId == 0){
            this.$router.push('/login');
        }
        this.$nextTick(() => {
            this.$refs.ProjectComponent.setProjects(this.userId);
            //console.log(this.$refs);

        })

    }
    
}
</script>