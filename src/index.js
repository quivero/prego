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
  let sf_nodes = {};
  let loose_nodes = [];
  let orphan_nodes = [];

  if (READ_ALL_BPS) {
    let paths = {};
    let total_paths_len = 0;

    for (let i = 0; i < blueprints_fnames.length; i += 1) {
      let blueprint_i_name = blueprints_fnames[i];
      let fname = bps_root + blueprint_i_name;
      let tokens = fname.split('.');

      if (tokens[tokens.length - 1] === 'json') {
        let blueprint_i = require(fname);
        let graph = parseBlueprintToGraph(blueprint_i);

        paths[blueprint_i_name] = fromStartToFinishCombsAllPaths(blueprint_i);
        total_paths_len += paths[blueprints_fnames[i]].length;
      }
    }

    res.send(
      {
        length: total_paths_len,
        blueprints: paths,
      },
    );
  } else {
    const blueprint_fname = 'botMessage.json';

    let fname = bps_root + blueprint_fname;
    let blueprint = require(fname);

    res.send(fromStartToFinishCombsAllPaths(blueprint));
  }
});
// [END app]
