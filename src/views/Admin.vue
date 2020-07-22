<template>
    <v-app id="admin">
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <SnackbarAlertComponent ref="snackbar_alert_component"></SnackbarAlertComponent>
        <DialogAlertComponent ref="dialog_alert_component"></DialogAlertComponent>
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
                    <v-list-item
                        v-for="(item, i) in projectDetail"
                        :key="i"
                        mandatory="true"
                        >
                        <v-list-item>
                            <v-col cols="6">
                            {{projectDetailHeader[i]}}
                            </v-col>
                            <v-col cols="6">
                            {{projectDetail[i]}}
                            </v-col>
                        </v-list-item>
                    </v-list-item>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="dialogUser"
            width="800">
            <v-card
            justify="center"
            >
            <v-data-table
                no-data-text="无项目"
                :headers="projectHeaders"
                :items="singleUserProjects"
            >
                <template v-slot:item.id="props">
                    <v-icon @click="checkProject(props.item.id)">mdi-plus</v-icon>
                </template>
            </v-data-table>
            </v-card>
        </v-dialog>
       <v-app-bar
            app
            clipped-left
            color="#5A7797"
            class="white--text"
        > 
            <span class="title ml-3 mr-5">管理员:&nbsp;<span class="font-weight-light white--text">{{adminname}}</span></span>

            <v-spacer />
            <v-spacer />
            <v-spacer />
            <v-spacer />

            <v-btn text @click="adminLogout" class="white--text"><i class="material-icons mr-2">login</i>退出登录</v-btn>

        </v-app-bar>
        <v-main>
            <v-card class="mb-5 mr-5 ml-5 mt-5">
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
            <v-card class="mb-5 mr-5 ml-5">
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
                        
                        @item-expanded="checkUserAllProject"
                    >
                        <template v-slot:item.id="props">
                            <v-icon @click="checkUserAllProject(props.item.id)">mdi-plus</v-icon>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
            <v-card class="mb-5 mr-5 ml-5 mt-5">
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
            <v-card class="mb-5 mr-5 ml-5 mt-5">
                <v-card-title>
                    小组列表
                    <v-spacer></v-spacer>
                    <v-text-field
                        v-model="searchGroup"
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
                        :headers="groupDetailHeaders"
                        :items="groupDetail"
                        :search="searchGroup"
                        @click:row="checkGroup"
                    >
                        <!-- <template v-slot:item.id="props">
                            <v-icon @click="checkGroup(props.item.id)">mdi-plus</v-icon>
                        </template> -->
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-main>
    </v-app>

</template>
<script>
import {getProjectBasicAttributeAll, getAllUsers, getProjectProfile, getProjectsSingle, API} from "../request/api";
import SnackbarAlertComponent from "../components/SnackbarAlert";
import DialogAlertComponent from "../components/DialogAlert";
export default {
    components: {
      SnackbarAlertComponent,
      DialogAlertComponent
    },
    data(){
        return {
            errMsg: "",
            dialogErr: false,
            dialogProject: false,
            dialogUser: false,
            adminname: "leo",
            isLoading: true,
            isLoadingUser: true,
            users: [
            ],
            projects:[
            ],
            singleUserProjects:[],//某个用户的所有项目
            projectHeaders: [
                {text: "项目名", value: "projectName"}, 
                {text: "顶点数", value: "vertexNum"}, 
                {text: "边数", value: "edgeNum"}, 
                {text: "连通域数", value: "connectiveDomainNum"}, 
                {text: "查看详情", value: "id"}
            ],
            userHeaders: [
                {text: "用户名", value: "username"},
                {text: "查看详情", value: "id"},
            ],
            projectDetail: [

            ],
            projectDetailHeader: {
                projectName: "项目名",
                vertexNum: "顶点数",
                edgeNum: "边数",
                connectiveDomainNum: "连通域数",
                subgraphNum: "子图数",
                vertexAnotationNum: "顶点标注数",
                edgeAnotationNum: "边标注数",
                connectiveDomainAnotationNum: "连通域标注数",
            },
            groupDetail: [
                {id: 1, name: "1", noticeNum: 0, taskNum: 0, memberNum: 1},
                {id: 2, name: "2", noticeNum: 0, taskNum: 0, memberNum: 2},
                {id: 3, name: "3", noticeNum: 0, taskNum: 0, memberNum: 3}
            ],
            groupDetailHeaders: [
                {text: "小组名", value: "name"},
                {text: "公告数", value: "noticeNum"},
                {text: "任务数", value: "taskNum"},
                {text: "人数", value: "memberNum"},
            ],
            searchProject: null,
            searchUser: null,
            searchGroup: null
        }
    }, mounted(){
        if(this.$store.getters.adminId == 0){
            this.$router.push("/adminLogin");
        }
        this.adminname = this.$store.state.adminName;
        getProjectBasicAttributeAll().then(res => {
            //console.log(res);
            this.projects = res.data;
            this.isLoading = false;
        }).catch(err => {
            this.Alert(err.response.data.errMsg);
        });
        getAllUsers().then(res => {
            //console.log(res);
            this.users = res.data;
        }).catch(err => {
            this.Alert(err.response.data.errMsg);
        });
        API.getGroupStatistic().then(res => {
            console.log(res);
            this.groupDetail = res.data;
            this.groupDetail.forEach(item => {
                if(!item.noticeNum && typeof item.noticeNum != "undefined" && item.noticeNum != 0){
                    //判断是否是null
                    item.noticeNum = 0;
                }
                if(!item.taskNum && typeof item.taskNum != "undefined" && item.taskNum != 0){
                    item.taskNum = 0;
                }
            });
            console.log(this.groupDetail);
        }).catch(err => {
            if(typeof err.resopnse.data.errMsg === "undefined"){
                console.log(err);
            }else {
                this.Alert(err.resopnse.data.errMsg);
            }
        })
    }, methods: {
        debug(msg){
            if(!msg){
                console.log("haha");
                return;
            }
            console.log(msg);
        },
        Alert(msg){
        // this.errMsg = msg;
        // this.dialog = true;
            this.dialog_alert(msg);
        },
        snack(msg, btns){
            this.$refs.snackbar_alert_component.snack(msg, btns);
        },
        dialog_alert(msg, func1, func2){
            this.$refs.dialog_alert_component.Alert(msg, func1, func2);
        },
        clickProject(){
            //console.log("haha");
        },checkProject(id){
            //console.log(id);
            // getProject(id).then(res => {

            // }).carch(err => {

            // })
            this.dialogProject = true;
            getProjectProfile(id).then(res => {
                //console.log(res);
                this.projectDetail = res.data;
                delete this.projectDetail.id;
                

            }).catch(err => {
                this.Alert(err.response.data.errMsg);
            })

        },
        adminLogout(){
            this.$store.commit('setAdminId', 0);
            this.$router.push("/adminLogin");
        },
        //查看某个用户的所有project
        checkUserAllProject(id){
            getProjectsSingle(id).then(res =>{
                //console.log(res);
                this.singleUserProjects = res.data;
                this.dialogUser = true;
            }).catch(err => {
                console.log(err);
            })
            //console.log(id);
        },
        checkGroup(group){
            this.Alert("选中小组" + group.id);
        }
    }
}
</script>