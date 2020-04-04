<template>
  <v-app id="dependency">
    <v-app-bar
      app
      clipped-left
      color="amber"
    >
      <span class="title ml-3 mr-5">项目名:&nbsp;<span class="font-weight-light">{{projectName}}</span></span>
      

      <v-spacer />
      <v-spacer />
      <v-spacer />

      <v-btn class="mr-4">切换项目</v-btn>

      <v-btn>退出登录</v-btn>


    
    </v-app-bar>
    <v-content>

    <v-container class="mt-0">
      <v-row>
        <v-col cols="2">
           <v-list
            dense
            class="grey lighten-4"
          >
            <v-card class="mt-5">
              <v-card-title>
                顶点搜索
              </v-card-title>
              <v-card-text>
                <v-autocomplete
                  @update-items="updateItems"
                  v-model="searchVertex"
                  :items="vertexs"
                  
                ></v-autocomplete>
              </v-card-text>
            </v-card>
            <v-card class="mt-5">
              <v-card-title>
                路径搜索
              </v-card-title>
              <v-card-text>
                <v-list-item-title justify="center">起点</v-list-item-title>
                <v-autocomplete
                  @update-items="updateItems"
                  v-model="startVertex"
                  :items="vertexs"
                ></v-autocomplete>
                <v-list-item-title>终点</v-list-item-title>
                <v-autocomplete
                  @update-items="updateItems"
                  v-model="endVertex"
                  :items="vertexs"
                ></v-autocomplete>
                <v-btn @click="searchPath">搜索</v-btn>
              </v-card-text>
            </v-card>
            <v-card>
              <v-card-text>
                <v-treeview
                  v-model="tree"
                  :open="open"
                  :items="items"
                  activatable
                  item-key="name"
                  open-on-click
                  :active="active"
                  return-object
                >
                  <template v-slot:prepend="{ item, open }">
                    <v-icon v-if="!item.file">
                      {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                    </v-icon>
                    <v-icon v-else>
                      {{ files[item.file] }}
                    </v-icon>
                  </template>
                </v-treeview>
              </v-card-text>
            </v-card>
          </v-list>
        </v-col>

        <v-col cols="8">
           <v-list
            dense
            class="grey lighten-4"
          >
            <v-row>
              <v-col cols="6">
                <v-card>
                  <v-card-title>
                    基本信息
                  </v-card-title>
                  <v-card-text>
                    <v-list-item-group>
                      <v-list-item>
                        顶点数：{{vertexNum}}
                      </v-list-item>
                      <v-list-item>
                        边数：{{edgeNum}}
                      </v-list-item>
                      <v-list-item>
                        连通域数：{{domainNum}}
                      </v-list-item>
                    </v-list-item-group>
                  </v-card-text>
                </v-card>  
              </v-col>
              <v-col cols="6">
                <v-card>
                  <v-card-title>
                    紧密度域值
                  </v-card-title>
                  <v-card-text>
                    <v-list-item-group>
                      <v-list-item>
                        顶点数：{{vertexNum}}
                      </v-list-item>
                      <v-list-item>
                        边数：{{edgeNum}}
                      </v-list-item>
                      <v-list-item>
                        连通域数：{{domainNum}}
                      </v-list-item>
                    </v-list-item-group>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <v-card
            style="height: 500px"
            >
              <!-- <v-list-item-title>搜索顶点</v-list-item-title>
              <SearchComponent></SearchComponent> -->
              <v-card-title>
                dependency
              </v-card-title>
              <v-card-text style="height: 100%">
                <DepGraph
                  v-bind:subgraph-id="subgraphId"
                  v-bind:path-to-show="pathToShow"
                  @vertexSelected="cnmdVertex"
                  @edgeSelected="cnmdEdge"
                  @connectiveDomainSelected="cnmdConnectiveDomain"
                ></DepGraph>
              </v-card-text>
            </v-card>
            <v-card class="mt-5">
              <v-card-text>
                <v-list-item-group v-model="path">
                  <v-list-item
                    v-for="(path, i) in paths"
                    :key="i"
                  >
                  <v-list-item-content>
                    <v-list-item-title @click="debug">路径：{{path.name}} 长度：{{path.length}}</v-list-item-title>
                  </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-card-text>
            </v-card>
          </v-list>
        </v-col>

        <v-col cols="2">
           <v-list
            dense
            class="grey lighten-4"
          >
            <v-card class="mt-5">
              <v-card-title>
                源代码
              </v-card-title>
              <v-card-text>
                {{src}}
              </v-card-text>
            </v-card>
            <v-card class="mt-5">
              <v-card-title>
                标注
              </v-card-title>
              <v-card-text>
                <v-textarea
                  v-model="tag"
                  auto-grow
                  outlined=""
                >
                </v-textarea>
                <v-btn @click="saveTag">保存</v-btn>
              </v-card-text>
            </v-card>
            <!-- <v-row> -->
              <v-card>
                <v-card-text>
                  <v-form
                    align="center"
                    justify="center"
                  >
                  <div>
                    <v-btn class="mt-5" style="width: 100%">查看所在连通域</v-btn>
                  </div>
                  <div>
                    <v-btn class="mt-5" style="width: 100%" @click="setAsStart">设置为起点</v-btn>
                  </div>
                  <div>
                    <v-btn class="mt-5" style="width: 100%" @click="setAsEnd">设置为终点</v-btn>
                  </div>
                  <div>
                    <v-btn class="mt-5" style="width: 100%" @click="debug">haha</v-btn>
                  </div>
                  </v-form>
                </v-card-text>
              </v-card>
            <!-- </v-row> -->
            
          </v-list>
        </v-col>
      </v-row>
    </v-container>
    </v-content>

  </v-app>
</template>

<script>
import DepGraph from "@/components/DepGraph";
import {originalGraphShortestPath, getProject} from "../request/api";
//import {} from "../request/api";
//import SearchComponent from '../components/SearchAuto'
  export default {
    props: {
      source: String,
    },components: {
      
      DepGraph
    },
    data (){
      return{
        //路径
        paths: [
          {
            name: 1,
            length: 2
          },{
            name: 2,
            length: 3
          },{
            name: 3,
            length: 4
          }
        ],
        path: 0,
        //顶点
        vertexNum: 5,
        //边数
        edgeNum: 3,
        //连通域数
        domainNum: 2,
        //源代码
        src: "int s = abc;\n\treturn s;",
        //标注
        tag: "tagtagtag",
        //项目名
        projectName: "project1",
        //项目id
        projectId: 0,
        //搜索的顶点
        searchVertex: "",
        //起点
        startVertex: "",
        //终点
        endVertex: "3",
        //所有的顶点
        vertexs: [
            "haha",
            123,
            234
        ],
        open: ['static', 'public'],
        files: {
          html: 'mdi-language-html5',
          js: 'mdi-nodejs',
          json: 'mdi-json',
          md: 'mdi-markdown',
          pdf: 'mdi-file-pdf',
          png: 'mdi-file-image',
          txt: 'mdi-file-document-outline',
          xls: 'mdi-file-excel',
        },
        tree: [],
        active: [],
        items: [
          {
            name: '.git',
          },
          {
            name: 'node_modules',
          },
          {
            name: 'public',
            children: [
              {
                name: 'static',
                children: [{
                  name: 'logo.png',
                  file: 'png',
                }],
              },
              {
                name: 'favicon.ico',
                file: 'png',
              },
              {
                name: 'index.html',
                file: 'html',
              },
            ],
          },
          {
            name: '.gitignore',
            file: 'txt',
          },
          {
            name: 'babel.config.js',
            file: 'js',
          },
          {
            name: 'package.json',
            file: 'json',
          },
          {
            name: 'README.md',
            file: 'md',
          },
          {
            name: 'vue.config.js',
            file: 'js',
          },
          {
            name: 'yarn.lock',
            file: 'txt',
          },
        ],
        subgraphId: null,
        pathToShow: null
      }
      
    }, methods: {
      updateItems (text) {
          text;
      //   yourGetItemsMethod(text).then( (response) => {
      //     this.items = response
      //   })
      },
      setAsStart(){
        this.startVertex = this.searchVertex;
      },
      setAsEnd(){
        this.endVertex = this.searchVertex;
      },
      changeItem(val){
        this.searchVertex = val;
      },
      debug(){
        console.log(this.searchVertex);
        console.log(this.startVertex);
        console.log(this.endVertex);
        console.log(this.tree);
      },
      cnmdVertex(id) {
        console.log("Select on vertex", id);
        },cnmdEdge(id) {
        console.log("Select on edge", id);
      },
      cnmdConnectiveDomain(id) {
        console.log("select on connective domain", id);
      },
      saveTag(){

      },
      //搜索路径
      searchPath(){
        originalGraphShortestPath()
      },
      /**
       * 初始化项目
       */
      initProject(data){
        console.log(data);
        this.projectName = data.dynamicVo.projectName;
        this.$store.commit('initProject', data);

        //初始的子图为默认子图，域值为0
        this.$store.state.project.subgraphMap.forEach(subgraph => {
          //console.log(subgraph);
          if(subgraph.threshold == 0){
            //console.log(subgraph.id);
            this.subgraphId = subgraph.id;
            
          }
        })
        this.vertexNum = this.$store.state.project.vertexMap.size;
        this.edgeNum = this.$store.state.project.edgeMap.size;
        this.domainNum = this.$store.state.project.subgraphMap.get(this.subgraphId).connectiveDomainIds.length;
      }

    },
    mounted(){
      //初始化各个数据
      console.log("mounted");
      //TODO:debug
      this.projectId = this.$store.state.projectId
      this.projectId = 9;
      console.log("project id:" + this.projectId);
      getProject(this.projectId).then(res => {
          console.log("res.data:");
          console.log(res.data);
          this.initProject(res.data);
        }).catch(err => console.log(err));


      
    }
}
</script>

<style>
#keep .v-navigation-drawer__border {
  display: none
}

</style>