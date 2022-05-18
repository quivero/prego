// [START app]
import express from 'express';

import _ from 'lodash';
import 'lodash.multicombinations';

import {
  processBlueprint,
  processBlueprints,
  parseBlueprintToGraph,
  castBlueprintToDiagram,
  castBlueprintPathsToDiagram,
  generateBlueprintPathDiagrams,
  fromStartToFinishCombsAllPaths,
} from '../utils/workflow/parsers.js';

import {
  loadJSONfromFile,
  createDirectory,
} from '../utils/file/file.js';

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
  // Driver program - Create a sample graph
  const curr_dir = `${process.cwd()}`;
  const bps_root = `${curr_dir}/src/samples/blueprints`;
  const diagrams_destination_folder = 'diagrams';
  
  const diagramConfig = loadJSONfromFile(`${curr_dir}/utils/workflow/`, 'diagramConfig')
  createDirectory(bps_root, diagrams_destination_folder);
  
  const READ_ALL_BPS = true;
  let processed_blueprint = {};
  let paths = {};
  let bp_graph = {};
  
  if (READ_ALL_BPS) {
    processed_blueprint = processBlueprints(
      bps_root, 
      (blueprint) => {
        /*
        // TAKE NOTE: Verifies valid paths within blueprint
        // TO FIX: Review invalid routes given blueprint
        paths = fromStartToFinishCombsAllPaths(blueprint);
        bp_graph = parseBlueprintToGraph(blueprint);
        
        for (const from_start_to_finish_key in paths.from_to) {
          for (const route_index in paths.from_to[from_start_to_finish_key].routes) {
            paths['from_to'][from_start_to_finish_key]['routes'][route_index] = bp_graph.isChain(
              bp_graph.convertVerticesKeystoIndexes(
                paths.from_to[from_start_to_finish_key].routes[route_index].node_path.trace
              )
            )
          }
        }
        */
        
        return generateBlueprintPathDiagrams(
          blueprint, bps_root,
          diagrams_destination_folder, 
          diagramConfig
        );
      }
    )
    
    res.send(processed_blueprint);
    
  } else {
    const blueprint_fname = 'activitySchemaValidation';
    
    processed_blueprint = processBlueprint(
      bps_root, `${blueprint_fname}.json`,
      (blueprint) => generateBlueprintPathDiagrams(
        blueprint, bps_root,
        diagrams_destination_folder,
        diagramConfig
      )
    );
    
    res.send(':)');
  }
  
});
// [END app]
