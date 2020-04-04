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

            <v-btn>退出登录</v-btn>


        
        </v-app-bar>
    <v-content>
        <v-container class="mt-0">
            <v-list-item-group
            v-for="(project, i) in projects"
            :key="i"
            >
            </v-list-item-group>
        </v-container>
    </v-content>
    </v-app>
</template>
<script>
//import getProjects from "../request/api";
export default {
    name: 'Project',
    data: () => ({
        projects: []
    }),methods:{

    },mounted: {
        setProjects(){
            //const res = await getProjects(this.$store.state.userId);
            //console.log(res);
        }
    }
    
}
</script>