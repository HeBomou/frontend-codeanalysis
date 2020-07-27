<template>
  <v-app id="dependency">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet">
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate></v-progress-circular>
    </v-overlay>
    <div>
      <SnackbarAlertComponent ref="snackbar_alert_component"></SnackbarAlertComponent>
      <v-dialog v-model="SourceCodedialog" width="70%">
        <v-card>
          <v-card-title>{{this.vertexSelected == undefined ? "" : this.vertexSelected.functionName}}</v-card-title>
          <v-card-text>
            <div id="codeView" v-highlight>
              <pre><code v-html="src" style="width: 100%"></code></pre>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogDeleteSubgraph" width="500px">
        <v-card  color="#5A7797" class="white--text">
          <v-card-title >删除子图</v-card-title>
          <v-card-text class="white--text">子图被删除后无法恢复，且所有标注都会被删除！</v-card-text>
          <v-divider />
          <v-card-actions>
            <v-btn text color="error" @click="dialogDeleteSubgraph=false;">取消</v-btn>
            <v-spacer />
            <v-btn text color="success" @click="deleteSubgraphConfirmed()">确定</v-btn>

          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- <v-dialog v-model="dialogErr" width="500">
        <v-card justify="center">
          <v-card-title>{{errMsg}}</v-card-title>
          <v-card-text>
            <v-btn color="error" @click="dialogConfirm">确定</v-btn>
          </v-card-text>
        </v-card>
      </v-dialog> -->
      <v-dialog v-model="dialogThreshold" width="500">
        <v-card justify="center" color="#5A7797">
          <v-card-title class="pb-0 white--text">添加紧密度域值</v-card-title>
          <v-card-text>
            <v-form v-model="newThresholdValid">
              <v-text-field
                class="mr-5 ml-5 mt-5"
                v-model="newThreshold"
                :rules="isThreholdRules"
                label="紧密度域值"
                required
                flat
                outlined
                dark
                rounded
              ></v-text-field>
              <v-text-field
                class="mr-5 ml-5"
                v-model="newThresholdName"
                :rules="isThreholdNameRules"
                label="新子图名称"
                required
                flat
                dark
                outlined
                rounded
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-divider />
          <v-card-actions>
              <v-btn text color="error" @click="dialogThreshold=false;newThreshold = ''" >取消</v-btn>
              <v-spacer />
              <v-btn text color="success" @click="addThreshold()" :disabled="!newThresholdValid">确定</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    
    <v-app-bar app clipped-left color="#5A7797" class="white--text">
      <span class="title ml-3 mr-5">
        项目名:&nbsp;
        <span class="font-weight-light">{{projectName}}</span>
      </span>

      <v-spacer />
      <span>基本信息</span>
      <v-divider class="mr-5 ml-5" inset vertical></v-divider>
      <span>顶点数：{{vertexNum}}</span>
      <v-divider class="mr-5 ml-5" inset vertical></v-divider>
      <span>边数：{{edgeNum}}</span>
      <v-divider class="mr-5 ml-5" inset vertical></v-divider>
      <span>连通域数：{{domainNum}}</span>
      <v-spacer />
      <v-spacer />
      <v-btn @click="refresh()" class="mr-5 white--text" elevation="0" color="#5A7797" ><i class="material-icons mr-2">refresh</i>刷新</v-btn>
      <v-btn @click="toProject" class="mr-5 white--text" elevation="0" color="#5A7797" ><i class="material-icons mr-2">insights</i>我的项目</v-btn>
      <v-btn @click="$router.push('/team')" class="mr-5 white--text" elevation="0" color="#5A7797"><i class="material-icons mr-2">group</i>我的小组</v-btn>
      <v-btn v-if="haveNewChat" @click="toChat();haveNewChat = false" class="mr-5 white--text amber" elevation="0" color="#5A7797"><i class="material-icons mr-2">sms</i>
          有新消息!
      </v-btn>
      <v-btn v-else @click="toChat();haveNewChat = false" class="mr-5 white--text" elevation="0" color="#5A7797"><i class="material-icons mr-2">sms</i>
          聊天
      </v-btn>
      <v-btn @click="logout" elevation="0" color="#5A7797" class="mr-5 white--text"><i class="material-icons mr-2">login</i>退出登录</v-btn>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <v-row>
          <v-col cols="10">
            <!-- <v-list
              dense
              class="grey lighten-4"
            >-->
            <v-row>
              <!-- <v-col cols="12"> -->
              <v-col cols="6">
                <v-card height="200px">
                  <v-card-title>紧密度域值</v-card-title>
                  <v-card-text>
                    <v-autocomplete
                      @input="selectThreshold()"
                      v-model="thresholdSelected"
                      :items="thresholds"
                      append-outer-icon="mdi-plus"
                      @click:append-outer="dialogThreshold=true"
                    >
                    </v-autocomplete>
                  </v-card-text>
                  <v-card-actions>
                    <v-row justify="center">
                      <v-btn text color="#5A7797" elevation="0" @click="dialogDeleteSubgraph=true">
                        <span class="material-icons">
                          blur_off
                        </span>
                        删除子图</v-btn>
                    </v-row>
                  </v-card-actions>
                </v-card>

              </v-col>
              <v-col cols="6">
                <v-card height="200px">
                  <v-card-title>顶点搜索</v-card-title>
                  <v-card-text>
                    <v-autocomplete
                      @update-items="updateItems"
                      v-model="searchVertex"
                      :items="vertexs"
                      @change="searchVertexSelected"
                    ></v-autocomplete>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- </v-col> -->
            </v-row>

            <v-card style="height: 500px">
              <!-- <v-list-item-title>搜索顶点</v-list-item-title>
              <SearchComponent></SearchComponent>-->
              <v-card-title style="height: 20%">
                dependency
                <v-spacer />
                <v-btn text color="#5A7797" elevation="0" @click="centerTracker+=1">
                  <span class="material-icons">
                     location_searching
                  </span>
                  移动到当前选中对象</v-btn>
              </v-card-title>
              <v-card-text style="height: 80%">
                <DepGraph
                  v-bind:subgraphId="subgraphId"
                  v-bind:pathToShow="pathToShow"
                  v-bind:selectedItem="graphSelectedItem"
                  v-bind:selectedConnectiveDomainId="graphSelectedConnectiveDomainId"
                  v-bind:centerTracker="centerTracker"
                  @vertexSelected="depGraphVertex"
                  @edgeSelected="depGraphEdge"
                  @connectiveDomainSelected="depGraphConnectiveDomain"
                  @vertexMoved="depGraphVertexMoved"
                  @connectiveDomainMoved="depGraphDomainMoved"
                ></DepGraph>
              </v-card-text>
            </v-card>
            <v-scroll-y-transition>
              <v-card v-if="selectType!=3" >
                <v-card-text align="center">
                  <!-- <v-form
                        align="center"
                        justify="center"
                  >-->

                  <v-btn text color="#5A7797" elevation="0" class="mr-5" @click="checkDomain">
                    <span class="material-icons">
                      view_quilt
                    </span>
                    查看所在连通域</v-btn>
            <v-scroll-y-transition>
                  <v-btn text color="#5A7797" elevation="0" class="mr-5" v-if="selectType==1" @click="SourceCodedialog=true">
                    <span class="material-icons">
                      code
                    </span>查看源代码</v-btn>
            </v-scroll-y-transition>
            <v-scroll-y-transition>
                  <v-btn text color="#5A7797" elevation="0" class="mr-5" @click="setAsStart" v-if="selectType==1">
                    <span class="material-icons">
                      arrow_forward
                    </span>
                    设置为起点</v-btn>
            </v-scroll-y-transition>
            <v-scroll-y-transition>
                  <v-btn text color="#5A7797" elevation="0" class="mr-5" @click="setAsEnd" v-if="selectType==1">
                    <span class="material-icons">
                      arrow_back
                    </span>
                    设置为终点</v-btn>
            </v-scroll-y-transition>


                  <!-- </v-form> -->
                </v-card-text>
              </v-card>
            </v-scroll-y-transition>
            <v-card>
              <v-card-text>
                <v-treeview
                  dense
                  v-model="tree"
                  :open.sync="open"
                  :items="items"
                  activatable
                  item-key="key"
                  item-text="str"
                  open-on-click
                  @update:active="treeActive"
                  :active="active"
                  return-object
                >
                  <template v-slot:prepend="{ item, open }">
                    <v-icon v-if="!item.file">{{ open ? 'mdi-folder-open' : 'mdi-folder' }}</v-icon>

                    <v-icon v-else>{{ files[item.file] }}</v-icon>
                  </template>
                </v-treeview>
              </v-card-text>
            </v-card>
            <!-- </v-list> -->
          </v-col>

          <v-col cols="2">
            <v-scroll-y-transition>
            <v-card class="mt-5" v-if="selectType==2">
              <v-card-title>紧密度</v-card-title>
              <v-card-text>{{edgeSelected.closeness}}</v-card-text>
            </v-card>
            </v-scroll-y-transition>
            <v-card class="mt-5">
              <v-card-title>标注</v-card-title>
              <v-card-text>
                <v-textarea v-model="tag" auto-grow outlined></v-textarea>
              </v-card-text>
              <v-divider />
              <v-card-actions>
                <v-spacer />
                <v-btn text color="#5A7797" elevation="0" @click="saveTag">
                  <span class="material-icons">
                  save
                  </span>
                  保存</v-btn>
                <v-spacer />
              </v-card-actions>
            </v-card>
            <v-card class="mt-5">
              <v-card-title>路径搜索</v-card-title>
              <v-card-text>
                <v-list-item-title justify="center">起点</v-list-item-title>
                <v-autocomplete @update-items="updateItems" v-model="startVertex" :items="vertexs"></v-autocomplete>
                <v-list-item-title>终点</v-list-item-title>
                <v-autocomplete @update-items="updateItems" v-model="endVertex" :items="vertexs"></v-autocomplete>
              </v-card-text>
              <v-divider />
              <v-card-actions>
                <v-spacer />
                <v-btn text color="#5A7797" elevation="0" @click="searchPath">
                  <span class="material-icons">
                    timeline
                  </span>
                  查找路径</v-btn>
                <v-spacer />
              </v-card-actions>
            </v-card>

            <!-- <v-row> -->
            <v-card class="mt-5">
              <v-card-text>
                <v-card-title>路径总数：{{pathNum}}</v-card-title>
                <v-list-item-group v-model="path">
                  <v-list-item v-for="(path, i) in paths" :key="i">
                    <v-list-item-content>
                      <v-list-item-title @click="selectPath(path)">路径：{{i + 1}} 长度：{{path.length}}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import DepGraph from "@/components/DepGraph";
