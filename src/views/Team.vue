<template>
<v-app id="keep">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet">
    <div>
        <SnackbarAlertComponent ref="snackbar_alert_component"></SnackbarAlertComponent>
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
            <v-card color="#5A7797">
                <v-card-title class="white--text">请将以下链接发送到组员</v-card-title>
                <v-card-text>
                    <p class="white--text">{{inviteLink}}</p>
                </v-card-text>
                <v-card-actions>
                     <v-spacer></v-spacer>
                    <v-btn 
                        right
                        color="#5A7797" 
                        v-clipboard:error="onErrorCopy"
                        v-clipboard:copy="inviteLink"  
                        v-clipboard:success="onCopy" 
                        @click="dialogInvite=false"
                        class="white--text"
                        elevation="0"
                        ><span class="material-icons">
                            content_copy
                            </span>复制到剪切版</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="dialogNewGroup"
            width="500">
            <v-card class="white--text" color="#5A7797">
                <v-card-title>创建小组</v-card-title>
                <v-card-text>
                    <v-form
                        v-model="newGroupValid"
                        ref="form"
                        class="mt-3"
                    >
                        <v-text-field
                        v-model="newGroupName"
                        :rules="newGroupNameRules"
                        label="Group Name"
                        clearable
                        required
                        flat
                        outlined
                        dark
                    ></v-text-field>
                    </v-form>
                </v-card-text>
                <v-divider class="mt-0"></v-divider>
                <v-card-actions>
                    <v-btn
                        depressed
                        class="mr-5 ml-5"
                        color="error"
                        @click="newGroupName='';dialogNewGroup=false;"
                        text
                    >
                    取消
                    </v-btn>
                    <v-spacer />
                    <v-btn
                        depressed
                        class="mr-5 ml-5"
                        color="success"
                        :disabled="!newGroupValid"
                        @click="confirmNewGroup"
                        text
                    >
                    确定
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="dialogNewNotice"
            width="500">
            <v-card color="#5A7797" class="white--text">
                <v-card-title>新建公告</v-card-title>
                <v-card-text class="mt-3">
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
                            dark
                        ></v-text-field>
                        <v-textarea
                            v-model="newNoticeText"
                            :rules="newNoticeRules.newNoticeTextRules"
                            label="公告内容"
                            required
                            flat
                            outlined
                            dark
                        ></v-textarea>
                        
                    </v-form>
                </v-card-text>
                <v-divider class="mt-5"></v-divider>
                <v-card-actions>
                    <v-btn
                            class="mr-5 ml-5"
                            color="error"
                            @click="clearNewNotice()"
                            text
                        >
                        取消
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn
                            class="mr-5 ml-5"
                            color="success"
                            :disabled="!newNoticeValid"
                            @click="confirmNewNotice"
                            text
                        >
                        确定
                    </v-btn>
                        
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="dialogUpdateNotice"
            width="500">
            <v-card>
                <v-card-title>修改公告</v-card-title>
                <v-card-text>
                    <v-form
                        v-model="updateNoticeValid"
                        ref="form"
                    >
                        <v-text-field
                            v-model="updateNoticeTitle"
                            :rules="newNoticeRules.newNoticeTitleRules"
                            label="标题"
                            clearable
                            required
                            flat
                            outlined
                        ></v-text-field>
                        <v-textarea
                            v-model="updateNoticeText"
                            :rules="newNoticeRules.newNoticeTextRules"
                            label="公告内容"
                            required
                            flat
                            outlined
                        ></v-textarea>
                        <v-btn
                            class="mr-5 ml-5"
                            color="success"
                            :disabled="!updateNoticeValid"
                            @click="confirmUpdateNotice();dialogUpdateNotice = false"
                        >
                        确定
                        </v-btn>
                        <v-btn
                            class="mr-5 ml-5"
                            color="error"
                            @click="dialogUpdateNotice = false"
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
        color="#5A7797"
        >
        <v-app-bar-nav-icon @click="drawer=!drawer">
            <i class="material-icons white--text" v-if="!drawer">keyboard_arrow_right</i>
            <i class="material-icons white--text" v-else>keyboard_arrow_left</i>
        </v-app-bar-nav-icon>
            <span class="title white--text" >我的小组</span>
            <v-spacer />
            <v-spacer />
            <v-spacer />
            <v-btn @click="refresh()" class="mr-5 white--text" elevation="0" color="#5A7797" ><i class="material-icons mr-2">refresh</i>刷新</v-btn>
            <v-btn @click="toProject" class="mr-5 white--text" elevation="0" color="#5A7797" ><i class="material-icons mr-2">insights</i>我的项目</v-btn>
            
            <v-btn v-if="haveNewChat" @click="toChat();haveNewChat = false" class="mr-5 white--text amber" elevation="0" color="#5A7797"><i class="material-icons mr-2">sms</i>
                有新消息!
            </v-btn>
            <v-btn v-else @click="toChat();haveNewChat = false" class="mr-5 white--text" elevation="0" color="#5A7797"><i class="material-icons mr-2">sms</i>
                聊天
            </v-btn>
            <v-btn @click="logout" elevation="0" color="#5A7797" class="mr-5 white--text"><i class="material-icons mr-2">login</i>退出登录</v-btn>
        </v-app-bar>
        
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      color="grey lighten-4"
      width="300px"
    >    
        <v-list shaped style="position: relative">
            <v-subheader>
                GROUPS<v-spacer></v-spacer>
            </v-subheader> 
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
                    <v-list-item-icon 
                        @click="deleteGroup(item)"
                        v-if="user.level == 'leader'"
                    >
                        <i class="material-icons">clear</i>
                    </v-list-item-icon>
                    <v-list-item-icon 
                        @click="dropGroup(item)"
                        v-else
                    >
                        <i class="material-icons">clear</i>
                    </v-list-item-icon>
                </v-list-item>
            </v-list-item-group>
        </v-list>
    </v-navigation-drawer>
    

    <v-main>
        <v-fab-transition >
            <v-btn 
                fab 
                color="#5A7797" 
                @click="dialogNewGroup=true"
                absolute
                right
                style="position: fixed; top: 70%; left: 270px; z-index:99900"
                v-show="drawer"
            ><v-icon color="white">mdi-plus</v-icon></v-btn>
        </v-fab-transition>
        <v-overlay :value="groups.length == 0" absolute opacity="0.3">
            <v-btn
                @click="dialogNewGroup = true"
                color="#5A7797"
                
            >
            创建您的第一个小组
            </v-btn>
        </v-overlay>
       
      <v-container
        absolute
        style="position: absolute;"
      >
        <v-tabs>
        <v-tab><i class="material-icons mr-2">insights</i>项目列表</v-tab>
        <v-tab-item>
           <ProjectComponent ref="ProjectComponentTeam" :getProjectBasicAttribute="func1" :postProject="func2"></ProjectComponent>
        </v-tab-item>
        <v-tab><i class="material-icons mr-2">group</i>成员列表</v-tab>
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
                    <tr v-if="user.level==='leader'" @click="setInvite">
                        <td></td>
                        <td><v-icon >mdi-plus</v-icon></td>
                        <td></td>
                    </tr>
                    <tr v-for="item in teamMember" :key="item.id">
                        <td>{{ item.username }}</td>
                        <td>{{ item.level }}</td>
                        <td>
                            <v-menu offset-y>
                                <template v-slot:activator="{ on }">
                                    <!-- <v-icon
                                    v-on="on"
                                    >
                                    mdi-plus
                                    </v-icon> -->
                                    <v-btn fab height="30" width="30" elevation="2" v-on="on">
                                        <i class="material-icons">more_vert</i>
                                    </v-btn>
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
                                                :disabled="user.level!='leader' || item.level=='leader'"
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
       
                            

        <v-tab><i class="material-icons mr-2">rule</i>任务列表</v-tab>
        <v-tab-item>
            <v-container fluid>
                <v-row>
                    <v-col>
                        <v-simple-table>
                            <thead>
                                <tr>
                                    <th>任务列表</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr @click="isAddingTask=true" v-if="hasHigherLevel(user.level, 'member')">
                                    <td>
                                        <v-row>
                                            <v-checkbox disabled />
                                            <v-text-field 
                                                v-model="newTask.name" 
                                                @change="pushNewTask()"
                                                label="new task"/>
                                        </v-row>
                                    </td>
                                </tr>
                                <template v-for="item in tasks">
                                    <tr :key="item.id" @click="selectTask(item)" :bgcolor="getColor(item)">
                                        <td v-if="item.isFinished==0 && !isMineTask(item)">
                                            <v-row >
                                                <v-checkbox 
                                                    v-model="item.isFinished" 
                                                    @change="updateTask(item)" 
                                                    
                                                ></v-checkbox>
                                                <p class="mt-5">{{item.name}}</p>
                                            </v-row>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                            <thead>
                                <tr>
                                    <th>我的任务</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in tasks" :key="item.id" @click="selectTask(item)" :bgcolor="getColor(item)">
                                    <td v-if="isMineTask(item) && !item.isFinished">
                                        <v-row >
                                            <v-checkbox 
                                                v-model="item.isFinished" 
                                                @change="updateTask(item)" 
                                            ></v-checkbox>
                                            <p class="mt-5">{{item.name}}</p>
                                        </v-row>
                                    </td>
                                </tr>
                            </tbody>
                            <thead>
                                <tr>
                                    <th>已完成</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in tasks" :key="item.id" @click="selectTask(item)" :bgcolor="getColor(item)">
                                    <td v-if="item.isFinished!=0">
                                        <v-row>
                                            <v-checkbox 
                                               
                                                v-model="item.isFinished" 
                                                @change="updateTask(item)">
                                            </v-checkbox>
                                            <p class="mt-5">{{item.name}}</p>
                                        </v-row>
                                    </td>
                                </tr>
                            </tbody>
                        </v-simple-table>
                    </v-col>
                    <v-slide-y-transition
                    >
                    <v-col cols="4" v-if="taskChosen.id!=undefined">
                        <v-card >
                            <v-card-actions >
                                <v-container fluid>
                                    <v-row>
                                        <v-checkbox v-model="taskChosen.isFinished" @change="updateTask(taskChosen)"></v-checkbox>
                                        <v-text-field v-if="hasHigherLevel(user.level, 'member')" v-model="taskChosen.name" @change="updateTask(taskChosen)"></v-text-field>
                                        <p class="mt-5" v-else>{{taskChosen.name}}</p>
                                    </v-row>
                                    <v-row>
                                        <v-divider class="mb-5"></v-divider>
                                    </v-row>
                                    <v-row>
                                        <v-list style="width: 100%">
                                            <v-menu top offset-y :close-on-content-click="closeOnContentClick" v-model="menuDate">
                                                <template v-slot:activator="{ on, attrs }">
                                            
                                                    <v-list-item 
                                                        @click="debug()"
                                                        v-bind="attrs"
                                                        v-on="on"
                                                    >
                                                        <v-icon class="mr-3">
                                                            mdi-alarm
                                                        </v-icon>
                                                        <div v-if="taskChosen.deadline!=''">
                                                        {{taskChosen.deadline}}
                                                        </div>
                                                        <div v-else>
                                                            deadLine
                                                        </div>
                                                    </v-list-item>
                                                </template>
                                                <v-date-picker
                                                    style="width: 100%"
                                                    v-model="taskChosen.deadline"
                                                    color="#5A7797"
                                                    @change="updateTask(taskChosen);menuDate=false"
                                                    :disabled="!hasHigherLevel(user.level, 'member')"
                                                ></v-date-picker>

                                            </v-menu>
                                            <v-menu top offset-y :close-on-content-click="closeOnContentClick">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-list-item 
                                                        v-bind="attrs"
                                                        v-on="on"
                                                    >
                                                        <v-icon class="mr-3">
                                                            mdi-account
                                                        </v-icon>
                                                        执行者
                                                    </v-list-item>
                                                </template>
                                                <v-list style="width: 100%">
                                                    <div v-if="hasHigherLevel(user.level, 'member')">
                                                        <div v-for="user in taskMember" :key="user.id">
                                                            <v-list-item  style="width: 100%" @click="user.chosen=!user.chosen">
                                                                <v-checkbox 
                                                                    :label="user.username" 
                                                                    v-model="user.chosen" 
                                                                    style="width: 100%;"
                                                                    @click="user.chosen=!user.chosen"
                                                                    @change="updateExecutor(taskChosen)"
                                                                ></v-checkbox>
                                                            </v-list-item>
                                                        </div>
                                                    </div>
                                                    <div v-else>
                                                        <div v-for="user in taskMember" :key="user.id">
                                                            <v-list-item  style="width: 100%">
                                                                <v-checkbox 
                                                                    :label="user.username" 
                                                                    v-model="user.chosen" 
                                                                    style="width: 100%;"
                                                                    disabled
                                                                ></v-checkbox>
                                                            </v-list-item>
                                                        </div>
                                                    </div>
                                                    
                                                </v-list>
                                            </v-menu>
                                            
                                        </v-list>
                                    </v-row>
                                    <v-row>
                                        <v-divider class="mb-5"></v-divider>
                                    </v-row>
                                    <v-row>
                                        
                                        <v-textarea
                                            class="ml-5 mr-5"
                                            flat
                                            outlined
                                            v-model="taskChosen.info"
                                            @change="updateTask(taskChosen)"
                                            v-if="hasHigherLevel(user.level, 'member')"
                                        ></v-textarea>
                                        <v-card-text v-else>
                                        <div class="text-wrapper">{{taskChosen.info}}</div>
                                        </v-card-text>
                                    </v-row>
                                </v-container>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                    </v-slide-y-transition>

                </v-row>
            </v-container>
        </v-tab-item>
        <v-tab><i class="material-icons mr-2">star_rate</i>小组公告</v-tab>
        <v-tab-item>
            <!-- 小组公告 -->
            
            <v-list>
                <v-list-item v-if="hasHigherLevel(user.level, 'member')">
                    <v-card style="width:1000%" class="ml-10 mr-10 mt-10" justify="center" align="center" @click="dialogNewNotice=true"  >
                        <v-col cols="5"></v-col>
                        <v-col cols="2">
                            <v-card-title><v-icon size="50px" >mdi-plus</v-icon></v-card-title>
                        </v-col>
                        <v-col cols="5"></v-col>
                    </v-card>
                </v-list-item>
                <v-slide-y-transition
                    class="py-0"
                    group
                    tag="v-list"
                >
                <v-list-item
                v-for="(notice, i) in notices"
                :key="i"
                >
                    <v-card style="width:1000%" class="ml-10 mr-10 mt-10" >
                        <v-card-title>{{notice.title}} <v-spacer />{{notice.time}} </v-card-title>
                        <v-card-text><div class="text-wrapper ">{{notice.content}}</div></v-card-text>
                        <v-card-actions style="position: relative" v-if="hasHigherLevel(user.level, 'member')">
                            <v-speed-dial
                                v-model="notice.dial"
                                direction="left"
                                transition="slide-x-reverse-transition"
                                style="position: absolute;top: 10;left: 90%"
                                >
                                <template v-slot:activator>
                                    <v-btn 
                                        fab 
                                        color="pink" 
                                        @click="notice.dial = !notice.dial"
                                    >
                                     
                                        <span class="material-icons white--text">chevron_left</span>
                                        <!-- <span v-else class="material-icons white--text">chevron_left</span> -->
                                    </v-btn>
                                </template>
                                <v-btn
                                    fab
                                    dark
                                    small
                                    color="red"
                                    @click="deleteNotice(notice)"
                                >
                                    <v-icon>delete</v-icon>
                                </v-btn>
                                <v-btn
                                    fab
                                    dark
                                    small
                                    color="green"
                                    @click="
                                        NoticeToBeUpdate = notice; 
                                        dialogUpdateNotice = true;
                                        updateNoticeText = notice.content;
                                        updateNoticeTitle = notice.title;
                                    "
                                >
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                                
                            </v-speed-dial>
                        </v-card-actions>
                    </v-card>
                </v-list-item>
                </v-slide-y-transition>
            </v-list>
        </v-tab-item>
    </v-tabs>
      </v-container>
    </v-main>
  </v-app>
    
