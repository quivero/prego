'use strict';

// [START app]
import express from 'express'
import Graph from './data-structures/graph/Graph.js'
import GraphVertex from './data-structures/graph/GraphVertex.js'
import GraphEdge from './data-structures/graph/GraphEdge.js'
import depthFirstSearch from './algorithms/depth-first-search/depthFirstSearch.js'

const app = express();

// [START enable_parser]
// This middleware is available in Express v4.16.0 onwards
app.use(express.json({extended: true}));
// [END enable_parser]

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

app.get('/', (req, res) => {
  // Driver program
  // Create a sample graph
  // const graph = req.blueprint.nodes;
  
  // A directed graph
  let graph_ = new Graph(true);

  // Nodes
  let A = new GraphVertex('A');
  let B = new GraphVertex('B');
  let C = new GraphVertex('C');
  let D = new GraphVertex('D');

  // Vertices
  let AB = new GraphEdge(A, B);
  let AC = new GraphEdge(A, C);
  let AD = new GraphEdge(A, D);
  let BD = new GraphEdge(B, D);
  let CA = new GraphEdge(C, A);
  let CB = new GraphEdge(C, B);
  
  // Add vertices
  graph_
    .addVertex(A)
    .addVertex(B)
    .addVertex(C)
    .addVertex(D);

  // Add edges
  graph_
    .addEdge(AB)
    .addEdge(AC)
    .addEdge(AD)
    .addEdge(BD)
    .addEdge(CA)
    .addEdge(CB);

  res.send(graph_.toString());
});
// [END app]

