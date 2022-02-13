// [START app]
import express from 'express';
import { createRequire } from 'module';
import fs from 'fs';

import {
  parseBlueprintToGraph,
  fromStartToFinishCombsAcyclicPaths,
} from './utils/workflow/parsers.js';

import { cartesianProduct } from './utils/arrays/arrays.js'

const require = createRequire(import.meta.url);
const app = express();

// [START enable_parser]
// This middleware is available in Express v4.16.0 onwards
app.use(express.json({ extended: true }));
// [END enable_parser]

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

app.get('/', (req, res) => {
  // Driver program
  // Create a sample graph

  const bps_root = './samples/blueprints/';
  const blueprints_fnames = fs.readdirSync(bps_root);

  const READ_ALL_BPS = false;
  const TEST_USE_CASE = true;
  const blueprint_fname = 'precious.json';
  
  const descriptions = [];
  
  if (READ_ALL_BPS) {
    for (let i = 0; i < blueprints_fnames.length; i++) {
      const fname = bps_root + blueprints_fnames[i];
      const blueprint_i = require(fname);
      
      // let graph_i = parseBlueprintToGraph(blueprint_i);
      descriptions.push(fromStartToFinishCombsAcyclicPaths(blueprint_i));
    }

    res.send(descriptions);
  } else {
    const fname = bps_root + blueprint_fname;
    const blueprint_i = require(fname);
    
    const graph = parseBlueprintToGraph(blueprint_i);
    const route_describe = fromStartToFinishCombsAcyclicPaths(blueprint_i);
    
    let start_nodes_indexes=graph.orphanNodes();
    let finish_nodes_indexes=graph.looseNodes();
    
    let paths = [];
    for(let [start_node_index, 
             finish_node_index] of cartesianProduct(start_nodes_indexes, finish_nodes_indexes)){
      let start_node = graph.getVertexByIndex(start_node_index)
      let finish_node = graph.getVertexByIndex(finish_node_index)
      
      paths.push(graph.allPaths(start_node, finish_node))
    }

    res.send(paths);
  }

});
// [END app]
