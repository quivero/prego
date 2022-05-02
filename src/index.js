// [START app]
import express from 'express';
import fs from 'fs';

import _ from 'lodash';
import 'lodash.multicombinations';

import {
  processBlueprint,
  processBlueprints,
  blueprintValidity,
} from '../utils/workflow/parsers.js';

import MeshVertex from '../data-structures/mesh/MeshVertex.js';

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

  const bps_root = `${process.cwd()}/src/samples/blueprints/approva/`;
  const READ_ALL_BPS = false;

  if (READ_ALL_BPS) {
    res.send(processBlueprints(bps_root, blueprintValidity));
  } else {
    const blueprint_fname = 'botMessage.json';

    res.send(processBlueprint(bps_root, blueprint_fname, blueprintValidity));
  }
});
// [END app]
