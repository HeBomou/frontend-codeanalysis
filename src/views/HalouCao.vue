<template>
  <div style="width: 100%; height: 70%;">
    <DepGraph
      v-bind:subgraph-id="subgraphId"
      v-bind:path-to-show="pathToShow"
      @vertexSelected="cnmdVertex"
      @edgeSelected="cnmdEdge"
      @connectiveDomainSelected="cnmdConnectiveDomain"
    ></DepGraph>
    <div @click="subgraphId = 1">按下此处显示原图联通域（默认子图）</div>
    <div @click="subgraphId = 2">按下此处显示id为2的子图的联通域</div>
    <div
      @click="$store.commit('changeConnectiveDomainColor', {id: 1, color: '#9ACD32'})"
    >按下此处给联通域1换绿色</div>
    <div
      @click="$store.commit('changeConnectiveDomainColor', {id: 1, color: '#8DB6CD'})"
    >按下此处给联通域1换蓝色</div>
    <div @click="pathToShow = undefined">隐藏路径显示</div>
    <div @click="pathToShow = [1, 2, 3]">显示cnmd1到cnmd4的路径</div>
  </div>
</template>
<script>
import DepGraph from "@/components/DepGraph";
export default {
  components: {
    DepGraph
  },
  data() {
    return {
      subgraphId: 2,
      pathToShow: [2, 3]
    };
  },
  methods: {
    cnmdVertex(id) {
      console.log("Select on vertex", id);
    },
    cnmdEdge(id) {
      console.log("Select on edge", id);
    },
    cnmdConnectiveDomain(id) {
      console.log("select on connective domain", id);
    }
  }
};
</script>
