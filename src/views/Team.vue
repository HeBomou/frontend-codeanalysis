<template>
<v-app id="keep">
    <div>
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
            v-model="dialogInvite"
            width="500">
            <v-card>
                <v-card-title>请复制以下链接发送到组员</v-card-title>
                <v-card-text>
                    <p>{{inviteLink}}</p>
                    <v-btn color="error" @click="dialogInvite=false">确定</v-btn>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="dialogNewGroup"
            width="500">
            <v-card>
                <v-card-title>创建小组</v-card-title>
                <v-card-text>
                    <v-form
                        v-model="newGroupValid"
                        ref="form"
                    >
                        <v-text-field
                        class="mr-5 ml-5"
                        v-model="newGroupName"
                        :rules="newGroupNameRules"
                        label="Group Name"
                        clearable
                        required
                        flat
                        outlined
                    ></v-text-field>
                    <v-btn
                        class="mr-5 ml-5"
                        color="success"
                        :disabled="!newGroupValid"
                        @click="confirmNewGroup"
                    >
                    确定
                    </v-btn>
                    
                    <v-btn
                        class="mr-5 ml-5"
                        color="error"
                        @click="newGroupName='';dialogNewGroup=false;"
                    >
                    取消
                    </v-btn>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="dialogDeleteGroup"
            width="500">
            <v-card>
                <v-card-title>删除小组"{{groupTobeDeleted.name}}"?</v-card-title>
                <v-card-text>
                    <v-btn
                        class="mr-5 ml-5"
                        color="success"
                        @click="deleteGroup(groupTobeDeleted);dialogDeleteGroup=false"
                    >
                    确定
                    </v-btn>
                    
                    <v-btn
                        class="mr-5 ml-5"
                        color="error"
                        @click="dialogDeleteGroup=false"
                    >
                    取消
                    </v-btn>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="dialogNewNotice"
            width="500">
            <v-card>
                <v-card-title>新建公告</v-card-title>
                <v-card-text>
                    <v-form
                        v-model="newNoticeValid"
                        ref="form"
                    >
                        <v-text-field
                            v-model="newNoticeTitle"
                            :rules="newNoticeRules.newNoticeTitleRules"
                            label="标题"
                            clearable
                            required
                            flat
                            outlined
                        ></v-text-field>
                        <v-textarea
                            v-model="newNoticeText"
                            :rules="newNoticeRules.newNoticeTextRules"
                            label="公告内容"
                            required
                            flat
                            outlined
                        ></v-textarea>
                        <v-btn
                            class="mr-5 ml-5"
                            color="success"
                            :disabled="!newNoticeValid"
                            @click="confirmNewNotice"
                        >
                        确定
                        </v-btn>
                        
                        <v-btn
                            class="mr-5 ml-5"
                            color="error"
                        >
                        取消
                        </v-btn>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
    
    <v-app-bar
        app
        clipped-left
        color="amber"
        >
            <span class="title ml-3 mr-5">我的小组</span>
            <v-spacer />
            <v-spacer />
            <v-spacer />
            <v-btn @click="toProject" class="mr-5">我的项目</v-btn>
            <v-btn @click="logout">退出登录</v-btn>
        </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      color="grey lighten-4"
    >
        <v-list shaped>
            <v-subheader>GROUPS<v-spacer></v-spacer><v-icon @click="dialogNewGroup=true">mdi-plus</v-icon></v-subheader>      
            <v-list-item-group 
                v-model="groupChosenIndex" 
                color="primary" 
                mandatory="mandatory"
                @change="change"
            >
                <v-list-item
                v-for="(item, i) in groups"
                :key="i"
                >
                    <v-list-item-content>
                        <v-list-item-title v-text="item.name"></v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-icon @click="dialogDeleteGroup=true;groupTobeDeleted=item">
                        <v-icon>mdi-delete</v-icon>
                    </v-list-item-icon>
                </v-list-item>
            </v-list-item-group>
        </v-list>
    </v-navigation-drawer>

    <v-content>
      <v-container
      >
        <v-tabs>
        <v-tab>成员列表</v-tab>
        <v-tab-item>
            <!-- 成员列表 -->
            <v-simple-table>
                <thead>
                    <tr>
                        <th class="text-left">Name</th>
                        <th class="text-left">权限</th>
                        <th class="text-left">其他</th>
                    </tr>
                </thead>
                 <tbody>
                    <tr v-if="user.level==='leader'">
                        <td></td>
                        <td><v-icon @click="setInvite">mdi-plus</v-icon></td>
                        <td></td>
                    </tr>
                    <tr v-for="item in teamMember" :key="item.name">
                        <td>{{ item.username }}</td>
                        <td>{{ item.level }}</td>
                        <td>
                            <v-menu offset-y>
                                <template v-slot:activator="{ on }">
                                    <v-icon
                                    v-on="on"
                                    >
                                    mdi-plus
                                    </v-icon>
                                </template>
                                <v-list>
                                    <v-list-item
                                        @click="deleteMember(item)"
                                        :disabled="!hasHigherLevel(user.level, item.level)"
                                    >
                                        <v-list-item-title>移除成员</v-list-item-title>
                                    </v-list-item>
                                    <v-menu top offset-x>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-list-item
                                                v-bind="attrs"
                                                v-on="on"
                                                :disabled="user.level!='leader'"
                                            >
                                                <v-list-item-title>更改权限</v-list-item-title>
                                            </v-list-item>
                                        </template>

                                        <v-list
                                            
                                        >
                                            <v-list-item
                                            v-for="level in levels"
                                            :key="level"
                                            @click="changeLevel(item, level)"
                                            >
                                            <v-list-item-title>{{level}}</v-list-item-title>
                                            </v-list-item>
                                        </v-list>
                                    </v-menu>
                                    <v-list-item
                                        @click="chatTo(item)"
                                    >
                                        <v-list-item-title>私聊</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                    </tr>
                </tbody>
            </v-simple-table>
        </v-tab-item>
        <v-tab>项目列表</v-tab>
        <v-tab-item>
            <!-- 项目列表 -->
            <!-- <v-card>
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
                            
                            <v-icon @click="toProject(props.item.id)">mdi-plus</v-icon>
                        </template>
                        <template v-slot:item.pid="props">
                            <v-btn @click="deleteProject(props.item.id)">删除</v-btn>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card> -->
        </v-tab-item>
        <v-tab>任务列表</v-tab>
        <v-tab-item>
            任务列表
            <v-simple-table>
                <thead>
                    <tr>
                        <th class="text-left">Name</th>
                        <th class="text-left">DDL</th>
                        <th class="text-left">执行者</th>
                        <th class="text-left">其他</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in tasks" :key="item.name">
                        <td>{{ item.name }}</td>
                        <td>{{ item.ddl }}</td>
                        <td>{{ item.person }}</td>
                        <td>
                            <v-menu offset-y>
                                <template v-slot:activator="{ on }">
                                    <v-icon
                                    v-on="on"
                                    >
                                    mdi-plus
                                    </v-icon>
                                </template>
                                <v-list>
                                    <v-list-item
                                        @click="debug()"
                                    >
                                        <v-list-item-title>
                                        指定执行者
                                        </v-list-item-title>
                                    </v-list-item>
                                    <v-list-item
                                        @click="debug()"
                                    >
                                        <v-list-item-title>
                                        提交
                                        </v-list-item-title>
                                    </v-list-item>
                                    <v-list-item
                                        @click="debug()"
                                    >
                                        <v-list-item-title>
                                        删除
                                        </v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                    </tr>
                </tbody>
            </v-simple-table>
        </v-tab-item>
        <v-tab>小组公告</v-tab>
        <v-tab-item>
            <!-- 小组公告 -->
            
            <v-list>
                <v-list-item>
                    <v-card style="width:1000%" class="ml-10 mr-10 mt-10" justify="center" align="center" @click="dialogNewNotice=true">
                        <v-col cols="5"></v-col>
                        <v-col cols="2">
                            <v-card-title><v-icon>mdi-plus</v-icon></v-card-title>
                        </v-col>
                        <v-col cols="5"></v-col>
                    </v-card>
                </v-list-item>
                <v-list-item
                v-for="(notice, i) in notices"
                :key="i"
                >
                    <v-card style="width:1000%" class="ml-10 mr-10 mt-10">
                        <v-card-title>{{notice.title}}   <v-spacer />发布者：{{notice.person}}<v-spacer />时间:{{notice.time}} </v-card-title>
                        <v-card-text><div class="text-wrapper">{{notice.content}}</div></v-card-text>
                    </v-card>
                </v-list-item>
            </v-list>
        </v-tab-item>
    </v-tabs>
      </v-container>
    </v-content>
  </v-app>
    
