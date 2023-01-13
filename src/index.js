// [START app]
import {
  processBlueprint,
  processBlueprints,
  summarizeBlueprint,
} from "../utils/workflow/parsers.js";

import { statusImgPath } from "../utils/logging/status.js";

import { app } from "./router.js";

app.get("/status/:code", (req, res) => {
  res.sendFile(process.cwd() + "/" + statusImgPath(req.params.code));
});

app.get("/", (req, res) => {
  // Driver program - Create a sample graph
  const curr_dir = `${process.cwd()}`;
  const bps_root = `${curr_dir}/src/samples/blueprints`;
  const diagrams_destination_folder = "diagrams";

  const READ_ALL_BPS = true;
  let processed_blueprint = {};

  if (READ_ALL_BPS) {
    processed_blueprint = processBlueprints(bps_root, (blueprint) =>
      summarizeBlueprint(blueprint)
    );

    res.send(processed_blueprint);
  } else {
    const blueprint_fname = "activitySchemaValidation";

    processed_blueprint = processBlueprint(
      bps_root,
      `${blueprint_fname}.json`,
      (blueprint) =>
        generateBlueprintPathDiagrams(
          blueprint,
          bps_root,
          diagrams_destination_folder
        )
    );
  }
});

// [END app]
