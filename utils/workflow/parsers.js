import _ from 'lodash';

import Graph from '../../data-structures/graph/Graph.js'
import GraphVertex from '../../data-structures/graph/GraphVertex.js'
import GraphEdge from '../../data-structures/graph/GraphEdge.js'
import { getUniques, getAllIndexes } from '../arrays/arrays.js'

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

export const fromStartToFinishAcyclicPaths = (blueprint, start_key, finish_key) => {
    let bp_graph = parseBlueprintToGraph(blueprint);
    
    let looseNodes = bp_graph.looseNodes();
    let orphanNodes = bp_graph.orphanNodes();
    let vertices_keys_to_indices = bp_graph.getVerticesIndices();
    
    let start_id = vertices_keys_to_indices[start_key];
    let finish_id = vertices_keys_to_indices[finish_key];
    
    if(getAllIndexes(orphanNodes, start_id).length==0){
        console.warn('Vertex id '+start_id+' is not a start node! Detected start nodes: '+orphanNodes);
        
        return [];
    }
    
    if(getAllIndexes(looseNodes, finish_id).length==0){
        console.warn('Vertex id '+finish_id+' is not a finish node! Detected finish nodes: '+looseNodes);
        
        return [];
    }

    let routes = bp_graph.acyclicPaths(start_key, finish_key);
    let route_describe = {length: routes.length, routes: routes}

    return route_describe
}

export const fromStartToFinishCombsAcyclicPaths = (blueprint) => {
    let nodes = blueprint.blueprint_spec.nodes;
    let finishNodes = [];
    let startNodes = [];  

    for(let node of nodes) {
        if(node.type.toLowerCase() === 'start'){
            startNodes.push(node.id);
        }

        if(node.type.toLowerCase() === 'finish'){
            finishNodes.push(node.id);
        }
    }

    let acyclic_paths = {};
    for(let startNode of startNodes){
        for(let finishNode of finishNodes){
            acyclic_paths[startNode+'_'+finishNode] = fromStartToFinishAcyclicPaths(blueprint, startNode, finishNode);
        }
    }
    
    return acyclic_paths;
}

export const parseWorkflowXMLToGraph = () => {
    throw Error('Not implemented');
}

