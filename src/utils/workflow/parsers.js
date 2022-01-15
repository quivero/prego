import Graph from '../../data-structures/graph/Graph.js'
import GraphVertex from '../../data-structures/graph/GraphVertex.js'
import GraphEdge from '../../data-structures/graph/GraphEdge.js'
import { getUniques } from '../arrays/arrays.js'

export const parseBlueprintToGraph = (blueprint) => {
    let nodes = blueprint.blueprint_spec.nodes;
    let graph = new Graph(true);
    let vertices_dict = {};

    for(let i=0; i<nodes.length; i++){
        vertices_dict[nodes[i].id] = new GraphVertex(nodes[i].id);
    }

    let edges = [];

    // Iterate along array elements
    for(let i=0; i<nodes.length; i++){        
        if(nodes[i].next != null){
            // Flow case            
            if(typeof(nodes[i].next) === 'object'){
                let next_values = getUniques(Object.values(nodes[i].next));

                for(let j=0; j<next_values.length; j++){
                    let edge = new GraphEdge(vertices_dict[nodes[i].id], 
                                             vertices_dict[next_values[j]]);
                    edges.push(edge);
                }
            }
            // Ordinary edge 
            else {
                let edge = new GraphEdge(vertices_dict[nodes[i].id], 
                                         vertices_dict[nodes[i].next]);
                edges.push(edge);
            }
        }
    }
    
    graph.addEdges(edges);

    return graph;
}

export const parseWorkflowXMLToGraph = () => {
    throw Error('Not implemented');
}

