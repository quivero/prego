import {
  processBlueprint,
  processBlueprints,
  summarizeBlueprint,
  generateBlueprintDiagrams,
} from "#utils/workflow/parsers.js";

const project_root_dir = `${process.cwd()}`;
const samples_relative_folder = "src/samples";
const absolute_blueprints_root = `${project_root_dir}/${samples_relative_folder}/blueprints`;
const diagrams_destination_folder = "diagrams";

// Handlers
const summarizeBlueprint_handler = (blueprint) => summarizeBlueprint(blueprint);

const generateBlueprintDiagram_handler = (blueprint) => {
  return generateBlueprintDiagrams(
    blueprint,
    samples_relative_folder,
    diagrams_destination_folder
  );
};

// Controllers
export const summarizeBlueprint_controller = (req, res) => {
  const blueprint_name = req.params.blueprint_name;
  const blueprint_fname = `${blueprint_name}.json`;

  res.send(
    processBlueprint(
      absolute_blueprints_root,
      blueprint_fname,
      summarizeBlueprint_handler
    )
  );
};

export const summarizeBlueprints_controller = (req, res) => {
  res.send(
    processBlueprints(absolute_blueprints_root, summarizeBlueprint_handler)
  );
};

export const generateBlueprintDiagram_controller = (req, res) => {
  const blueprint_name = req.params.blueprint_name;
  const blueprint_fname = `${blueprint_name}.json`;

  res.send(
    processBlueprint(
      absolute_blueprints_root,
      blueprint_fname,
      generateBlueprintDiagram_handler
    )
  );
};
