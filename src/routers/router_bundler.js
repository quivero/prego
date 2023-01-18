import status_router from './status.js'
import workflow_router from './workflow.js'

let base_router_tuples = [
    [ '/status', status_router ],
    [ '/workflow', workflow_router ]
]

export default base_router_tuples