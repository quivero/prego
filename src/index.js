// [START app]
import express from 'express';
import _ from 'lodash';
import 'lodash.multicombinations';

import {
  processBlueprint,
  processBlueprints,
  summarizeBlueprint,
  castBlueprintPathsToDiagram,
  generateValidBlueprintPathDiagrams,
  fromStartToFinishCombsAllPaths
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
  // Driver program - Create a sample graph
  const curr_dir = `${process.cwd()}`
  const bps_root = `${curr_dir}/src/samples/blueprints/tester`;
  const diagrams_destination_folder = 'diagrams';
  
  const READ_ALL_BPS = true;
  let processed_blueprint = {};
  let paths = {};
  let paths_ = {};
  let bp_graph = {};

  if (READ_ALL_BPS) {
    processed_blueprint = processBlueprints(
      bps_root,
      (blueprint) => {

        return summarizeBlueprint(blueprint);
      }
    );

    res.send(processed_blueprint);
  } else {
    const blueprint_fname = 'activitySchemaValidation';

    processed_blueprint = processBlueprint(
        bps_root, 
        `${blueprint_fname}.json`, 
        (blueprint) => generateBlueprintPathDiagrams(blueprint, bps_root, diagrams_destination_folder)
    );

    res.send(':)');
  }
});
// [END app]
