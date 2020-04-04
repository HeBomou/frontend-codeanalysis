import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    project: { // TODO: 测试数据
      id: 1,
      projectName: "projectName 1",
      vertexMap: new Map([
        [1, { id: 1, functionName: "cnmd1", sourceCode: "nmbd yuanma 1", anotation: "anotation", x: 100, y: 100 }],
        [2, { id: 2, functionName: "cnmd2", sourceCode: "nmbd yuanma 2", anotation: "anotation", x: 100, y: 200 }],
        [3, { id: 3, functionName: "cnmd3", sourceCode: "nmbd yuanma 3", anotation: "anotation", x: 200, y: 100 }],
        [4, { id: 4, functionName: "cnmd4", sourceCode: "nmbd yuanma 4", anotation: "anotation", x: 200, y: 200 }]
      ]),
      edgeMap: new Map([
        [1, { id: 1, fromId: 1, toId: 2, closeness: 0.3, anotation: "edge 1" }],
        [2, { id: 2, fromId: 2, toId: 3, closeness: 0.1, anotation: "edge 2" }],
        [3, { id: 3, fromId: 3, toId: 4, closeness: 0.3, anotation: "edge 3" }]
      ]),
      connectiveDomainMap: new Map([
        [1, { id: 1, anotation: "Cnmd 1", color: "#8DB6CD", vertexIds: [1, 2, 3, 4], edgeIds: [1, 2, 3] }],
        [2, { id: 2, anotation: "Cn 2", color: "#DB7093", vertexIds: [1, 2], edgeIds: [1] }],
        [3, { id: 3, anotation: "cnm 3", color: "#FF7F24", vertexIds: [3, 4], edgeIds: [3] }]
      ]),
      connectiveDomainMapColorChangeTracker: 0,
      subgraphMap: new Map([
        [1, { id: 1, threshold: 0, name: "Default", connectiveDomainIds: [1] }],
        [2, { id: 2, threshold: 0.2, name: "Subgraph 1", connectiveDomainIds: [2, 3] }]
      ])
    },
    userId: 0,
    projectId: 0,


  },
  mutations: {
    moveVertex(state, p) {
      // TODO: 这种写法不会触发数据响应，虽然也不需要，只是不知道是否符合标准
      var v = state.project.vertexMap.get(p.id)
      v.x = p.x
      v.y = p.y
    },
    changeConnectiveDomainColor(state, p) {
      // TODO: 这种写法强行触发数据响应，不知道是否符合标准
      state.project.connectiveDomainMap.get(p.id).color = p.color
      Vue.set(state.project, "connectiveDomainMapColorChangeTracker", state.project.connectiveDomainMapColorChangeTracker + 1)
    },
    setUserId(state, id){
      state.userId = id;
    },
    setProjectId(state, pid){
      state.projectId = pid;
    },
    initProject(state, data){
      state.projectId = data.dynamicVo.projectName;
      state.project.vertexMap.clear();
      state.project.edgeMap.clear();
      state.project.connectiveDomainMap.clear();
      state.project.subgraphMap.clear();
      // console.log("vertex:");

      data.vertices.forEach(vertex => {
        state.project.vertexMap.set(vertex.id, vertex);
        // console.log(vertex);
      })

      // console.log("edge:");
      data.edges.forEach(edge => {
        state.project.edgeMap.set(edge.id, edge);
        // console.log(edge);
      });
      // console.log("sb:");

      data.subgraphs.forEach(subgraph => {
        // console.log(subgraph);
        state.project.subgraphMap.set(subgraph.id, subgraph);
      });
      
      // console.log("data");
      // console.log(data);
      // console.log("state.project.subgraphMap.size");
      console.log(state.project.subgraphMap);
      console.log(state.project.vertexMap);
      console.log(state.project.edgeMap);
      Vue.set(state.project, "connectiveDomainMapColorChangeTracker", state.project.connectiveDomainMapColorChangeTracker + 1);
    }
  },
  actions: {
  },
  modules: {
  },
  getters: {
    projectDynamicVo(state) {
      return {
        id: state.project.id,
        projectName: state.project.projectName,
        vertices: [...state.project.vertexMap.values()].map(v => {
          return {
            id: v.id,
            anotation: v.anotation,
            x: v.x,
            y: v.y
          }
        }),
        edges: [...state.project.edgeMap.values()].map(e => {
          return {
            id: e.id,
            anotation: e.anotation
          }
        }),
        subgraphs: null // TODO: 处理子图
      }
    },
    connectiveDomainMapColorChangeTracker(state) {
      return state.project.connectiveDomainMapColorChangeTracker
    },
    userId(state){
      return state.userId;
    }
  }
})
