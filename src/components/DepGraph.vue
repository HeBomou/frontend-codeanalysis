<template>
  <div id="cy" style="width: 100%; height: 100%"></div>
</template>

<script>
import cytoscape from "cytoscape";
import { mapGetters } from "vuex";

export default {
  mounted() {
    this.cy = cytoscape({
      container: document.getElementById("cy"),
      // layout: { name: "grid", rows: 2, cols: 2 },
      style: [
        {
          selector: "node",
          style: {
            content: "data(name)",
            "background-color": "data(color)"
          }
        },
        {
          selector: "edge",
          style: {
            content: "data(relationship)",
            "curve-style": "bezier",
            "line-color": "data(color)",
            "target-arrow-color": "data(color)",
            "target-arrow-shape": "triangle"
          }
        },
        // some style for the extension
        {
          selector: ".eh-handle",
          style: {
            "background-color": "red",
            width: 12,
            height: 12,
            shape: "ellipse",
            "overlay-opacity": 0,
            "border-width": 12, // makes the handle easier to hit
            "border-opacity": 0
          }
        },
        {
          selector: ".eh-hover",
          style: {
            "background-color": "red"
          }
        },
        {
          selector: ".eh-source",
          style: {
            "border-width": 2,
            "border-color": "red"
          }
        },
        {
          selector: ".eh-target",
          style: {
            "border-width": 2,
            "border-color": "red"
          }
        },
        {
          selector: ".eh-preview, .eh-ghost-edge",
          style: {
            "background-color": "red",
            "line-color": "red",
            "target-arrow-color": "red",
            "source-arrow-color": "red"
          }
        },
        {
          selector: ".eh-ghost-edge.eh-preview-active",
          style: {
            opacity: 0
          }
        }
      ]
    });
    this.refreshGraph();
  },
  methods: {
    refreshGraph() {
      let e = this.getElements();
      this.cy.nodes().remove();
      this.cy.edges().remove();
      this.cy.add(e.nodes);
      this.cy.add(e.edges);
      this.cy
        .nodes()
        .orphans()
        .on("select", evt => {
          if (evt.target._private.data.id.charAt(0) == "n")
            this.$emit(
              "connectiveDomainSelected",
              parseInt(evt.target._private.data.parent.substring(1))
            );
          else
            this.$emit(
              "connectiveDomainSelected",
              parseInt(evt.target._private.data.id.substring(1))
            );
        });
      this.cy
        .nodes()
        .nonorphans()
        .on("select", evt => {
          this.$emit(
            "vertexSelected",
            parseInt(evt.target._private.data.id.substring(1))
          );
        });
      this.cy.edges().on("select", evt => {
        this.$emit(
          "edgeSelected",
          parseInt(evt.target._private.data.id.substring(1))
        );
        this.$emit(
          "connectiveDomainSelected",
          parseInt(evt.target._private.data.parent.substring(1))
        );
      });
      this.cy.nodes().on("dragfree", evt => {
        let node = evt.target._private;
        if (node.children.length == 0)
          this.$store.commit("moveVertex", {
            id: parseInt(node.data.id.substring(1)),
            x: node.position.x,
            y: node.position.y
          });
        else {
          node.children.forEach(chr => {
            this.$store.commit("moveVertex", {
              id: parseInt(chr._private.data.id.substring(1)),
              x: chr._private.position.x,
              y: chr._private.position.y
            });
          });
        }
      });
    },
    getElements() {
      if (this.subgraphId == undefined) return { nodes: [], edges: [] };
      let subgraph = this.$store.state.project.subgraphMap.get(this.subgraphId);
      let vMap = this.$store.state.project.vertexMap;
      let eMap = this.$store.state.project.edgeMap;
      let dMap = this.$store.state.project.connectiveDomainMap;

      let nodeMap = new Map();
      vMap.forEach((v, k) => {
        nodeMap.set(k, {
          group: "nodes",
          data: {
            id: "n" + v.id,
            name: v.functionName,
            color: "#999999"
          },
          position: {
            x: v.x,
            y: v.y
          }
        });
      });
      let edgeMap = new Map();
      eMap.forEach((e, k) => {
        edgeMap.set(k, {
          group: "edges",
          data: {
            id: "e" + e.id,
            source: "n" + e.fromId,
            target: "n" + e.toId,
            relationship: e.closeness,
            color: "#999999"
          }
        });
      });

      // 指定联通域与着色
      subgraph.connectiveDomainIds.forEach(id => {
        let domain = dMap.get(id);
        nodeMap.set("c" + id, {
          group: "nodes",
          data: {
            id: "c" + id,
            name: "",
            color: "#FFEEEE"
          }
        });
        domain.vertexIds.forEach(vid => {
          let node = nodeMap.get(vid);
          node.data.parent = "c" + id;
          node.data.color = domain.color;
        });
        domain.edgeIds.forEach(eid => {
          let edge = edgeMap.get(eid);
          edge.data.parent = "c" + id;
          edge.data.color = domain.color;
        });
      });

      // 高亮显示路径
      if (this.pathToShow)
        this.pathToShow.forEach(id => {
          edgeMap.get(id).data.color = "#D15FEE";
        });

      return {
        nodes: [...nodeMap.values()],
        edges: [...edgeMap.values()]
      };
    }
  },
  props: {
    subgraphId: Number,
    pathToShow: Array
  },
  data() {
    return {};
  },
  watch: {
    subgraphId() {
      this.refreshGraph();
    },
    pathToShow() {
      this.refreshGraph();
    },
    connectiveDomainMapColorChangeTracker() {
      this.refreshGraph();
    }
  },
  computed: {
    ...mapGetters(["connectiveDomainMapColorChangeTracker"])
  }
};
</script>

<style lang="sass">
</style>