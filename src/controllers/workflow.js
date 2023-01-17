import {
    processBlueprint,
    processBlueprints,
    summarizeBlueprint,
    generateBlueprintDiagrams
  } from "../../utils/workflow/parsers.js";

const project_root_dir = `${process.cwd()}`;
const relative_bps_path = "src/samples/blueprints"
const absolute_bps_root = `${project_root_dir}/${relative_bps_path}`;
const relative_destination_folder = "diagrams";

export const summarizeBlueprint_handler  = (blueprint) => {
    return summarizeBlueprint(blueprint);
};

export const generateBlueprintDiagram_handler = (blueprint) => {
    return generateBlueprintDiagrams(
        blueprint, absolute_bps_root, relative_destination_folder
    );
};

export const summarizeBlueprint_controller = (req, res) => {    
    res.send(processBlueprint(
        absolute_bps_root, summarizeBlueprint_handler
    ));
}

export const summarizeBlueprints_controller = (req, res) => {    
    res.send(processBlueprints(
        absolute_bps_root, summarizeBlueprint_handler
    ));
}

export const generateBlueprintDiagram_controller = (req, res) => {
    const blueprint_name = req.params.blueprintName;
    const blueprint_fname = `${blueprint_name}.json`;
    
    res.send(processBlueprint(
        absolute_bps_root, blueprint_fname, 
        generateBlueprintDiagram_handler
    ));
}