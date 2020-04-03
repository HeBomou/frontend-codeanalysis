<template>
  <v-app id="keep">
    <v-app-bar
      app
      clipped-left
      color="amber"
    >
      <span class="title ml-3 mr-5">项目名:&nbsp;<span class="font-weight-light">{{projectName}}</span></span>

      <v-spacer />
      <v-spacer />
      <v-spacer />

      <v-btn>退出登录</v-btn>

      <v-spacer />
    </v-app-bar>
    <v-content>

    <v-container>
      <v-row>
        <v-col cols="3">
           <v-list
            dense
            class="grey lighten-4"
          >
            <v-card>
              <v-card-title>
                顶点搜索
              </v-card-title>
              <v-card-text>
                <SearchComponent 
                  @update-items="updateItems"
                  :item="searchVertex"
                  :items="vertexs"
                  @on-item-change="changeItem"
                ></SearchComponent>
              </v-card-text>
            </v-card>
            <v-card>
              <v-card-title>
                路径搜索
              </v-card-title>
              <v-card-text>
                <v-list-item-title justify="center">起点</v-list-item-title>
                <SearchComponent
                  @update-items="updateItems"
                  :item="startVertex"
                  :items="vertexs"
                ></SearchComponent>
                <v-list-item-title>终点</v-list-item-title>
                <SearchComponent
                  @update-items="updateItems"
                  :item="endVertex"
                  :items="vertexs"
                ></SearchComponent>
                <v-btn>搜索</v-btn>
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

        <v-col cols="6">
           <v-list
            dense
            class="grey lighten-4"

          >
            <v-card style="height: 500px">
              <!-- <v-list-item-title>搜索顶点</v-list-item-title>
              <SearchComponent></SearchComponent> -->
              <DepGraph
                v-bind:subgraph-id="subgraphId"
                v-bind:path-to-show="pathToShow"
                @vertexSelected="cnmdVertex"
                @edgeSelected="cnmdEdge"
                @connectiveDomainSelected="cnmdConnectiveDomain"
              ></DepGraph>
            </v-card>
            <v-card>
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

        <v-col cols="3">
           <v-list
            dense
            class="grey lighten-4"
          >
            <v-card>
              <v-card-title>
                源代码
              </v-card-title>
              <v-card-text>
                {{src}}
              </v-card-text>
            </v-card>
            <v-card>
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
                <v-btn>保存</v-btn>
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
                    <v-btn>查看所在连通域</v-btn>
                  </div>
                  <div>
                    <v-btn @click="setAsStart">设置为起点</v-btn>
                  </div>
                  <div>
                    <v-btn>设置为终点</v-btn>
                  </div>

                  <v-btn @click="debug">haha</v-btn>
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
import SearchComponent from '../components/SearchAuto'
  export default {
    props: {
      source: String,
    },components: {
      SearchComponent,
      DepGraph
    },
    data: () => ({
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
      //搜索的顶点
      searchVertex: "1",
      //起点
      startVertex: "2",
      //终点
      endVertext: "3",
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
      subgraphId: 2,
      pathToShow: [2, 3]
    }), methods: {
      updateItems (text) {
          text;
      //   yourGetItemsMethod(text).then( (response) => {
      //     this.items = response
      //   })
      },
      setAsStart(){
        console.log(this.searchVertex);
        console.log(this.startVertex);
        this.startVertex = this.searchVertex;
        
      },
      changeItem(val){
        this.searchVertex = val;
      },
      debug(){
        console.log(this.searchVertex);
        console.log(this.startVertex);
        console.log(this.endVertext);
        console.log(this.tree);
      }

  }
  }
</script>

<style>
#keep .v-navigation-drawer__border {
  display: none
}
</style>