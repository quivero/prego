// [START app]
import express from 'express';
import { createRequire } from 'module';
import fs from 'fs';

import {
  fromStartToFinishCombsAllPaths,
  describeBlueprint,
} from './utils/workflow/parsers.js';

import { cartesianProduct } from './utils/arrays/arrays.js';

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

  const bps_root = './samples/blueprints/approva/';
  const blueprints_fnames = fs.readdirSync(bps_root);

  const READ_ALL_BPS = true;

  if (READ_ALL_BPS) {
    const paths = [];
    const route_describe = {};

    for (let i = 0; i < blueprints_fnames.length; i++) {
      const blueprint_i_name = blueprints_fnames[i];

      const fname = bps_root + blueprint_i_name;
      const blueprint_i = require(fname);

      paths.push(fromStartToFinishCombsAllPaths(blueprint_i));
    }

    res.send(paths);
  } else {
    const blueprint_fname = 'new_request.json';

    const fname = bps_root + blueprint_fname;
    const blueprint = require(fname);

    const route_describe = fromStartToFinishCombsAllPaths(blueprint);

    res.send(route_describe);
  }
});
// [END app]
