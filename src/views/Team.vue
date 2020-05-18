<template>
    <v-tabs grow="true">
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
                    <tr v-for="item in teamMember" :key="item.name">
                        <td>{{ item.name }}</td>
                        <td>{{ item.authority }}</td>
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
                                    <v-list-item>
                                        <v-list-item-content>
                                            <v-btn>
                                            移除成员
                                            </v-btn>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-list-item>
                                        <v-list-item-title><v-btn>变更权限</v-btn></v-list-item-title>
                                    </v-list-item>
                                    <v-list-item>
                                        <v-list-item-title><v-btn>私聊</v-btn></v-list-item-title>
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
                            
                            <v-icon @click="toProject(props.item.id)">mdi-plus</v-icon>
                        </template>
                        <template v-slot:item.pid="props">
                            <v-btn @click="deleteProject(props.item.id)">删除</v-btn>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
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
                                    <v-list-item>
                                        <v-list-item-content>
                                            <v-btn>
                                            指定执行者
                                            </v-btn>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-list-item>
                                        <v-list-item-title><v-btn>提交</v-btn></v-list-item-title>
                                    </v-list-item>
                                    <v-list-item>
                                        <v-list-item-title><v-btn>删除</v-btn></v-list-item-title>
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
            
            <v-list
                v-for="(notice, i) in notices"
                :key="i"
                
            >
                <v-list-item>
                    <v-card style="width:1000%" class="ml-10 mr-10">
                        <v-card-title>{{notice.title}}   <v-spacer />发布者：{{notice.person}}<v-spacer />时间:{{notice.date}} </v-card-title>
                        <v-card-text>{{notice.content}}</v-card-text>
                    </v-card>
                </v-list-item>
            </v-list>
        </v-tab-item>
    </v-tabs>
</template>
<script>
export default {
    data(){
        return {
            teamMember: [
                {name: "leo", authority: "1"},
                {name: "yzj", authority: "0"}
            ],
            notices: [
                {title: "标题1", person: "leo", date: "2020-1-1", content: "hhhhhhhhhhhhhhhhhhhhhhhhcnm"},
                {title: "标题2", person: "yzj", date: "2020-1-1", content: "cnmcnmcnmcnmcnmcnmcnm"}
            ],
            tasks: [
                {name: "foo", ddl:"2020-1-1", person:"leo"}
            ]
        }
    }
}
</script>