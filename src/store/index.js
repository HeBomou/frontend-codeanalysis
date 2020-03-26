import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    project: { // TODO: 测试数据
      id: 1,
      projectName: "projectName 1",
      vertexMap: new Map([
        [1, { id: 1, functionName: "cnmd1", sourceCode: "nmbd yuanma 1", anotation: "anotation", x: -1, y: -1 }],
        [2, { id: 2, functionName: "cnmd2", sourceCode: "nmbd yuanma 2", anotation: "anotation", x: -1, y: -1 }],
        [3, { id: 3, functionName: "cnmd3", sourceCode: "nmbd yuanma 3", anotation: "anotation", x: -1, y: -1 }]
      ]),
      edgeMap: new Map([
        [1, { id: 1, fromId: 1, toId: 2, closeness: 0.1, anotation: "edge 1" }],
        [2, { id: 2, fromId: 2, toId: 3, closeness: 0.2, anotation: "edge 2" }]
      ]),
      subgraphs: [] // TODO: 子图不应当为空
    }
  },
  mutations: {
    moveVertex(state, p) {
      var v = state.project.vertexMap.get(p.id)
      v.x = p.x
      v.y = p.y
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
    vertices: state => {
      return [...state.project.vertexMap.values()]
    },
    edges: state => {
      return [...state.project.edgeMap.values()]
    }
  }
})
