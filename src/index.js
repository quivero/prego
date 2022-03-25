// [START app]
import express from 'express';
import { createRequire } from 'module';
import fs from 'fs';

import _ from 'lodash';

import {
  parseBlueprintToGraph,
} from '../utils/workflow/parsers.js';

import {
  partitionTree,
} from '../utils/combinatorics/partition.js';

import {
  spreadExtendedVenn,
  spreadVenn,
} from '../utils/arrays/arrays.js';

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

  const READ_ALL_BPS = false;

  if (READ_ALL_BPS) {
    const paths = {};
    const islands = [];
    const total_paths_len = 0;

    for (let i = 0; i < blueprints_fnames.length; i += 1) {
      const blueprint_i_name = blueprints_fnames[i];
      const fname = bps_root + blueprint_i_name;
      const tokens = fname.split('.');

      if (tokens[tokens.length - 1] === 'json') {
        const blueprint_i = require(fname);

        const graph = parseBlueprintToGraph(blueprint_i);

        islands.push(
          {
            name: blueprints_fnames[i],
            islands: graph.getIslandGraph().describe(),
          },
        );

        // paths[blueprint_i_name] = fromStartToFinishCombsAllPaths(blueprint_i);
        // total_paths_len += paths[blueprints_fnames[i]].length;
      }
    }

    res.send(islands);

    /* res.send(
      {
        length: total_paths_len,
        blueprints: paths,
      },
    ); */
  } else {
    const blueprint_fname = 'propertiesCRUD.json';

    const fname = bps_root + blueprint_fname;
    const blueprint = require(fname);
    const graph = parseBlueprintToGraph(blueprint);

    let a = [1, 2, 3, 4, 5]
    let b = [1, 3, 5, 7, 9]
    let c = [2, 4, 6, 8, 10]
    let d = [1, 2, 4, 5, 7, 8]
    let e = [1, 2, 5, 6, 9, 10]
    let f = [8, 9, 11, 12, 14, 15]
    let g = [9, 10, 12, 13, 15, 16]
    let h = [8, 11, 12, 15, 18, 20]
    let i = [7, 10, 13, 14, 15, 17]
    let j = [11, 12, 13, 14, 15, 16]
    let k = [10, 11, 14, 15, 18, 19]
    let l = [1, 5, 10, 15, 17, 20]

    a = 10;

    res.send(partitionTree(8));
  }
});
// [END app]