import SnackbarAlertComponent from "../components/SnackbarAlert";
import {
  getProject,
  putVertex,
  putEdge,
  getOriginalGraphPath,
  addSubgraph,
  putConnectiveDomain,
  delSubgraph,
  API
} from "../request/api";
//import {} from "../request/api";
//import SearchComponent from '../components/SearchAuto'
export default {
  props: {
    source: String
  },
  components: {
    DepGraph,
    SnackbarAlertComponent
  },
  data() {
    return {
      //路径
      paths: [],
      errMsg: "",
      dialogErr: false,
      dialogDeleteSubgraph: false,
      SourceCodedialog: false,
      overlay: true,
      haveNewChat: false,
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
      src: "",
      //标注
      tag: "",
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
      //所有的顶点的名字，这里注意要在子图切换的时候进行更改。
      vertexs: ["haha", 123, 234],
      open: [{ key: "/src" }],
      files: {
        html: "mdi-language-html5",
        js: "mdi-language-java",
        json: "mdi-json",
        md: "mdi-markdown",
        pdf: "mdi-file-pdf",
        png: "mdi-file-image",
        txt: "mdi-file-document-outline",
        xls: "mdi-file-excel",
        javaFunc: "mdi-alpha-f-box",
        javaClass: "mdi-alpha-c-box"
      },
      tree: [],
      active: [],
      items: [
        {
          str: ".git"
        },
        {
          str: "node_modules"
        },
        {
          str: "public",
          children: [
            {
              str: "static",
              children: [
                {
                  str: "logo.png",
                  file: "png"
                }
              ]
            },
            {
              str: "favicon.ico",
              file: "png"
            },
            {
              str: "index.html",
              file: "html"
            }
          ]
        },
        {
          str: ".gitignore",
          file: "txt"
        },
        {
          str: "babel.config.js",
          file: "js"
        },
        {
          str: "package.json",
          file: "json"
        },
        {
          str: "README.md",
          file: "md"
        },
        {
          str: "vue.config.js",
          file: "js"
        },
        {
          str: "yarn.lock",
          file: "txt"
        }
      ],
      //DepGraph的props
      //当前子图id
      subgraphId: null,
      //当前路径
      pathToShow: null,
      //图中选中的点边
      graphSelectedItem: null,
      //图中选中的连通域
      graphSelectedConnectiveDomainId: null,
      centerTracker: 0,
      //当前选择节点是否时从包结构组件发出的。
      isTreeSelectVertex: false,

      //当前选中的是顶点,1:顶点，2：边，3：连通域
      selectType: 0,
      //所有的threshold
      thresholds: [0, 1],
      thresholdSelected: 0,
      //是否弹出新的紧密度的dialog
      dialogThreshold: false,
      //
      isThreholdRules: [
        v => !!v || "请输入紧密度域值",
        v => !isNaN(v) || "紧密度域值应为数值",
        v => (v <= 1 && v >= 0) || "紧密度域值应为大于0小于1的数值",
        v =>
          this.thresholds.indexOf(parseFloat(v)) == -1 ||
          "该紧密度域值已经设置过，不可重复添加"
      ],
      newThresholdValid: false,
      newThresholdName: "new Subgraph",
      newThreshold: 0,
      isThreholdNameRules: [v => !!v || "请输入名称"],
      isSaveTag: false //由于调用http请求的都是update，无法区分保存标注和移动顶点
    };
  },
  methods: {
    toChat(){
      let routeUrl = this.$router.resolve({
          path: "/chat",
      });
      window.open(routeUrl.href, '_blank');
    },
    updateItems(text) {
      text;
      //   yourGetItemsMethod(text).then( (response) => {
      //     this.items = response
      //   })
    },
    setAsStart() {
      this.startVertex = this.searchVertex;
    },
    setAsEnd() {
      this.endVertex = this.searchVertex;
    },
    changeItem(val) {
      this.searchVertex = val;
    },
    debug() {
      // console.log(this.searchVertex);
      // console.log(this.startVertex);
      // console.log(this.endVertex);
      // console.log(this.tree);
      //console.log(this.thresholdSelected);
      //console.log("active");
      //console.log(this.active);
    },
    //DevGraph的回调
    depGraphVertex(res) {
      //console.log("Select on vertex", res);
      this.selectVertex(res);
    },
    depGraphEdge(id) {
      //console.log("Select on edge", id);
      this.selectEdge(id);
    },
    depGraphConnectiveDomain(id) {
      //console.log("select on connective domain", id);
      this.selectDomain(id);
    },
    depGraphVertexMoved(vertex) {
      //console.log("vertex Moved, id:", vertex);
      this.vertexMoved(vertex);
    },
    depGraphDomainMoved(domain) {
      //console.log("domain moved");
      API.putConnectiveDomainPosition(
        this.projectId,
        this.subgraphId,
        domain.id,
        domain.dx,
        domain.dy
      )
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          this.Alert(err.response.data.errMsg);
        });
    },
    saveTag() {
      this.isSaveTag = true;
      if (this.selectType == 1) {
        this.vertexSelected.anotation = this.tag;
        this.updateVertex(this.vertexSelected);
      } else if (this.selectType == 2) {
        this.edgeSelected.anotation = this.tag;
        this.updateEdge(this.edgeSelected);
      } else if (this.selectType == 3) {
        this.domainSelected.anotation = this.tag;
        this.updateDomain(this.domainSelected);
      }
    },
    //更新边，对store和后端进行更新
    updateEdge(edge) {
      //console.log(edge);
      this.$store.commit("updateEdge", edge);
      //console.log("updateEdge");
      putEdge(this.projectId, edge.id, {
        id: edge.id,
        anotation: edge.anotation
      })
        .then(res => {
          console.log(res);
          if (this.isSaveTag) {
            this.Alert("保存成功");
            this.isSaveTag = false;
          }
        })
        .catch(err => {
          this.Alert(err.response.data.errMsg);
        });
    },updateVertexPos(vertex){
      this.$store.commit("updateVertexPos", {vertex: vertex, subgraphId:this.subgraphId});
      API.putVertexPosition(this.projectId, {
        id: vertex.id,
        subgraphId: this.subgraphId,
        x: vertex.x,
        y: vertex.y
      }).then(res => {
        console.log(res);
      }).catch(err => {
        this.Alert(err.response.data.errMsg);
      })
    },
    //更新顶点(非位置信息)，对store和后端进行更新
    updateVertex(vertex) {
      this.$store.commit("updateVertex", vertex);
      //console.log("update vertex");
      // console.log({
      //   id: vertex.id,
      //   anotation: vertex.anotation,
      //   x: vertex.x,
      //   y: vertex.y
      // });
      putVertex(this.projectId, vertex.id, {
        id: vertex.id,
        anotation: vertex.anotation,
      })
        .then(res => {
          console.log(res);
          if (this.isSaveTag) {
            this.Alert("保存成功");
            this.isSaveTag = false;
          }
        })
        .catch(err => {
          this.Alert(err.response.data.errMsg);
        });
    },
    updateDomain(domain) {
      this.$store.commit("updateDomain", domain);
      //console.log("update domain");
      putConnectiveDomain(this.projectId, this.subgraphId, domain.id, {
        id: domain.id,
        anotation: domain.anotation,
        color: domain.color
      })
        .then(res => {
          console.log("update Domain success ", res);
          if (this.isSaveTag) {
            this.Alert("保存成功");
            this.isSaveTag = false;
          }
        })
        .catch(err => {
          this.Alert(err.response.data.errMsg);
        });
    },
    //搜索路径
    searchPath() {
      //console.log("searchPath");
      getOriginalGraphPath(
        this.projectId,
        this.getVertexIdByName(this.startVertex),
        this.getVertexIdByName(this.endVertex)
      )
        .then(res => {
          //console.log("search Path success, res:");
          //console.log(res.data);
          this.pathNum = res.data.num;
          this.paths = res.data.paths;
        })
        .catch(err => {
          this.Alert(err.response.data.errMsg);
        });
    },
    setVertexs() {
      let Vs = this.$store.state.project.vertexMap;
      this.vertexs = [];
      Vs.forEach(v => {
        this.vertexs.push(v.functionName);
      });
      // console.log("vertexs:");
      // console.log(this.vertexs);
      // console.log(this.vertexs[0][1]);
      // console.log((this.vertexs[0][1]).functionName);
    },
    Alert(msg) {
      // this.errMsg = msg;
      // this.dialogErr = true;
      this.$refs.snackbar_alert_component.snack(msg);

    },
    /**
     * 初始化项目
     */
    initProject(data) {
      //console.log("initProject, data:");
      //console.log(data);
      this.projectName = data.dynamicVo.projectName;
      this.$store.commit("initProject", data);

      //初始的子图为默认子图，域值为0
      this.$store.state.project.subgraphMap.forEach(subgraph => {
        //console.log(subgraph);
        if (subgraph.threshold == 0) {
          //console.log(subgraph.id);
          this.subgraphId = subgraph.id;
          this.$store.commit("selectSubgraph", this.subgraphId);
        }
      });
      //设置基本信息
      this.vertexNum = this.$store.state.project.vertexMap.size;
      this.edgeNum = this.$store.state.project.edgeMap.size;
      this.domainNum = this.$store.state.project.subgraphMap.get(
        this.subgraphId
      ).connectiveDomainIds.length;

      //设置点集合
      this.setVertexs();

      //设置包结构
      //console.log("exp");
      //console.log(this.items);
      //TODO:debug
      this.preproPackage([data.packageRoot], "");
      this.items = [data.packageRoot];
      this.changeFileType(this.items[0]);
      //console.log("get");
      //console.log(this.items);

      //设置子图
      this.reloadThresholds();

      //停止转菊花
      this.overlay = false;
    },
    //根据children 的情况判断是文件夹/文件/类/文件
    changeFileType(root) {
      if (root.children[0].children.length == 0) {
        root.file = "javaClass";
        return;
      } else {
        root.children.forEach(children => {
          this.changeFileType(children);
        });
        return;
      }
    },
    //对包结构进行预处理工作，设置文件类型（文件夹/类/方法），根据函数节点id获得函数名，放入children中
    //fatherKey是父亲的key，加上自己的str为自己的key
    preproPackage(root, fatherKey) {
      root.forEach(node => {
        node.key = fatherKey + "/" + node.str;
        if (node.children.length == 0 && node.functions == 0) {
          return;
        }
        if (node.functions.length == 0) {
          //文件夹，对所有子节点进行递归
          // console.log("folder");
          node.children = this.preproPackage(node.children, node.key);
        } else {
          //func
          // console.log("not folder");
          node.functions.forEach(func => {
            // console.log(func);
            // console.log("childer");
            // console.log(node.children);
            let vertex = this.getVertexById(func);
            node.children.push({
              str: this.getShortFuncName(vertex.functionName),
              file: "javaFunc",
              key: vertex.functionName,
              functionId: func,
              children: []
            });
          }, node.children);
          // console.log(node.children);
        }
      });
      // console.log("res")
      // console.log(root);
      return root;
    },
    //对active事件的回调函数
    //val:所有的active节点的数组
    treeActive(val) {
      //console.log(val);
      this.selectVertex(val[0].functionId);
      this.active = val;

      //this.centerTracker += 1;
    },
    // //将一个
    // childrenToArray(children){
    //   children.forEach(child)
    // }
    // ,//搜索这个顶点
    searchVertexSelected() {
      //console.log(this.searchVertex);
      let v = this.getVertexByName(this.searchVertex);
      //console.log("searchVertex");
      //console.log(v);
      this.selectVertex(v.id);

      //定位到这个点
      //this.centerTracker += 1;
    },
    //为了方便显示，把函数名全名中的包名类名去除
    getShortFuncName(str) {
      let arr = str.split(":");
      return arr[1];
    },
    getVertexIdByName(name) {
      let vMap = this.$store.state.project.vertexMap;
      let result = null;
      vMap.forEach(v => {
        if (v.functionName == name) {
          result = v.id;
        }
      });
      return result;
    },
    getVertexByName(name) {
      let vMap = this.$store.state.project.vertexMap;
      let result = null;
      vMap.forEach(v => {
        if (v.functionName == name) {
          result = v;
        }
      });
      return result;
    },
    getVertexById(id) {
      let vMap = this.$store.state.project.vertexMap;
      return vMap.get(id);
    }, //选中某个顶点
    selectVertex(id) {
      this.selectType = 1;
      this.vertexSelected = this.getVertexById(id);
      this.src = this.vertexSelected.sourceCode;
      this.tag = this.vertexSelected.anotation;
      this.pathToShow = null;
      this.graphSelectedConnectiveDomainId = null;

      this.searchVertex = this.vertexSelected.functionName;
      this.graphSelectedItem = { type: "n", id: this.vertexSelected.id };
      //console.log(this.graphSelectedItem);

      //处理包结构:active函数，打开父节点
      let funcKey = this.vertexSelected.functionName;
      this.active = [{ key: funcKey }];
      let openName = this.getFathersKeyByFuncKey(funcKey);
      let newOpen = [];
      openName.forEach(name => {
        // if(this.open.indexOf({key: name}) == -1){
        newOpen.push({ key: name });
        // }
      });
      this.open = newOpen;

      //console.log("active");
      //console.log(this.active);

      //console.log("this.graphSelectedItem");
      //console.log(this.graphSelectedItem);
    },
    getFathersKeyByFuncKey(funcKey) {
      //根据函数名得到所有父节点的key的数组
      let result = [];
      let fathers = funcKey.split(":")[0].split(".");

      let nowUrl = "/src";
      result.push(nowUrl);
      fathers.forEach(name => {
        nowUrl += "/" + name;
        result.push(nowUrl);
      });
      //console.log("resultF");
      //console.log(result);

      return result;
    },
    //node是当前节点，fatherkeys是他所有父亲的key的数组，funckey是目标, 如果没有则返回空
    //TODO:不知道为什么，这样搜索的结果是所有文件夹打开，怀疑跟js的作用域特性有关
    // searchFatherKeysByFuncKey(fatherKeys, node, funcKey){
    //   console.log("node");
    //   console.log(node);
    //   console.log("fatherKeys");
    //   console.log(fatherKeys);
    //   if(node.children.length == 0){
    //     //叶节点
    //     if(node.key != funcKey){
    //       console.log("lmiss");
    //       return null;
    //     }else{
    //       console.log("lhit");
    //       return fatherKeys;
    //     }
    //   }else{
    //     //非叶节点
    //     let result = null;
    //     let newKeys = fatherKeys;
    //     newKeys.push({key: node.key});

    //     node.children.forEach(child => {
    //       let res = this.searchFatherKeysByFuncKey(newKeys, child, funcKey);
    //       if(res != null){
    //         result = res;
    //       }
    //     })
    //     return result;
    //   }

    // },
    selectDomain(id) {
      //选中某个连通域
      //console.log("selectDomain");
      //console.log(id);
      //haha
      this.selectType = 3;
      this.graphSelectedItem = null;
      this.pathToShow = null;
      this.graphSelectedConnectiveDomainId = id;
      let domain = this.$store.state.project.connectiveDomainMap.get(id);
      this.domainSelected = domain;
      //console.log(domain);
      this.tag = domain.anotation;
    },
    selectEdge(id) {
      //console.log("selectEdge id:");
      //console.log(id);
      this.selectType = 2;
      this.edgeSelected = this.$store.state.project.edgeMap.get(id);
      this.tag = this.edgeSelected.anotation;
      this.pathToShow = null;
      this.graphSelectedConnectiveDomainId = null;
      this.graphSelectedItem = { type: "e", id: this.edgeSelected.id };
      //console.log(this.edgeSelected);

      //把当前选中的顶点设置为这个边的一个顶点，方便选中所在连通域
      this.vertexSelected = this.$store.state.project.vertexMap.get(
        this.edgeSelected.fromId
      );
    },
    //图中的点被移动
    vertexMoved(vertex) {
      //console.log("vertex moved");
      this.updateVertexPos(this.$store.state.project.vertexMap.get(vertex.id));
    },
    selectPath(path) {
      //console.log(path);
      this.graphSelectedItem = null;
      this.graphSelectedConnectiveDomainId = null;

      this.pathToShow = path;
    },
    //添加一个紧密度域值
    addThreshold() {
      //console.log("addThreshold");
      this.dialogThreshold = false;
      this.overlay = true;
      addSubgraph(this.projectId, this.newThreshold, this.newThresholdName)
        .then(res => {
          //console.log("addThreshold success");
          //console.log(res);
          this.overlay = false;
          this.Alert("添加成功");
          this.$store.commit("addSubGraph", res.data);
          //this.reloadThresholds();
          this.thresholds.push(this.newThreshold);
          this.thresholdSelected = this.newThreshold;
          this.newThreshold = 0;
          this.selectThreshold();
        })
        .catch(err => {
          this.overlay = false;
          // this.dialogThreshold = false;
          this.Alert(err.response.data.errMsg);
        });
    },
    //选择一个已有的紧密度域值（选中的域值是this.thresholdSelected）
    selectThreshold() {
      //console.log("selectThreshold", this.thresholdSelected);
      let sg = null;
      //找到对应子图
      this.$store.state.project.subgraphMap.forEach(subgraph => {
        if (subgraph.threshold == this.thresholdSelected) {
          sg = subgraph;
        }
      });
      this.subgraphId = sg.id;

      this.$store.commit("selectSubgraph", this.subgraphId);

      //重置搜索顶点的所有名称
      this.vertexs = [];

      //重置基本信息
      this.vertexNum = 0;
      this.edgeNum = 0;
      this.domainNum = sg.connectiveDomainIds.length;
      sg.connectiveDomainIds.forEach(did => {
        let domain = this.$store.state.project.connectiveDomainMap.get(did);
        this.vertexNum += domain.vertexIds.length;
        this.edgeNum += domain.edgeIds.length;
        domain.vertexIds.forEach(vid => {
          this.vertexs.push(this.$store.state.project.vertexMap.get(vid).functionName);
          //console.log((this.$store.state.project.vertexMap.get(eid)).functionName);
          //console.log((this.$store.state.project.vertexMap.get(vid).functionName));
          
        })
      });

    },
    //获取Thresholds
    reloadThresholds() {
      let sMap = this.$store.state.project.subgraphMap;
      this.thresholds = [];
      sMap.forEach(subgraph => {
        this.thresholds.push(subgraph.threshold);
      });
    },
    toProject() {
      this.$router.push("/project");
    },
    logout() {
      this.$store.commit("setUserId", 0);
      this.$router.push("/login");
    },
    deleteSubgraphConfirmed() {
      if (this.thresholdSelected == 0) {
        this.dialogDeleteSubgraph = false;
        this.Alert("不能删除紧密度域值为0的子图");
        return;
      }
      delSubgraph(this.projectId, this.subgraphId)
        .then(res => {
          this.thresholds.splice(
            this.thresholds.indexOf(this.thresholdSelected),
            1
          );
          this.thresholdSelected = 0;
          this.selectThreshold();
          this.dialogDeleteSubgraph = false;
          console.log(res);
        })
        .catch(err => {
          this.dialogDeleteSubgraph = false;
          this.Alert(err.response.data.errMsg);
        });
    },
    checkDomain() {
      this.selectDomain(this.getDomainIdByVertexId(this.vertexSelected.id));
      this.centerTracker += 1;
    },
    //根据点的id找到所在连通域的id
    getDomainIdByVertexId(vid) {
      let subgraph = this.$store.state.project.subgraphMap.get(this.subgraphId);
      let result = 0;
      subgraph.connectiveDomainIds.forEach(did => {
        let domain = this.$store.state.project.connectiveDomainMap.get(did);
        if (domain.vertexIds.indexOf(vid) != -1) {
          result = domain.id;
        }
      });
      return result;
    },
    // dialogConfirm(){
    //   this.dialogErr = false;
    //   if(this.errMsg == "项目正在解析"){
        
    //     this.errMsg = "";
    //   }
    // },
    refresh(){
      this.overlay = true;
      API.getContactNew(this.$store.getters.userId).then(res => {
          //console.log(res.data);
          this.haveNewChat = res.data;
      }).catch(err => {
          if(typeof(err.response) != "undefined"){
              this.Alert(err.response.data.errMsg);
          }else {
              console.log(err);
          }
      })
      getProject(this.projectId)
      .then(res => {
        //console.log("res.data:");
        //console.log(res.data);
        this.initProject(res.data);
      })
      .catch(err => {
        this.overlay = false;
        console.log(err);
        if(err.response.data.errMsg == "项目正在解析"){
          setTimeout(() => {this.$router.push("/project");}, 1000);
          this.$refs.snackbar_alert_component.snack("项目正在解析或解析失败", [{text: "确定", func: () => {
            this.$router.push("/project");
          }}]);
        }else {
          this.Alert(err.response.data.errMsg);
        }
        
      });
    }
  },
  mounted() {
    let userId = this.$store.getters.userId;
    //console.log("********************");
    //console.log(userId);
    if (userId == 0) {
      //代表没有登录
      this.$router.push("/login");
    }
    //初始化各个数据
    //console.log("mounted");
    //TODO:debug
    this.projectId = this.$store.getters.projectId;
    //this.projectId = 1;
    //console.log("project id:" + this.projectId);
    this.refresh();
  }
};
</script>

<style>
#keep .v-navigation-drawer__border {
  display: none;
}
</style>