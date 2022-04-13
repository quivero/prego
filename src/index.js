// [START app]
import express from 'express';
import { createRequire } from 'module';
import fs from 'fs';

import _ from 'lodash';

import date from 'date-and-time';

import {
  parseBlueprintToGraph,
} from '../utils/workflow/parsers.js';

import {
  spreadEuler,
} from '../utils/arrays/arrays.js';

import {
  partitions,
} from '../utils/combinatorics/partition.js';

import {
  fromStartToFinishCombsAllPaths,
} from '../utils/workflow/parsers.js';

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

  if (READ_ALL_BPS) {
    let paths = {};
    let total_paths_len = 0;

    for (let i = 0; i < blueprints_fnames.length; i += 1) {
      const blueprint_i_name = blueprints_fnames[i];
      const fname = bps_root + blueprint_i_name;
      const tokens = fname.split('.');

      if (tokens[tokens.length - 1] === 'json') {
        const blueprint_i = require(fname);

        const graph = parseBlueprintToGraph(blueprint_i);

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
    const blueprint_fname = 'propertiesCRUD.json';

    const fname = bps_root + blueprint_fname;
    const blueprint = require(fname);
    const graph = parseBlueprintToGraph(blueprint);

    const a = [1, 2, 3, 4, 5];
    const b = [1, 3, 5, 7, 9];
    const c = [2, 4, 6, 8, 10];
    const d = [1, 2, 4, 5, 7, 8];
    const e = [1, 2, 5, 6, 9, 10];
    const f = [8, 9, 11, 12, 14, 15];
    const g = [9, 10, 12, 13, 15, 16];
    const h = [8, 11, 12, 15, 18, 20];
    const i = [7, 10, 13, 14, 15, 17];
    const j = [11, 12, 13, 14, 15, 16];
    const k = [10, 11, 14, 15, 18, 19];
    const l = [1, 5, 10, 15, 17, 20];

    res.send(spreadEuler([a, b, c, d, e, f, g, h, i, j, k, l]));
  }
});
// [END app]
