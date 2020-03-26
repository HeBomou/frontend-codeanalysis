<template>
  <div style="width: 100%; height: 100%;">
    <DepGraph v-bind:graph-data="graphData"></DepGraph>
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
      graphData: {
        id: 1,
        vertices: [
          {
            id: 1,
            functionName: "cnmd1",
            sourceCode: "nmbd yuanma 1"
          },
          {
            id: 2,
            functionName: "cnmd2",
            sourceCode: "nmbd yuanma 2"
          },
          {
            id: 3,
            functionName: "cnmd3",
            sourceCode: "nmbd yuanma 3"
          }
        ],
        edges: [
          {
            id: 1,
            fromId: 1,
            toId: 2,
            closeness: 0.1
          },
          {
            id: 2,
            fromId: 2,
            toId: 3,
            closeness: 0.2
          }
        ],
        subgraphs: null
      }
    };
  }
};
</script>
