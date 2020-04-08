<template>
  <div style="width: 100%; height: 70%;">
    <DepGraph
      v-bind:subgraph-id="subgraphId"
      v-bind:path-to-show="pathToShow"
      v-bind:selected-item="selectedItem"
      v-bind:selected-connective-domain-id="selectedConnectiveDomainId"
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
    <router-link to="login">Login</router-link>
    <v-btn @click="toAdminLogin">haha</v-btn>
  </div>
</template>
<script>
import DepGraph from "@/components/DepGraph";
import { addUser } from "../request/api";
export default {
  components: {
    DepGraph
  },
  data() {
    return {
      selectedConnectiveDomainId: undefined,
      selectedItem: undefined,
      subgraphId: 2,
      pathToShow: [2, 3]
    };
  },
  methods: {
    cnmdVertex(id) {
      this.selectedItem = { type: "n", id };
      console.log("Select on vertex", id);
    },
    cnmdEdge(id) {
      this.selectedItem = { type: "e", id };
      console.log("Select on edge", id);
    },
    cnmdConnectiveDomain(id) {
      this.selectedConnectiveDomainId = id;
      console.log("select on connective domain", id);
    },
    toAdminLogin(){
      this.$router.push("adminLogin");
    }
  },
  mounted() {
    addUser(null, "yzj", "123123")
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }
};
</script>