</template>
<script>
import {getAllGroup, getMembers, postGroup, putMember, API} from "../request/api";
import SnackbarAlertComponent from "../components/SnackbarAlert";
import ProjectComponent from "../components/ProjectComponent"
export default {
    components:{
        ProjectComponent,
        SnackbarAlertComponent
    },
    data(){
        return {
            overlay: true,
            haveNewChat: false,
            func1: API.getProjectBasicAttribute_group,
            func2: API.postProject_group,
            userId: 0,
            errMsg: "",
            dialogErr: false,
            dialogNewGroup: false,
            dialogInvite: false,
            dialogOutGroup: false,
            dialogNewNotice: false,
            dialogUpdateNotice: false,
            drawer: true,
            groupChosenIndex: 1,//当前选中的组, 为groups列表的index。
            groupChosen: {id: -1, leaderId: 234, name: "group haha", inviteCode: 123123},
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
            updateNoticeValid: true,
            updateNoticeTitle: "",
            updateNoticeText:"",
            NoticeToBeUpdate: {},
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
                {id:1, groupId: 1, name: "推翻共产党", info: "草泥马", deadline:"2020-1-1", isFinished: 0},
                {id:2, groupId: 1, name: "暗杀习近平", info: "肛交致死", deadline:"2020-1-2", isFinished: 1},
                {id:3, groupId: 1, name: "迎娶彭丽媛", info: "按F进入", deadline:"2020-1-3", isFinished: 0}
            ],
            taskChosen: {},
            newTask: {id: 0, groupId: 0, name: "", info: "", isFinished: 0},
            taskMember: [
                {id: 1, username: "leo", level: "manager", chosen: false},
                {id: 2, username: "yzj", level: "leader", chosen: true}
            ],
            groups: [
                {id: 123, leaderId: 234, name: "group haha", inviteCode: 123123},
                {id: 234, leaderId: 333, name: "hahasdf df", inviteCode: 234234},
                {id: 3, leaderId: 333, name: "3", inviteCode: 234234},
                {id: 4, leaderId: 333, name: "4", inviteCode: 234234}


            ],
            mineTask: [],
            newGroupNameRules:[
                v => !!v || 'Name is required',
                v => (v && v.length <= 10) || 'Name must be less than 10 characters',
            ],
            newGroupName: "",
            joinGroupInviteCode: "",
            inviteLink: "",
            closeOnContentClick: false,
            isAddingTask: false,//是否正在使用添加的那一个
            menuDate: false,//date的menu是否打开
        }
    },computed: {
      screenHeight() {
        return document.documentElement.clientHeight;
      }
    },
    methods: {
        clearData(){
            this.teamMember = [];
            this.notices = [];
            this.tasks = [];
            this.taskChosen = {};
            this.newTask = {};
            this.taskMember = [];
            //this.groups = [];
        },
        Alert(msg){
            // this.errMsg = msg;
            // this.dialogErr = true;
            this.snack(msg);
        },
        toProject(){
            this.$router.push("/project");
        },
        debug(){
            console.log(this.taskMember);
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
            console.log("change");
            console.log(val);
            console.log(typeof(val));
            if(typeof(val) == "undefined"){
                //没有进行选择
                return;
            }
            this.selectGroup(this.groups[val].id);
            //console.log(this.groupChosen);
        },
        /**
         * 选择了某个小组，UI进行选择，调用后端，更新页面显示的相关信息。
         */
        selectGroup(groupId){
            this.taskChosen = {};
            this.groupChosenIndex = this.groups.findIndex(item => item.id === groupId);
            this.groupChosen = this.groups[this.groupChosenIndex];
            //this.$refs.ProjectComponentTeam.setProjects();
            this.$refs.ProjectComponentTeam.setProjects(this.groupChosen.id);

            //console.log(this.groupChosen);
            getMembers(groupId).then(res => {
                //console.log(res);
                //TODO:更新所有的小组相关信息
                this.teamMember = res.data;

                this.user = this.teamMember.find(item => {
                    return item.id == this.userId;
                });
                //获取小组公告
                this.getNotice();
                this.getTasks();
            }).catch(err => {
                console.log(err);
                this.Alert(err.response.data.errMsg);
            });
            this.getMineTask(groupId);
        },
        getMineTask(groupId){
            API.getTask(this.userId, groupId).then(res => {
                res;
                console.log(res);
                this.mineTask = res.data;

            }).catch(err => {
                if(typeof(err.response) != "undefined"){
                    this.Alert(err.response.data.errMsg);
                }else {
                    console.log(err);
                }
            })
        },
        isMineTask(task){
            //判断是否是当前用户的task
            return this.mineTask.findIndex(t => t.id == task.id) != -1;
        },
        getTasks(){
            //获取当前小组所有task
            API.getAllTask(this.groupChosen.id).then(res => {
                this.tasks = res.data;
            }).catch(err => {
                console.log(err);
                this.Alert(err.response.data.errMsg);
            })
        },getNotice(){
            API.getNotice(this.groupChosen.id).then(res => {
                this.notices = res.data;
            }).catch(err => {
                this.Alert(err.response.data.errMsg);
            })
        },
        //获取所有小组
        getGroups(){
            this.clearData();
            getAllGroup(this.userId).then(res => {
                console.log(res);
                this.groups = res.data;
                if(this.groups.length == 0){
                    return;
                }
                //this.$nextTick(() => {
                    //this.selectGroup(this.groups[this.groups.length - 1].id);//由于考虑到新的组在最后，所以获取小组后默认选择最后一个
                //})
                if(typeof(this.groupChosen.id) != "undefined"){
                    //之前选中了某组
                    if(this.groups.findIndex(item => item.id == this.groupChosen.id) != -1){
                        this.selectGroup(this.groupChosen.id);
                        return;
                    }
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
            if(typeof(from) == "undefined"){
                console.log("cnm");
                console.log(this.user);
            }
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
            this.snack("是否删除小组‘" + item.name + "’", () => {
                API.deleteGroup(item.id).then(res => {
                    console.log(res);
                    this.getGroups();
                    this.snack("删除成功");
                }).catch(err => {
                    this.Alert(err.response.data.errMsg);
                });
            });
        },
        dropGroup(group){
            this.snack("是否退出小组‘" + group.name + "’", () => {
                API.deleteMember(group.id, this.user.id).then(res => {
                    console.log(res);
                    this.getGroups();
                    this.snack("退出成功");
                }).catch(err => {
                    if(!(typeof(err.response) === "undefined")){
                        this.Alert(err.response.data.errMsg);
                    }else {
                        console.log(err);
                    }
                });
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
                this.clearNewNotice();
                this.snack("发布公告成功");
            }).catch(err => {
                this.clearNewNotice();
                this.Alert(err.response.data.errMsg);
            })
        },
        confirmUpdateNotice(){
            this.NoticeToBeUpdate.content = this.updateNoticeText;
            this.NoticeToBeUpdate.title = this.updateNoticeTitle;
            API.putNotice(this.NoticeToBeUpdate.id, this.NoticeToBeUpdate).then(res => {
                res;
            }).catch(err => {
                if(typeof(err.response) != "undefined"){
                    this.Alert(err.response.data.errMsg);
                }else {
                    console.log(err);
                }
            })
        },
        clearNewNotice(){
            this.newNoticeTitle = "";
            this.newNoticeText = "";
            this.dialogNewNotice = false;
        },
        clearUpdateNotice(){
            this.updateNoticeTitle = "";
            this.updateNoticeText = "";
            this.dialogUpdateNotice = false;
        },
        chatTo(item){
            let routeUrl = this.$router.resolve({
                path: "/chat",
                query: {newContact:item.id}
            });
            window.open(routeUrl.href, '_blank');
        },
        getColor(task){
            if(task.id == this.taskChosen.id){
                return "#EEEEEE";
            }else{
                return;
            }
        },
        updateTask(task){
            if(task.isFinished){
                task.isFinished = 1;
            }else{
                task.isFinished = 0;
            }
            API.putTask(task).then(res => {
                console.log(res);
            }).catch(err => {
                    console.log(err);
                    this.Alert(err.response.data.errMsg);

            })
            //console.log(task);
        },
        pushNewTask(){
            if(typeof(this.newTask.name) == "undefined"){
                return;
            }
            //确认给后端
            API.postTask({
                id: 0, 
                groupId: this.groupChosen.id, 
                name: this.newTask.name, 
                info: "", 
                deadline: "", 
                isFinished: 0
            }).then(res => {
                res;
                this.getTasks();
            }).catch(err => {
                this.Alert(err.response.data.errMsg);
            })
            var haha = {id: 0};
            this.newTask = haha;
        },
        updateExecutor(task){
            let ids = [];
            this.taskMember.forEach(member => {
                if(member.chosen){
                    ids.push(member.id);
                }
            })
            API.updateExecutor(this.groupChosen.id, task.id, ids).then(res => {
                res;
                this.getMineTask(this.groupChosen.id);
            }).catch(err => {
                console.log(err);
            })
        },
        selectTask(task){
            this.taskMember = [];
            this.teamMember.forEach(member => {
                let m = {
                id: member.id,
                username: member.username,
                chosen: false
                };

                this.taskMember.push(m);
            })
            this.taskChosen = task;
            API.getAllExecutor(task.id).then(res => {
                let chosenIds = res.data;
                this.taskMember.forEach(member => {
                    if(chosenIds.length == 0){
                        member.chosen = false;
                        return;
                    }
                    if(chosenIds.findIndex(id => id == member.id) != -1){
                        console.log(chosenIds.findIndex(id => id == member.id));
                        member.chosen = true;
                    }else{
                        console.log(chosenIds.findIndex(id => id == member.id));
                        member.chosen = false;
                        
                    }
                });
                console.log("taskMember");
                console.log(this.taskMember);
            }).catch(err => {
                if(typeof(err.response) != "undefined"){
                    this.Alert(err.response.data.errMsg);
                }else {
                    console.log(err);
                }
            })
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
                if(typeof(err.response) != "undefined"){
                    this.Alert(err.response.data.errMsg);
                }else {
                    console.log(err);
                }
            })
            this.getGroups();
        },onCopy(e){
            console.log(e);
            // this.snackbar = true;
            // this.snackbarText = "复制成功";
            this.snack("复制成功");
        },
        // 复制失败
        onErrorCopy(e){
            console.log(e);
            // this.snackbar = true;
            // this.snackbarText = "复制失败";
            this.snack("复制失败");
        },
        // 删除notice
        deleteNotice(notice){
            var delNot = () =>{
                API.deleteNotice(notice.id).then(res => {
                    console.log(res);
                    this.getNotice();
                }).catch(err => {
                    if(typeof(err.response) != "undefined"){
                        this.Alert(err.response.data.errMsg);
                    }else {
                        console.log(err);
                    }
                })
            };
            this.snack("是否删除此公告？", delNot);
        },
        snack(msg, btns){
            this.$refs.snackbar_alert_component.snack(msg, btns);
        },

        // isExecutor(user){
        //     if(user.id == 0){
        //         return true;
        //     }
        //     console.log(user);
        //     console.log(this.taskMember);
        //     if(typeof(this.taskMember.find(mem => mem.id == user.id).chosen) == undefined){
        //         console.log("haha");
        //         console.log(this.taskMember.find(mem => mem.id == user.id));
        //     }
        //     if(this.taskMember.find(mem => mem.id == user.id).chosen){
        //         //console.log("isExe true");
        //         return true;
        //     }else{
        //         //console.log("isExe false");

        //         return false;
        //     }
        // }
    }
    ,mounted(){
        this.userId = this.$store.getters.userId;
        if(this.userId == 0){
            this.$router.push('/login');
        }
        this.refresh();
    }
}
</script>
<style scoped>
.text-wrapper {
  white-space: pre-wrap;
}
</style>