</template>
<script>
import {getAllGroup, getMembers, postGroup, putMember, API} from "../request/api";
export default {
    data(){
        return {
            userId: 0,
            errMsg: "",
            dialogErr: false,
            dialogNewGroup: false,
            dialogInvite: false,
            dialogDeleteGroup: false,
            dialogNewNotice: false,
            groupTobeDeleted:{},
            drawer: true,
            groupChosenIndex: 1,//当前选中的组, 为groups列表的index。
            groupChosen: {id: 123, leaderId: 234, name: "group haha", inviteCode: 123123},
            searchProject: 1,//项目列表中正在搜索的项目
            isLoading: true,
            mandatory: true,
            newGroupValid: false,//新建小组输入内容是否合法,
            user: {id: 0, username: "leo", level: "manager"},//当前用户在组中的身份
            newNoticeValid: true,
            newNoticeTitle: "",
            newNoticeText:"",
            newNoticeRules:{
                newNoticeTitleRules:[
                    v => !!v || 'title is required',
                    v => (v && v.length <= 10) || 'title must be less than 10 characters',
                ],
                newNoticeTextRules:[
                    v => !!v || 'text is required',
                ]
            },
            levels: [
                "manager",
                "member"
            ],
            levelsTable: [
                {level: "leader", index: 3},
                {level: "manager", index: 2},
                {level: "member", index: 1},

            ],
            teamMember: [
                {id: 1, username: "leo", level: "manager"},
                {id: 2, username: "yzj", level: "leader"}
            ],
            notices: [
                {title: "标题1", person: "leo", time: "2020-1-1", content: "-孙哥，他们去恰烧烤\n-你说的他们⾸先是谁，去那⾥恰，什么时候去的，我⼀问三不知。就我都没去，你都知道的，我，我不知道你⼀直在那⼉问。这种⼈是不是脑淤⾎啊我发觉，就别⼈不知道的⼀直在那问，那我叫你说你⼜说不归⼀，说不清楚。你⾃⼰是不是语⾔表达能⼒特别差，还是⾃⼰的脑回路有问题嘛。"},
                {title: "标题2", person: "yzj", time: "2020-1-1", content: "1111111111111111111111111          "},
            ],
            tasks: [
                {name: "foo", ddl:"2020-1-1", person:"leo"}
            ],
            groups: [
                {id: 123, leaderId: 234, name: "group haha", inviteCode: 123123},
                {id: 234, leaderId: 333, name: "hahasdf df", inviteCode: 234234},
                {id: 3, leaderId: 333, name: "3", inviteCode: 234234},
                {id: 4, leaderId: 333, name: "4", inviteCode: 234234}


            ],
            newGroupNameRules:[
                v => !!v || 'Name is required',
                v => (v && v.length <= 10) || 'Name must be less than 10 characters',
            ],
            newGroupName: "",
            joinGroupInviteCode: "",
            inviteLink: ""
        }
    }
    ,methods: {
        Alert(msg){
            this.errMsg = msg;
            this.dialogErr = true;
        },
        toProject(){
            this.$router.push("/project");
        },
        debug(){
            console.log(this.groupChosenIndex);
        },
        debug1(haha){
            console.log(haha);
        }
        ,
        logout(){
            this.$store.commit("setUserId", 0);
            this.$router.push('/login');
        },
        //gourp side bar进行选择的事件回调函数
        change(val){
            //console.log(val);
            this.selectGroup(this.groups[val].id);
            //console.log(this.groupChosen);
        },
        /**
         * 选择了某个小组，UI进行选择，调用后端，更新页面显示的相关信息。
         */
        selectGroup(groupId){
            this.groupChosenIndex = this.groups.findIndex(item => item.id === groupId);
            this.groupChosen = this.groups[this.groupChosenIndex];
            //console.log(this.groupChosen);
            getMembers(groupId).then(res => {
                //console.log(res);
                //TODO:更新所有的小组相关信息
                this.teamMember = res.data;

                this.user = this.teamMember.find(item => {
                    return item.id == this.userId;
                });
                //console.log(this.user);
                //获取小组公告
                this.getNotice();
            }).catch(err => {
                this.Alert(err.response.data.errMsg);
            })
        },
        getNotice(){
            API.getNotice(this.groupChosen.id).then(res => {
                this.notices = res.data;
            }).catch(err => {
                this.Alert(err.response.data.errMsg);
            })
        },
        //获取所有小组
        getGroups(){
            getAllGroup(this.userId).then(res => {
                console.log(res);
                this.groups = res.data;
                if(this.groups.length == 0){
                    return;
                }
                this.selectGroup(this.groups[this.groups.length - 1].id);//由于考虑到新的组在最后，所以获取小组后默认选择最后一个
            }).catch(err => this.Alert(err));
        },
        confirmNewGroup(){
            this.dialogNewGroup = false;
            postGroup({leaderId: this.userId, name: this.newGroupName}).then(res => {
                res;
                this.newGroupName = "";
                this.Alert("创建成功");
                this.getGroups();
            }).catch(err => {
                this.Alert(err.response.data.errMsg);
            })
        },
        confirmJoinGroup(){

        },
        setInvite(){
            this.dialogInvite = true;
            this.inviteLink = window.location.host + "/#/invite?groupId=" + this.groupChosen.id + "&inviteCode=" + this.groupChosen.inviteCode + "&groupName=" + escape(this.groupChosen.name) + "&leader=" + this.user.username;
            this.inviteLink = this.inviteLink.replace(/%/g, '%25');
            
        },
        changeLevel(user, level){
            putMember(this.groupChosen.id, user.id, level).then(res => {
                res;
                this.teamMember.find(item => item.id == user.id).level = level;
            }).catch(err => {
                console.log(err);
                this.Alert(err.response.data.errMsg);
            })
        },
        hasHigherLevel(from, to){
            let index1 = this.getLevelIndex(from);
            let index2 = this.getLevelIndex(to);
            return index1 > index2;
        },
        getLevelIndex(level){
            let levelr = this.levelsTable.find(item => item.level == level);
            return levelr.index;
        },
        deleteMember(user){
            API.deleteMember(this.groupChosen.id, user.id).then(res => {
                console.log(res);
            }).catch(err => {
                console.log(err);
            })
        },
        deleteGroup(item){
            API.deleteGroup(item.id).then(res => {
                console.log(res);
                this.getGroups();
            }).catch(err => {
                this.Alert(err.response.data.errMsg);
            })
        },
        confirmNewNotice(){
            var myDate = new Date();
            API.postNotice({
                id: 0,
                groupId: this.groupChosen.id,
                title: this.newNoticeTitle,
                content: this.newNoticeText,
                time: myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate()
            }).then(res => {
                console.log(res);
                this.getNotice();
            }).catch(err => {
                this.Alert(err.response.data.errMsg);
            })
        },
        chatTo(item){
            let routeUrl = this.$router.resolve({
                path: "/chat",
                query: {newContact:item.id}
            });
            window.open(routeUrl.href, '_blank');
        }
    }
    ,mounted(){
        this.userId = this.$store.getters.userId;
        if(this.userId == 0){
            this.$router.push('/login');
        }
        this.getGroups();
    }
}
</script>
<style scoped>
.text-wrapper {
  white-space: pre-wrap;
}
</style>