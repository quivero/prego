// [START app]
import express from 'express';
import { createRequire } from 'module';
import fs from 'fs';

import _ from 'lodash';

import date from 'date-and-time';

import {
  parseBlueprintToGraph,
  startAndFinishNodes,
  getBlueprintFromToEdgeTuples,
  getBlueprintNextNodes,
  blueprintValidity,
  fromStartToFinishCombsAllPaths,
} from '../utils/workflow/parsers.js';

import {
  spreadEuler,
} from '../utils/arrays/arrays.js';

import {
  partitions,
} from '../utils/combinatorics/partition.js';

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
  // Driver program - Create a sample graph

  const bps_root = `${process.cwd()}/src/samples/blueprints/approva/`;
  const blueprints_fnames = fs.readdirSync(bps_root);

  const READ_ALL_BPS = true;
  const sf_nodes = {};
  const loose_nodes = [];
  const orphan_nodes = [];

  if (READ_ALL_BPS) {
    const magnify_blueprint = {};
    
    for (let i = 0; i < blueprints_fnames.length; i += 1) {
      const blueprint_i_name = blueprints_fnames[i];
      const fname = bps_root + blueprint_i_name;
      const tokens = fname.split('.');

      if (tokens[tokens.length - 1] === 'json') {
        const blueprint_i = require(fname);
        const graph = parseBlueprintToGraph(blueprint_i);

        magnify_blueprint[blueprint_i_name] = blueprintValidity(blueprint_i);
      }
    }

    res.send(magnify_blueprint);
    
  } else {
    const blueprint_fname = 'botMessage.json';

    const fname = bps_root + blueprint_fname;
    const blueprint = require(fname);
    
    res.send(blueprintValidity(blueprint));
  }
});
// [END app]
