'use strict';

// [START app]
const express = require('express');
const { Graph } = require('./utils/directed_graph.js');

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
  
  let s = Graph(4);
  s.addEdge(0, 1);
  s.addEdge(0, 2);
  s.addEdge(0, 3);
  s.addEdge(2, 0);
  s.addEdge(2, 1);
  s.addEdge(1, 3);

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

  res.send(text_);
});
// [END app]

