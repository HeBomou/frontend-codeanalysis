<template>
  <div id="cy" style="width: 100%; height: 100%"></div>
</template>

<script>
import cytoscape from "cytoscape";

export default {
  mounted() {
    this.initGraph();
  },
  methods: {
    initGraph() {
      let nodes = this.nodes;
      let edges = this.edges;
      // TODO: 初始化点的位置可以把锅扔给后端，或者前端加一个重新布局的按钮
      let init = !nodes.some(node => {
        return node.position.x != 0 && node.position.y != 0;
      });
      let elements = init ? { nodes, edges } : { nodes: [], edges: [] };
      let cy = cytoscape({
        container: document.getElementById("cy"),
        // layout: {
        //   name: "grid",
        //   rows: 2,
        //   cols: 2
        // },
        style: [
          {
            selector: "node",
            style: {
              content: "data(name)"
            }
          },
          {
            selector: "edge",
            style: {
              content: "data(relationship)",
              "curve-style": "bezier",
              "target-arrow-shape": "triangle",
              color: "red"
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
        ],
        elements
      });
      if (!init) {
        cy.add(nodes);
        cy.add(edges);
      }
      cy.nodes().on("select", evt => {
        this.$emit(
          "vertexSelected",
          parseInt(evt.target._private.data.id.substring(1))
        );
      });
      cy.edges().on("select", evt => {
        this.$emit(
          "edgeSelected",
          parseInt(evt.target._private.data.id.substring(1))
        );
      });
      cy.nodes().on("dragfree", evt => {
        let node = evt.target._private;
        this.$store.commit("moveVertex", {
          id: parseInt(node.data.id.substring(1)),
          x: node.position.x,
          y: node.position.y
        });
      });
    }
  },
  data() {
    return {};
  },
  computed: {
    nodes() {
      return this.$store.getters.vertices.map(v => {
        return {
          group: "nodes",
          data: {
            id: "n" + v.id,
            name: v.functionName
          },
          position: {
            x: v.x,
            y: v.y
          }
        };
      });
    },
    edges() {
      return this.$store.getters.edges.map(e => {
        return {
          group: "edges",
          data: {
            id: "e" + e.id,
            source: "n" + e.fromId,
            target: "n" + e.toId,
            relationship: e.closeness
          }
        };
      });
    }
  }
};
</script>

<style lang="sass">
</style>