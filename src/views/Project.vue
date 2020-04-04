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
            <v-card>
                <v-card-text>
                    <v-list-item-group
                    v-for="(project, i) in projects"
                    :key="i"
                    >
                        <v-list-item-content>
                            <v-list-item-title @click="toProject(i)">{{project.projectName}}</v-list-item-title>
                            
                        </v-list-item-content>
                    </v-list-item-group>
                    <v-dialog
                        v-model="dialog"
                        width="500">
                        <v-card>
                            <v-card-title>增加项目</v-card-title>
                            <v-card-text>
                                <v-form>
                                    <v-text-field
                                        class="mr-5 ml-5"
                                        v-model="projectName"
                                        label="项目名"
                                        clearable
                                        required
                                        flat
                                        outlined
                                        rounded
                                        >
                                    </v-text-field>
                                    <v-text-field
                                        class="mr-5 ml-5"
                                        v-model="projectUrl"
                                        label="git地址"
                                        clearable
                                        required
                                        flat
                                        outlined
                                        rounded
                                        >
                                    </v-text-field>
                                    <v-btn
                                        class="mr-5 ml-5"
                                        color="success"                                        
                                        @click="addProject"
                                    >确定
                                    </v-btn>
                                </v-form>
                            </v-card-text>
                        </v-card>
                    </v-dialog>
                    <v-list-item-title @click="dialog=true" >增加</v-list-item-title>
                </v-card-text>
            </v-card>
        </v-container>
    </v-content>
    </v-app>
</template>
<script>
import {getProjects, addProject} from "../request/api";
export default {
    name: 'Project',
    data: () => ({
        projects: ["123", "234"],
        dialog: false,
        projectName: "",
        projectUrl: "",
        userId: 0
    }),methods:{
        setProjects(){
            console.log("onMount, UserId: " + this.$store.state.userId);
            getProjects(this.$store.state.userId).then(res => {
                console.log(res.data);
                this.projects = res.data;
                }).catch(err => console.log(err));
        },
        addProject(){
            console.log("projectName : " + this.projectName);
            console.log("projectUrl : " + this.projectUrl);
            console.log("UserId : " + this.$store.state.userId);
            const res = addProject(this.projectName, this.projectUrl, this.$store.state.userId);
            console.log(res);
        },
        /**
         * 进入这个项目
         */
        toProject(i){
            console.log(this.projects[i].id);
            this.$store.commit("setProjectId",this.projects[i].id);
            this.$router.push("/dependency");
        }
        

    },mounted(){
        this.userId = this.$store.state.userId;
    
        //TODO:debug
        this.userId = 233;
        this.setProjects();
        
    }
    
}
</script>