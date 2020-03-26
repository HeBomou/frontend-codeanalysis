<template>
  <div id="MainCy" style="width: 100%;height: 100%;"></div>
</template>
<script>
export default {
  mounted() {
    var cy = this.$cytoscape({
      container: document.getElementById("MainCy"),

      layout: {
        name: "grid",
        rows: 2,
        cols: 2
      },

      style: [
        {
          selector: "node",
          style: {
            content: "data(name)",
            "background-color": "magenta",
            "background-image": "url(img/shixian.png)"
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

      elements: {
        nodes: [
          {
            data: {
              id: "j",
              name: "Jerry"
            }
          },
          {
            data: {
              id: "e",
              name: "Elaine"
            }
          },
          {
            data: {
              id: "k",
              name: "Kramer"
            }
          },
          {
            data: {
              id: "g",
              name: "George"
            }
          }
        ],
        edges: [
          {
            data: {
              source: "j",
              target: "e"
            }
          },
          {
            data: {
              source: "j",
              target: "k"
            }
          },
          {
            data: {
              source: "j",
              target: "g"
            }
          },
          {
            data: {
              source: "e",
              target: "j"
            }
          },
          {
            data: {
              source: "e",
              target: "k",
              relationship: "1"
            }
          },
          {
            data: {
              source: "k",
              target: "j",
              relationship: "2"
            }
          },
          {
            data: {
              source: "k",
              target: "e",
              relationship: "3"
            }
          },
          {
            data: {
              source: "k",
              target: "g",
              relationship: "4"
            }
          },
          {
            data: {
              source: "g",
              target: "j",
              relationship: "5"
            }
          }
        ]
      }
    });
    cy.nodes().on("click", evt => {
      console.log(evt);
    });
    cy.edges().on("click", evt => {
      console.log(evt);
    });
  }
};
</script>
