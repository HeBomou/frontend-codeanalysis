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
          let node = evt.target;
          if (this._snode) this._snode.unselect();
          this._snode = node;
          if (node.data("id").charAt(0) == "n") {
            if (node.data("parent") == undefined) {
              // 选中无所属联通域的点
              this.$emit(
                "vertexSelected",
                parseInt(node.data("id").substring(1))
              );
            }
          }
          // 单独选中联通域
          else
            this.$emit(
              "connectiveDomainSelected",
              parseInt(node.data("id").substring(1))
            );
        });
      this.cy
        .nodes()
        .nonorphans()
        .on("select", evt => {
          let node = evt.target;
          if (this._snode) this._snode.unselect();
          this._snode = node;
          this.$emit("vertexSelected", parseInt(node.data("id").substring(1)));
        });
      this.cy.edges().on("select", evt => {
        this.$emit(
          "edgeSelected",
          parseInt(evt.target.data("id").substring(1))
        );
      });
      this.cy
        .nodes()
        .nonorphans()
        .on("dragfree", evt => {
          // 联通域中的点
          let node = evt.target;
          let id = parseInt(node.data("id").substring(1));
          let x = node.position("x");
          let y = node.position("y");
          this.$store.commit("moveVertex", {
            id,
            x,
            y
          });
          this.$emit("vertexMoved", {
            id,
            x,
            y
          });
        });
      this.cy
        .nodes()
        .orphans()
        .on("dragfree", evt => {
          let node = evt.target;
          let id = parseInt(node.data("id").substring(1));
          let x = node.position("x");
          let y = node.position("y");
          let chr = node.children();
          let prt = node.parent();
          if (chr.length == 0 && prt.length == 0) {
            // 联通域外的点
            this.$store.commit("moveVertex", {
              id,
              x,
              y
            });
            this.$emit("vertexMoved", {
              id,
              x,
              y
            });
          } else if (chr.length != 0) {
            // 联通域
            let dx = node.position("x") - node.data("x");
            let dy = node.position("y") - node.data("y");
            this.$emit("connectiveDomainMoved", {
              id,
              dx,
              dy
            });
          }
        });
      this.cy
        .nodes()
        .orphans()
        .on("grab", evt => {
          let node = evt.target;
          if (node.children().length != 0) {
            node.data("x", node.position("x"));
            node.data("y", node.position("y"));
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
        let func = v.functionName.split("(", 2)[0];
        let funcSplit = func.split(":", 2);
        let funcClass = funcSplit[0].split(".")[
          funcSplit[0].split(".").length - 1
        ];
        let funcName = funcSplit[1];
        nodeMap.set(k, {
          group: "nodes",
          data: {
            id: "n" + v.id,
            name: funcClass + ":" + funcName,
            color: "#999999",
            oriColor: "#999999"
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
            relationship: "", // 可以显示紧密度 e.closeness.toFixed(3),
            color: "#999999",
            oriColor: "#999999"
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
          node.data.oriColor = domain.color;
        });
        domain.edgeIds.forEach(eid => {
          let edge = edgeMap.get(eid);
          edge.data.parent = "c" + id;
          edge.data.color = domain.color;
          edge.data.oriColor = domain.color;
        });
      });

      return {
        nodes: [...nodeMap.values()],
        edges: [...edgeMap.values()]
      };
    }
  },
  props: {
    selectedItem: Object,
    selectedConnectiveDomainId: Number,
    subgraphId: Number,
    pathToShow: Array
  },
  data() {
    return {};
  },
  watch: {
    selectedItem(newItem, oldItem) {
      if (oldItem) {
        let item = this.cy.getElementById(oldItem.type + oldItem.id);
        if (item) item.data("color", item.data("oriColor"));
      }
      if (newItem) {
        let item = this.cy.getElementById(newItem.type + newItem.id);
        if (item) item.data("color", "#B03060");
      }
    },
    selectedConnectiveDomainId(newId, oldId) {
      if (oldId) {
        let cd = this.cy.getElementById("c" + oldId);
        if (cd) cd.data("color", "#FFEEEE");
      }
      if (newId) {
        let cd = this.cy.getElementById("c" + newId);
        if (cd) cd.data("color", "#E6E6FA");
      }
    },
    subgraphId() {
      this.refreshGraph();
    },
    pathToShow(newPath, oldPath) {
      // 取消之前的高亮
      if (oldPath) {
        oldPath.forEach(eId => {
          let e = this.cy.getElementById("e" + eId);
          if (e) e.data("color", e.data("oriColor"));
        });
      }
      // 显示新的高亮
      if (newPath) {
        newPath.forEach(eId => {
          let e = this.cy.getElementById("e" + eId);
          if (e) e.data("color", "#A2CD5A");
        });
      }
    },
    connectiveDomainMapColorChangeTracker() {
      // TODO: 很麻烦不想改
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