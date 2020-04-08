<template>
    <v-app id="dependency">
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
                            :rules="nameRules"
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
                            :rules="gitRules"
                            >
                        </v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                        <v-btn
                            color="success"                                        
                            @click="addProject"
                        >确定
                        </v-btn>
                        
                        <v-btn
                            color="error"                                        
                            @click="dialog=false"
                            
                        >取消
                        </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="dialogDelete"
            width="500">
            <v-card>
                <v-card-title>删除项目: {{projectToBeDelete.projectName}}</v-card-title>
                <v-card-text color="red">
                    项目被删除后无法恢复，且所有标注都会被删除！
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                        <v-btn
                            color="success" 
                            @click="deleteProjectConfirmed()"
                        >确定
                        </v-btn>
                        
                        <v-btn
                            color="error"   
                            @click="dialogDelete=false;"
                            
                        >取消
                        </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-app-bar
        app
        clipped-left
        color="amber"
        >
            <span class="title ml-3 mr-5">个人中心</span>
            

            <v-spacer />
            <v-spacer />
            <v-spacer />

            <v-btn @click="logout">退出登录</v-btn>


        
        </v-app-bar>
    <v-content>
        <v-container class="mt-0">
            <!-- <v-card>
                <v-card-text>
                    <v-list-item-group
                    v-for="(project, i) in projects"
                    :key="i"
                    >
                        <v-list-item @click="toProject(i)" >
                          {{project.projectName}}
                          <v-icon>mdi-plus</v-icon>
                        </v-list-item>
                    </v-list-item-group>
                    <v-list-item @click="dialog=true" ><v-icon>mdi-plus</v-icon></v-list-item>
                </v-card-text>
            </v-card> -->
            <v-card>
                <v-card-title>
                    项目列表
                    <v-spacer />
                    <v-text-field
                        v-model="searchProject"
                        append-icon="mdi-magnify"
                        label="Search"
                        single-line
                        hide-details
                    ></v-text-field>
                    <v-btn @click="dialog=true" color="success">添加</v-btn>
                </v-card-title>
                <v-card-text>
                    <v-data-table
                        :loading="isLoading"
                        loading-text="Loading... Please wait"
                        :headers="projectHeaders"
                        :items="projects"
                        :search="searchProject"
                        
                    >
                        <template v-slot:item.projectName="props">
                            <v-edit-dialog
                            :return-value.sync="props.item.projectName"
                            large
                            persistent
                            @save="saveProjectName(props.item)"
                            >
                            <div>{{ props.item.projectName }}</div>
                            <template v-slot:input>
                                <div class="mt-4 title">修改项目名</div>
                            </template>
                            <template v-slot:input>
                                <v-text-field
                                v-model="props.item.projectName"
                                label="Edit"
                                single-line
                                counter
                                autofocus
                                ></v-text-field>
                            </template>
                            </v-edit-dialog>
                        </template>
                        <template v-slot:item.id="props">
                            
                            <v-icon @click="toProject(props.item.id)">mdi-plus</v-icon>
                        </template>
                        <template v-slot:item.pid="props">
                            <v-btn @click="deleteProject(props.item.id)">删除</v-btn>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-container>
    </v-content>
    </v-app>
</template>
<script>
import {getProjectsSingle, addProject, delProject, putProject} from "../request/api";
export default {
    name: 'Project',
    data: () => ({
        errMsg: "",
        dialogErr: false,
        projects: [],
        dialog: false,
        dialogDelete: false,
        projectName: "",
        projectUrl: "",
        searchProject: null,
        isLoading: true,
        userId: 0,
        projectToBeDelete: {projectName: "haha"},
        nameRules: [
            v => !!v || "project name is required"
        ],
        gitRules: [
            v => !!v || "git url is required",
            v => {
                //TODO:git地址的正则表达式
                v;
                return true || "should be git url";
            }
        ],
        projectHeaders:[
            {text: "项目名(点击可修改)", value: "projectName"},
            {text: "顶点数", value: "vertexNum"}, 
            {text: "边数", value: "edgeNum"}, 
            {text: "连通域数", value: "connectiveDomainNum"},
            {text: "选择", value: "id"},
            {text: "删除", value: "pid"}
        ]
    }),methods:{
        setProjects(){
            console.log("onMount, UserId: " + this.$store.state.userId);
            getProjectsSingle(this.$store.state.userId).then(res => {
                console.log("getProjects");
                console.log(res.data);
                this.projects = res.data;
                this.projects.forEach(p => {
                    p.pid = p.id;
                });
                this.isLoading = false;
                }).catch(err => this.Alert(err.response.data.errMsg));
            // getProjects(this.$store.state.userId).then(res => {
            //     console.log(res.data);
            //     this.projects = res.data;
            // }).catch(err => console.log(err));
        },
        addProject(){
            console.log("projectName : " + this.projectName);
            console.log("projectUrl : " + this.projectUrl);
            console.log("UserId : " + this.$store.state.userId);
            addProject(this.projectName, this.projectUrl, this.$store.state.userId).then(res => {
                console.log(res);
                this.dialog = false;
                this.setProjects();
            }).catch(err => {
                this.Alert(err.response.data.errMsg);
            })
            
        },
        /**
         * 进入这个项目
         */
        toProject(i){
            console.log(i);
            this.$store.commit("setProjectId",i);
            this.$router.push("/dependency");
        },Alert(msg){
        this.errMsg = msg;
        this.dialogErr = true;
        },
        logout(){
            this.$store.commit("setUserId", 0);
            this.$router.push('/login');
        },
        deleteProject(i){
            console.log(i);
            this.projects.forEach(p => {
                if(p.id == i){
                    this.projectToBeDelete = p;
                }
            });
            this.dialogDelete = true;
        },
        deleteProjectConfirmed(){
            console.log("delete project");
            console.log(this.projectToBeDelete);
            delProject(this.projectToBeDelete.id).then(res => {
                console.log(res);
                this.dialogDelete = false;
                this.Alert("删除成功");
                var index = this.projects.indexOf(this.projectToBeDelete);
                if(index > -1){
                    this.projects.splice(index, 1);
                }
            }).catch(err => {
                this.Alert(err.response.data.errMsg);
            })

        },
        saveProjectName(p){
            console.log(p);
            putProject(p.id, p.projectName).then(res => {
                console.log(res);
            }).catch(err => {
                this.Alert(err.response.data.errMsg);
            });

        }

        

    },mounted(){
        this.userId = this.$store.state.userId;
        console.log("userId ", this.userId);
        console.log(this.userId);
        if(this.userId == 0){
            this.$router.push('/login');
        }
    
        //TODO:debug
        //this.userId = 233;
        this.setProjects();
        
    }
    
}
</script>