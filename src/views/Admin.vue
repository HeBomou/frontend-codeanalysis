<template>
    <v-app id="admin">
        <v-dialog
        v-model="dialogErr"
        width="500">
            <v-card
            justify="center"
            >
                <v-card-title>{{errMsg}}</v-card-title>
                <v-card-text>
                    <v-btn color="error" @click="dialogErr=false">确定</v-btn>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="dialogProject"
            width="500">
            <v-card
            justify="center"
            >
                <v-card-title>项目详细信息</v-card-title>
                <v-card-text>
                    //TODO:
                    详细信息
                </v-card-text>
            </v-card>
        </v-dialog>
       <v-app-bar
            app
            clipped-left
            color="amber"
        > 
            <span class="title ml-3 mr-5">管理员:&nbsp;<span class="font-weight-light">{{adminname}}</span></span>

            <v-spacer />
            <v-spacer />
            <v-spacer />

            <v-btn>退出登录</v-btn>

            <v-spacer />
        </v-app-bar>
        <v-content>
            <v-card>
                <v-card-title>基本信息</v-card-title>
                <v-card-text>
                    <v-list-item
                    >
                        <v-list-item-content>
                            <v-list-item-title>
                                项目总数：{{projects.length}}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title>
                                用户总数：{{users.length}}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-card-text>
            </v-card>
            <v-card>
                <v-card-title>
                    用户列表
                    <v-spacer></v-spacer>
                    <v-text-field
                        v-model="searchUser"
                        append-icon="mdi-magnify"
                        label="Search"
                        single-line
                        hide-details
                    ></v-text-field>
                </v-card-title>
                <v-card-text>
                    <v-data-table
                        :headers="userHeaders"
                        :items="users"
                        :search="searchUser"
                    >
                    </v-data-table>
                </v-card-text>
            </v-card>
            <v-card>
                <v-card-title>
                    项目列表
                    <v-spacer></v-spacer>
                    <v-text-field
                        v-model="searchProject"
                        append-icon="mdi-magnify"
                        label="Search"
                        single-line
                        hide-details
                    ></v-text-field>
                </v-card-title>
                <v-card-text>
                    <v-data-table
                        :loading="isLoading"
                        loading-text="Loading... Please wait"
                        :headers="projectHeaders"
                        :items="projects"
                        :search="searchProject"
                        @click:row="clickProject()"
                    >
                        <template v-slot:item.id="props">
                            <v-icon @click="checkProject(props.item.id)">mdi-plus</v-icon>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-content>
    </v-app>

</template>
<script>
import {getProjectBasicAttributeAll, getAllUsers, } from "../request/api";
export default {
    data(){
        return {
            errMsg: "",
            dialogErr: false,
            dialogProject: false,
            adminname: "leo",
            isLoading: true,
            users: [
            ],
            projects:[
            ],
            projectHeaders: [
                {text: "项目名", value: "projectName"}, 
                {text: "顶点数", value: "vertexNum"}, 
                {text: "边数", value: "edgeNum"}, 
                {text: "连通域数", value: "connectiveDomainNum"}, 
                {text: "查看详情", value: "id"}
            ],
            userHeaders: [
                {text: "用户名", value: "username"}
            ],
            searchProject: null,
            searchUser: null
        }
    }, mounted(){
        getProjectBasicAttributeAll().then(res => {
            console.log(res);
            this.projects = res.data;
            this.isLoading = false;
        }).catch(err => {
            this.Alert(err.response.data.errMsg);
        });
        getAllUsers().then(res => {
            console.log(res);
            this.users = res.data;
        }).catch(err => {
            this.Alert(err.response.data.errMsg);
        })
    }, methods: {
        Alert(msg){
            this.errMsg = msg;
            this.dialogErr = true;
        },clickProject(){
            console.log("haha");
        },checkProject(id){
            console.log(id);
            // getProject(id).then(res => {

            // }).carch(err => {

            // })
            this.dialogProject = true;

        }
    }
}
</script>