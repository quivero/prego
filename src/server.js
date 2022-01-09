'use strict';

// [START app]
import express from 'express'
import Graph from './data-structures/graph/Graph.js'
import GraphVertex from './data-structures/graph/GraphVertex.js'
import GraphEdge from './data-structures/graph/GraphEdge.js'

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
  
  graph_.addVertex(A);
  graph_.addVertex(B);
  graph_.addVertex(C);
  graph_.addVertex(D);

  graph_
    .addEdge(AB)
    .addEdge(AC)
    .addEdge(AD)
    .addEdge(BD)
    .addEdge(CA)
    .addEdge(CB);

  console.log(graph_.getAllEdges());
  console.log(graph_.getAllVertices());
  res.send(graph_.toString());

  /*
  // arbitrary source
  let from_ = 1;

  // arbitrary destination
  let to = 3;

  let all_paths = s.allPaths(from_, to);
  let all_vicinity = s.allVicinity();
  let loose_nodes = s.looseNodes();

  console.log('Paths from '+from_+' to '+to+' :');
  console.log(all_paths);
  
  console.log('Reachibility: ');
  console.log(all_vicinity);

  console.log('Loose nodes: ');
  console.log(loose_nodes);

  let text_ = "Original code from the URL :  <a href=https://www.geeksforgeeks.org/find-paths-given-source-destination//> Graph paths original post </a> " + "<br>";
  
  if(all_paths.length==0){
    text_ = text_ + 'There is no path available from ' + from_ + ' to ' + to + '!';
  } else {
    text_ = text_ + "Following are all different paths from " + from_ + " to " + to + "<br>";
    
    for (let i=0; i<all_paths.length; i++) {
      text_ = text_ + all_paths[i] + "<br>";
    }
  }
  */
});
// [END app]

