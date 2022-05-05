// [START app]
import express from 'express';

import _ from 'lodash';
import 'lodash.multicombinations';

import {
  processBlueprint,
  processBlueprints,
  blueprintValidity,
} from '../utils/workflow/parsers.js';

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

  /*
  const bps_root = `${process.cwd()}/src/samples/blueprints/approva/`;
  const READ_ALL_BPS = false;

  if (READ_ALL_BPS) {
    res.send(processBlueprints(bps_root, blueprintValidity));
  } else {
    const blueprint_fname = 'botMessage.json';

    res.send(processBlueprint(bps_root, blueprint_fname, blueprintValidity));
  }
  */
  
  const vertices = generateRandomMeshVertices(10, 2, [0, 10]);
  const distance_fun = (coordinate_1, coordinate_2) => {
    return nNormDistance(coordinate_1, coordinate_2, 2)
  };
  
  console.log(distance_fun([0, 0], [1, 1]));
  
  res.send(':)');
});
// [END app]
