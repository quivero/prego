// [START app]
import express from 'express';

import _ from 'lodash';
import 'lodash.multicombinations';

import {
  processBlueprint,
  processBlueprints,
  blueprintValidity,
  getBlueprintInvalidNodes,
  castBlueprintToDiagram,
} from '../utils/workflow/parsers.js';

import {
  saveStringtoFile,
  loadJSONfromFile,
  saveJSONtoFile,
  createDirectory
} from '../utils/file/file.js';

import {
  objectForEach,
  objectFlatten,
  objectFilter,
} from '../utils/objects/objects.js';

import {
  generateRandomMeshVertices,
} from '../data-structures/mesh/utils/mesh.js';

import {
  nNormDistance,
} from '../utils/distances/distance.js';

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
  const bps_root = `${curr_dir}/src/samples/blueprints/approva/`;
  const diagrams_root_folder = `${curr_dir}/src/samples`
  const diagrams_folder = 'diagrams';

  const diagramConfig = loadJSONfromFile(`${curr_dir}/utils/workflow/`, 'diagramConfig')
  createDirectory(diagrams_root_folder, diagrams_folder);
  
  const READ_ALL_BPS = true;
  let output = {};

  if (READ_ALL_BPS) {
    output = processBlueprints(
      bps_root, 
      (blueprint) => castBlueprintToDiagram(blueprint, diagramConfig)
    )
    
    objectForEach(
      output,
      (blueprint_name, diagram_content) => {
        saveStringtoFile(
          `${diagrams_root_folder}/${diagrams_folder}`, 
          `${blueprint_name}`, 
          diagram_content
        )
      }
    );
    
  } else {
    const blueprint_fname = 'botMessage.json';

    res.send(
      processBlueprint(
        bps_root,
        blueprint_fname,
        getBlueprintInvalidNodes,
      ),
    );
  }
  
  res.send(':)');
  
});
// [END app]
