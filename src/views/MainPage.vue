<template>
  <v-app id="dependency">
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
                  @change="searchVertexSelected"
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
                dense
                  v-model="tree"
                  :open="open"
                  :items="items"
                  activatable
                  item-key="str"
                  item-text="str"
                  open-on-click
                  :active="active"
                  return-object
                >
                  <template v-slot:prepend="{ item, open }">
                    <!-- 如果是文件夹，则根据打开状况显示图标 -->
                    <v-icon v-if="!item.file">
                      {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                    </v-icon>
                    <!-- 否则根据文件类型显示图标 -->
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
                  v-bind:subgraphId="subgraphId"
                  v-bind:pathToShow="pathToShow"
                  v-bind:selectedItem="graphSelectedItem"
                  v-bind:selectedConnectiveDomainId="graphSelectedConnectiveDomainId"
                  @vertexSelected="cnmdVertex"
                  @edgeSelected="cnmdEdge"
                  @connectiveDomainSelected="cnmdConnectiveDomain"
                ></DepGraph>
              </v-card-text>
            </v-card>
            <v-card class="mt-5">
              <v-card-text>
                <v-card-title>
                  路径总数：{{pathNum}}
                </v-card-title>
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
            <v-card class="mt-5" v-if="selectType==1">
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
                    <v-btn class="mt-5" style="width: 100%" @click="setAsStart" v-if="selectType==1">设置为起点</v-btn>
                  </div>
                  <div>
                    <v-btn class="mt-5" style="width: 100%" @click="setAsEnd" v-if="selectType==1">设置为终点</v-btn>
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
import {getProject, putVertex, putEdge, getOriginalGraphPath} from "../request/api";
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
        errMsg: "",
        dialogErr: false,
        path: 0,
        //顶点
        vertexNum: 5,
        //边数
        edgeNum: 3,
        //连通域数
        domainNum: 2,
        //搜索的路径总数
        pathNum: 0,
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
        //当前选中的顶点/边/连通域
        vertexSelected: null,
        edgeSelected: null,
        domainSelected: null,
        //所有的顶点
        vertexs: [
            "haha",
            123,
            234
        ],
        open: ['static', 'public'],
        files: {
          html: 'mdi-language-html5',
          js: 'mdi-language-java',
          json: 'mdi-json',
          md: 'mdi-markdown',
          pdf: 'mdi-file-pdf',
          png: 'mdi-file-image',
          txt: 'mdi-file-document-outline',
          xls: 'mdi-file-excel',
          javaFunc: 'mdi-language-java'
        },
        tree: [],
        active: [],
        items: [
          {
            name: '.git',
          },
          {
            str: 'node_modules',
          },
          {
            str: 'public',
            children: [
              {
                str: 'static',
                children: [{
                  str: 'logo.png',
                  file: 'png',
                }],
              },
              {
                str: 'favicon.ico',
                file: 'png',
              },
              {
                str: 'index.html',
                file: 'html',
              },
            ],
          },
          {
            str: '.gitignore',
            file: 'txt',
          },
          {
            str: 'babel.config.js',
            file: 'js',
          },
          {
            str: 'package.json',
            file: 'json',
          },
          {
            str: 'README.md',
            file: 'md',
          },
          {
            str: 'vue.config.js',
            file: 'js',
          },
          {
            str: 'yarn.lock',
            file: 'txt',
          },
        ],
        //当前子图id
        subgraphId: null,
        //当前路径
        pathToShow: null,    
        //图中选中的点边
        graphSelectedItem: 1,
        //图中选中的连通域
        graphSelectedConnectiveDomainId: 1,
        //当前选中的是顶点,1:顶点，2：边，3：连通域
        selectType: 1,
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
        // console.log(this.searchVertex);
        // console.log(this.startVertex);
        // console.log(this.endVertex);
        // console.log(this.tree);
        console.log(this.selectType);
      },
      //DevGraph的回调
      cnmdVertex(id) {
        console.log("Select on vertex", id);
        this.selectVertex(id);
      },cnmdEdge(id) {
        console.log("Select on edge", id);
        this.selectEdge(id)
      },
      cnmdConnectiveDomain(id) {
        console.log("select on connective domain", id);
        this.selectDomain(id);
      },
      saveTag(){
        if(this.selectType == 1){
          this.vertexSelected.anotation = this.tag;
          this.updateVertex(this.vertexSelected);
        }else if(this.selectType == 2){
          this.edgeSelected.anotation = this.tag;
          this.updateEdge(this.edgeSelected);
        }
        
      },
      //更新边，对store和后端进行更新
      updateEdge(edge){
        console.log(edge);
        this.$store.commit("updateEdge", edge);
        console.log("updateEdge");
        putEdge(this.projectId, edge.id, {
          id: edge.id,
          anotation: edge.anotation
        }).then(res => {
          console.log(res);
        }).catch(err  => {
          this.Alert(err.response.data.errMsg);
        });
      },
      //更新顶点，对store和后端进行更新
      updateVertex(vertex){
        this.$store.commit("updateVertex", vertex);
        console.log("update vertex");
        console.log({
          id: vertex.id,
          anotation: vertex.anotation,
          x: vertex.x,
          y: vertex.y
        });
        putVertex(this.projectId, vertex.id, {
          id: vertex.id,
          anotation: vertex.anotation,
          x: vertex.x,
          y: vertex.y
        }).then(res => {
          console.log(res);
        }).catch(err => {
          this.Alert(err.response.data.errMsg);
        });
      },
      //搜索路径
      searchPath(){
        console.log("searchPath");
        getOriginalGraphPath(this.projectId, this.getVertexIdByName(this.startVertex), this.getVertexIdByName(this.endVertex))
          .then(res => {
            console.log("search Path success, res:");
            console.log(res.data);
            this.pathNum = res.data.num;
          }).catch(err => {
            this.Alert(err.response.data.errMsg);
          });
      },
      setVertexs(){
        let Vs = this.$store.state.project.vertexMap;
        this.vertexs = [];
        Vs.forEach(v => {
          this.vertexs.push(v.functionName);
        })
        // console.log("vertexs:");
        // console.log(this.vertexs);
        // console.log(this.vertexs[0][1]);
        // console.log((this.vertexs[0][1]).functionName);
      },Alert(msg){
        this.errMsg = msg;
        this.dialogErr = true;
      },
      /**
       * 初始化项目
       */
      initProject(data){
        console.log("initProject, data:");
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
        //设置基本信息
        this.vertexNum = this.$store.state.project.vertexMap.size;
        this.edgeNum = this.$store.state.project.edgeMap.size;
        this.domainNum = this.$store.state.project.subgraphMap.get(this.subgraphId).connectiveDomainIds.length;

        //设置点集合
        this.setVertexs();

        //设置包结构
        console.log("exp");
        console.log(this.items);

        //TODO:debug
        this.preproPackage([data.packageRoot]);
        this.items = [data.packageRoot];
        console.log("get");
        console.log(this.items);

      },
      //对包结构进行预处理工作，设置文件类型（文件夹/类/方法），根据函数节点id获得函数名，放入children中
      preproPackage(root){
        root.forEach(node => {
          if(node.children.length == 0 && node.functions == 0){
            return;
          }
          if(node.functions.length == 0){
            //文件夹，对所有子节点进行递归
            // console.log("folder");
            node.children = this.preproPackage(node.children);
          }else{
            //类
            // console.log("not folder");
            node.functions.forEach(func => {
              // console.log(func);
              // console.log("childer");
              // console.log(node.children);
              let vertex = this.getVertexById(func);
              node.children.push({
                str: this.getShortFuncName(vertex.functionName),
                file: "javaFunc"
              });

            }, node.children);
              // console.log(node.children);

          }
        });
        // console.log("res")
        // console.log(root);
        return root;
      },
      // //将一个
      // childrenToArray(children){
      //   children.forEach(child)
      // }
      // ,//搜索这个顶点
      searchVertexSelected(){
        console.log(this.searchVertex);
        let v = this.getVertexByName(this.searchVertex);
        console.log("searchVertex");
        console.log(v);
        this.selectVertex(v.id);

      },
      //为了方便显示，把函数名全名中的包名类名去除
      getShortFuncName(str){
        let arr = str.split(":");
        return arr[1];
      },
      getVertexIdByName(name){
        let vMap = this.$store.state.project.vertexMap;
        let result = null;
        vMap.forEach(v => {
          if(v.functionName == name){
            result = v.id;
          }
        })
        return result;
      },
      getVertexByName(name){
        let vMap = this.$store.state.project.vertexMap;
        let result = null;
        vMap.forEach(v => {
          if(v.functionName == name){
            result = v;
          }
        })
        return result;

      },getVertexById(id){
        let vMap = this.$store.state.project.vertexMap;
        return vMap.get(id);
      }, //选中某个顶点
      selectVertex(id){
        this.selectType = 1;
        this.vertexSelected = this.getVertexById(id);
        this.src = this.vertexSelected.sourceCode;
        this.tag = this.vertexSelected.anotation;
        this.searchVertex = this.vertexSelected.functionName;
        this.graphSelectedItem = {type: "n", id: this.vertexSelected.id};
        console.log("this.graphSelectedItem");
        console.log(this.graphSelectedItem);
      },
      selectDomain(id){
        console.log("selectDomain");
        console.log(id);
        //this.selectType = 3;
      },
      selectEdge(id){
        console.log("selectEdge id:");
        console.log(id);
        this.selectType = 2;
        this.edgeSelected = this.$store.state.project.edgeMap.get(id);
        this.tag = this.edgeSelected.anotation;
        this.graphSelectedItem = {type: "e", id: this.edgeSelected.id};
        console.log(this.edgeSelected);
        
      }

    },
    mounted(){
      //初始化各个数据
      console.log("mounted");
      //TODO:debug
      this.projectId = this.$store.state.projectId
      this.projectId = 1;
      //console.log("project id:" + this.projectId);
      getProject(this.projectId).then(res => {
          console.log("res.data:");
          console.log(res.data);
          this.initProject(res.data);
        }).catch(err => this.Alert(err.response.data.errMsg));


      
    }
}
</script>

<style>
#keep .v-navigation-drawer__border {
  display: none
}

</style>