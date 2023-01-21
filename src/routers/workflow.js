import { Router } from "express";

import {
  summarizeBlueprint_controller,
  summarizeBlueprints_controller,
  generateBlueprintDiagram_controller,
} from "../controllers/workflow.js";

let workflow_router = Router();

workflow_router.get("/create/summary", summarizeBlueprints_controller);

workflow_router.get(
  "/create/summary/:blueprint_name",
  summarizeBlueprint_controller
);

workflow_router.get(
  "/create/diagram/:blueprint_name",
  generateBlueprintDiagram_controller
);

export default workflow_router;
