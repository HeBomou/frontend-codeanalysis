<template>
  <div style="width: 100%; height: 100%;">
    <DepGraph @vertexSelected="cnmdVertex" @edgeSelected="cnmdEdge"></DepGraph>
  </div>
</template>
<script>
import DepGraph from "@/components/DepGraph";
export default {
  components: {
    DepGraph
  },
  data() {
    return {};
  },
  methods: {
    cnmdVertex(id) {
      console.log("Select on vertex", id);
    },
    cnmdEdge(id) {
      console.log("Select on edge", id);
    }
  }
};
</script>
