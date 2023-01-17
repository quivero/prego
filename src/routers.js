import { Router } from "express";

import { statusPage_controller } from "./controllers/status.js";
import { 
  summarizeBlueprint_controller,
  summarizeBlueprints_controller,
  generateBlueprintDiagram_controller
} from "./controllers/workflow.js";


const workflow_route_tuples = [
  [ Router.get, "/workflow/create/summary", summarizeBlueprints_controller ],
  [ Router.get, "/workflow/create/summary/:blueprint_name", summarizeBlueprint_controller ],
  [ Router.get, "/workflow/create/diagram", summarizeBlueprints_controller ],
  [ Router.get, "/workflow/create/diagram/:blueprint_name", generateBlueprintDiagram_controller ]
]

const status_route_tuples = [
  [ "/status/page/:code", statusPage_controller ]
]

const routers_tuples = [
  workflow_route_tuples,
  status_route_tuples
]

let router, verb, route, route_callback;
routers = [];

routers_tuples.forEach(
  (router_tuples) => {
    router = Router()

    router_tuples.forEach(
      (router_tuple) => {
        verb = router_tuple[0];
        route = router_tuple[1];
        route_callback = router_tuple[2];

        verb.call(route, route_callback);
      }
    )

    router.push(router);
  }
)

export default routers;