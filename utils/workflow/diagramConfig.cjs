module.exports = {
  themes: {
    nodes: {
      style: {
        default: {
          fill: "#e0e0e0",
          stroke: "#bdbdbd",
          "stroke-width": "3px",
        },
        start_node: {
          fill: "#3B1",
          stroke: "#391",
          "stroke-width": "8px",
        },
        finish_node: {
          fill: "#3B1",
          stroke: "#391",
          "stroke-width": "8px",
        },
        trail_node: {
          fill: "#0CF",
          stroke: "#09F",
          "stroke-width": "6px",
        },
        bugged_node: {
          fill: "#F88",
          stroke: "#F22",
          "stroke-width": "3px",
        },
      },
      borders: {
        default: {
          left: "[",
          right: "]",
        },
        start_node: {
          left: "([",
          right: "])",
        },
        finish_node: {
          left: "([",
          right: "])",
        },
        trail_node: {
          left: "([",
          right: "])",
        },
        bugged_node: {
          left: "([",
          right: "])",
        },
        flow_node: {
          left: "{",
          right: "}",
        },
      },
    },
    edges: {
      default: {
        link: "--",
        style: {},
      },
      trail: {
        link: "==",
        style: {
          stroke: "gold",
          "stroke-width": "4px",
        },
      },
    },
  },
};
