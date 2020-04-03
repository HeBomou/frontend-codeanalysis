<template>
    <v-app id="admin">
       <v-app-bar
            app
            clipped-left
            color="amber"
        > 
            <span class="title ml-3 mr-5">管理员:&nbsp;<span class="font-weight-light">{{username}}</span></span>

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
                        v-for="(basicInfo, i) in basicInfos"
                        :key="i"
                    >
                        <v-list-item-content>
                            <v-list-item-title>
                                {{basicInfo.name}}:{{basicInfo.value}}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-card-text>
            </v-card>
            <v-card>
                <v-card-title>用户列表</v-card-title>
                <v-card-text>
                    <v-list-item
                        v-for="(basicInfo, i) in basicInfos"
                        :key="i"
                    >
                        <v-list-item-content>
                            <v-list-item-title>
                                {{basicInfo.name}}:{{basicInfo.value}}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-card-text>
            </v-card>
        </v-content>
    </v-app>

</template>
<script>
export default {
    data: ()=> ({
        username: "leo",
        basicInfos:[
            {name:"用户总数", value:1000},
            {name:"项目总数", value:3000}
        ],
        users: [
            {}
        ],
        projects:[
            
        ]
    })
}
</script>