// [START app]
import express from 'express';
import { createRequire } from 'module';
import fs from 'fs';

import _ from 'lodash';

import {
  parseBlueprintToGraph,
  fromStartToFinishCombsAllPaths,
} from '../utils/workflow/parsers.js';

import {
  sort
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

  const bps_root = `${process.cwd()}/src/samples/blueprints/`;
  const blueprints_fnames = fs.readdirSync(bps_root);

  const READ_ALL_BPS = false;

  if (READ_ALL_BPS) {
    const paths = {};
    let total_paths_len = 0;

    for (let i = 0; i < blueprints_fnames.length; i += 1) {
      const blueprint_i_name = blueprints_fnames[i];
      const fname = bps_root + blueprint_i_name;
      const tokens = fname.split('.');

      if (tokens[tokens.length - 1] === 'json') {
        const blueprint_i = require(fname);

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
    const blueprint_fname = 'DemandasEspontaneas.json';

    const fname = bps_root + blueprint_fname;
    const blueprint = require(fname);
    const graph = parseBlueprintToGraph(blueprint);

    const edges = graph.findEdgesByVertexIndicesTuples(graph.bridges());
    const bridge_ends = _.uniq(_.flatten(
      edges.map((edge) => graph.convertEdgeToVerticesIndices(edge))
    ))
    
    console.log(sort(_.uniq(_.flatten(
      graph.convertEdgesToVerticesIndices(graph.getAllEdges())
     ))).length)

    // Remove bridges to obtain strongly connected components
    graph.deleteEdges(edges);
    
    // Dictionary with islads
    const islands_dict = graph.retrieveUndirected().getStronglyConnectedComponentsIndices()
    
    // Add edges to obtain strongly connected components
    graph.addEdges(edges);
    
    res.send('Hi!');
  }
});
// [END app]
