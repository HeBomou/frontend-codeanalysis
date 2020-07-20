<template>
    <div>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet">
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
            <v-card color="#5A7797" class="white--text">
                <v-card-title>增加项目</v-card-title>
                <v-card-text>
                    <div class="white--text">1.请上传maven项目；非maven项目请在项目根目录创建target文件夹，其中放进此项目编译的jar包</div>
                    <div class="white--text">2.建议使用国内的git仓库（gitee, gitlab），尽量不要使用github，因为会比较慢</div>
                    <div class="white--text">3.暂时不支持私有项目</div>
                    <v-form class="mt-5">
                        <v-text-field
                            class="mr-0 ml-0"
                            v-model="projectName"
                            label="项目名"
                            clearable
                            required
                            flat
                            outlined
                            rounded
                            :rules="nameRules"
                            dark
                            >
                        </v-text-field>
                        <v-text-field
                            class="mr-0 ml-0"
                            v-model="projectUrl"
                            label="git地址"
                            clearable
                            required
                            flat
                            outlined
                            rounded
                            :rules="gitRules"
                            dark
                            >
                        </v-text-field>
                    </v-form>
                </v-card-text>
                <v-divider class="mt-5"></v-divider>
                <v-card-actions>
                    <v-btn
                            color="error"                                        
                            @click="dialog=false"
                            text
                        >取消
                    </v-btn>
                    <v-spacer />
                    <v-btn
                        color="success"                                        
                        @click="addProject"
                        :disabled="addProjectConfirmPressed"
                        text
                    >
                        <div v-if="addProjectConfirmPressed">
                            <v-progress-circular indeterminate color="white"></v-progress-circular>
                        </div>
                        <div v-else>
                            确定
                        </div>
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
                            :disabled="deleteProjectConfirmPressed"
                        >
                            <div v-if="deleteProjectConfirmPressed">
                                <v-progress-circular indeterminate color="white"></v-progress-circular>
                            </div>
                            <div v-else>
                                确定
                            </div>
                        </v-btn>
                        
                        <v-btn
                            color="error"   
                            @click="dialogDelete=false;"
                            
                        >取消
                        </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
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
                <v-btn @click="dialog=true" color="success" class="ml-5">添加</v-btn>
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
                        
                        <!-- <v-icon @click="toProject(props.item.id)">mdi-plus</v-icon> -->
                        <v-btn fab height="30" width="30" elevation="2">
                            <i @click="toProject(props.item.id)" class="material-icons">search</i>
                        </v-btn>
                    </template>
                    <template v-slot:item.pid="props">
                        <v-btn @click="deleteProject(props.item.id)" fab height="30" width="30" elevation="2"><i class="material-icons">clear</i></v-btn>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </div>
</template>
<script>
import {delProject, putProject} from "../request/api";
export default {
    name: 'ProjectComponent',
    props:{
        //获得某实体得所有项目得基本信息
        getProjectBasicAttribute: {
            required: true,
            type: Function
        },
        //为某实体添加一个项目
        postProject: {
            required: true,
            type: Function
        }

    },
    data: () => ({
        entityId: 0,
        errMsg: "",
        dialogErr: false,
        addProjectConfirmPressed: false,//转菊花判断
        deleteProjectConfirmPressed: false,
        projects: [],
        dialog: false,
        dialogDelete: false,
        projectName: "",
        projectUrl: "",
        searchProject: null,
        isLoading: true,
        //userId: 0,
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
            {text: "详情", value: "id"},
            {text: "删除", value: "pid"}
        ]
    }),methods:{
        //获取所有得项目相关信息
        setProjects(id){
            this.isLoading = true;
            this.entityId = id;
            console.log("setProjects");
            console.log(this.entityId);
            this.getProjectBasicAttribute(this.entityId).then(res => {
                this.projects = res.data;
                this.projects.forEach(p => {
                    p.pid = p.id;
                    if(p.vertexNum == -1){
                        p.vertexNum = '-';
                    }
                    if(p.edgeNum == -1){
                        p.edgeNum = '-';
                    }
                    if(p.connectiveDomainNum == -1){
                        p.connectiveDomainNum = '-';
                    }
                });
                this.isLoading = false;
            }).catch(err => this.Alert(err.response.data.errMsg));
        },
        //添加一个项目
        addProject(){
            console.log("addProject");
            console.log(this.entityId);
            this.addProjectConfirmPressed = true;
            this.postProject(this.projectName, this.projectUrl, this.entityId).then(res => {
                console.log(res);

                this.dialog = false;
                this.setProjects(this.entityId);
                this.projectName = "";
                this.projectUrl = "";
                this.addProjectConfirmPressed = false;
            }).catch(err => {
                this.addProjectConfirmPressed = false;
                this.Alert(err.response.data.errMsg);
            });
            
        },
        /**
         * 进入这个项目
         */
        toProject(i){
            //console.log(i);
            this.$store.commit("setProjectId",i);
            this.$router.push("/dependency");
        },Alert(msg){
        this.errMsg = msg;
        this.dialogErr = true;
        },
        deleteProject(i){
            //console.log(i);
            this.projects.forEach(p => {
                if(p.id == i){
                    this.projectToBeDelete = p;
                }
            });
            this.dialogDelete = true;
        },
        deleteProjectConfirmed(){
            this.deleteProjectConfirmPressed = true;
            delProject(this.projectToBeDelete.id).then(res => {
                console.log(res);
                this.dialogDelete = false;
                this.Alert("删除成功");
                var index = this.projects.indexOf(this.projectToBeDelete);
                if(index > -1){
                    this.projects.splice(index, 1);
                }
                this.deleteProjectConfirmPressed = false;
            }).catch(err => {
                this.deleteProjectConfirmPressed = false;
                this.Alert(err.response.data.errMsg);

            })
        },
        saveProjectName(p){
            putProject(p.id, p.projectName).then(res => {
                console.log(res);
            }).catch(err => {
                this.Alert(err.response.data.errMsg);
            });

        },
        haha(){
            console.log("haha");
        }
    },mounted(){
    }
    
}
</script>