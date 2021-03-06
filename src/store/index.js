import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    project: { // TODO: 测试数据
      id: 1,
      projectName: "projectName 1",
      vertexMap: new Map([
        [1, { id: 1, functionName: "wellcome to happy 6+", sourceCode: "hello", anotation: "hello", x: 100, y: 100 }],
      ]),
      edgeMap: new Map([
        [1, { id: 1, fromId: 1, toId: 1, closeness: 1, anotation: "edge 1" }],
      ]),
      connectiveDomainMap: new Map([
        [1, { id: 1, anotation: "hello", color: "#8DB6CD", vertexIds: [1], edgeIds: [1]}
      ]]),
      initGraphTracker: 0,
      connectiveDomainMapColorChangeTracker: 0,
      subgraphMap: new Map([
        [1, { id: 1, threshold: 0, name: "Default", connectiveDomainIds: [1], dynamicVo: {id: 1, name: "Default", vertices: [{id: 1, subgraphId: 1, x: 0, y: 0}]} }],
      ])
    },
    userId: 0,
    projectId: 0,
    adminId: 0,
    adminName: 0


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
    setUserId(state, id) {
      state.userId = id;
      localStorage.userId = id;
    }, setAdminId(state, id) {
      state.adminId = id;
      localStorage.adminId = id;
    },
    setProjectId(state, pid) {
      state.projectId = pid;
      localStorage.projectId = pid;
    }, addSubGraph(state, subgraph) {
      let domainId = [];
        subgraph.connectiveDomains.forEach(domain => {
          domainId.push(domain.id);
          state.project.connectiveDomainMap.set(domain.id, {
            id: domain.id, anotation: domain.domainDynamicVo.anotation, color: domain.domainDynamicVo.color, vertexIds: domain.vertexIds, edgeIds: domain.edgeIds
          });
        });
        state.project.subgraphMap.set(subgraph.id, {
          id: subgraph.id,
          threshold: subgraph.threshold,
          connectiveDomainIds: domainId,
          dynamicVo: subgraph.dynamicVo
        });
    },setAdminName(state, data){
      state.adminName = data;
      localStorage.adminName = data;
    },
    initProject(state, data) {
      state.projectId = data.dynamicVo.id;
      state.projectName = data.dynamicVo.projectName;
      state.project.vertexMap.clear();
      state.project.edgeMap.clear();
      state.project.connectiveDomainMap.clear();
      state.project.subgraphMap.clear();
      //console.log("vertex:");

      data.vertices.forEach(vertex => {
        let anotation = "";
        if(vertex.dynamicVo != null){
          anotation = vertex.dynamicVo.anotation;
        }
        state.project.vertexMap.set(vertex.id, {
          id: vertex.id, functionName: vertex.functionName, sourceCode: vertex.sourceCode, anotation: anotation, x: 0, y: 0
        });
        
        // ////console.log(vertex);
      });

      // ////console.log("edge:");
      data.edges.forEach(edge => {
        if (edge.dynamicVo == null) {
          state.project.edgeMap.set(edge.id, {
            id: edge.id, fromId: edge.fromId, toId: edge.toId, closeness: edge.closeness, anotation: ""
          });
        } else {
          state.project.edgeMap.set(edge.id, {
            id: edge.id, fromId: edge.fromId, toId: edge.toId, closeness: edge.closeness, anotation: edge.dynamicVo.anotation
          });
        }
        // ////console.log(edge);
      });
      // ////console.log("sb:");

      //subgraph
      data.subgraphs.forEach(subgraph => {
        let domainId = [];
        subgraph.connectiveDomains.forEach(domain => {
          domainId.push(domain.id);
          state.project.connectiveDomainMap.set(domain.id, {
            id: domain.id, anotation: domain.domainDynamicVo.anotation, color: domain.domainDynamicVo.color, vertexIds: domain.vertexIds, edgeIds: domain.edgeIds
          })
        })
        state.project.subgraphMap.set(subgraph.id, {
          id: subgraph.id,
          threshold: subgraph.threshold,
          connectiveDomainIds: domainId,
          dynamicVo: subgraph.dynamicVo
        });
      });

      // ////console.log("data");
      // ////console.log(data);
      // ////console.log("state.project.subgraphMap.size");
      // ////console.log(state.project.subgraphMap);
      // ////console.log(state.project.vertexMap);
      // ////console.log(state.project.edgeMap);
      Vue.set(state.project, "initGraphTracker", state.project.initGraphTracker + 1);
    }, updateVertex(state, vertex) {
      //认为xy没有发生变化
      state.project.vertexMap.set(vertex.id, vertex);
      
    }, updateVertexPos(state, vertexPos){
      //只有xy变化
      let vertex = state.project.subgraphMap.get(vertexPos.subgraphId).dynamicVo.vertices.find(v => v.id == vertexPos.vertex.id);
      vertex.x = vertexPos.vertex.x;
      vertex.y = vertexPos.vertex.y;
    }, updateEdge(state, edge) {
      state.project.edgeMap.set(edge.id, edge);
    }, updateDomain(state, domain) {
      state.project.connectiveDomainMap.set(domain.id, domain);
    }, rojectRawData(state, data){
      state.projectRawData = data;
    }, selectSubgraph(state, subgraphId){
      //选择某个subgraph，更换点的坐标位置
      state.project.subgraphMap.get(subgraphId).dynamicVo.vertices.forEach(v => {
        let vertex = state.project.vertexMap.get(v.id);
        vertex.x = v.x;
        vertex.y = v.y;
      });
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
    initGraphTracker(state) {
      return state.project.initGraphTracker;
    },
    connectiveDomainMapColorChangeTracker(state) {
      return state.project.connectiveDomainMapColorChangeTracker;
    },
    userId(state) {
      if (!state.userId || state.userId == 0) {
        state.userId = localStorage.getItem('userId');
      }
      return state.userId;
    },
    adminId(state) {
      if (!state.adminId || state.adminId == 0) {
        state.adminId = localStorage.getItem('adminId');
      }
      return state.adminId;
    },
    projectId(state) {
      if (!state.projectId || state.projectId == 0) {
        state.projectId = localStorage.getItem('projectId');
      }
      return state.projectId;
    },
    adminName(state) {
      if (!state.adminName || state.adminName == 0){
        state.adminName = localStorage.getItem('adminName');
      }
      return state.adminName;
    }
  }
})
