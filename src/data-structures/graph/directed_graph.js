// JavaScript program to print all paths from a source to destination.
// Adapted from: https://www.geeksforgeeks.org/find-paths-given-source-destination/

class Graph {
    constructor(num_vertices) {
        this.v = num_vertices;
        this.adjList = new Array(this.v);
    
        for (let i = 0; i < num_vertices; i++) {
            this.adjList[i] = [];
        }
    }

    // add edge from u to v
    addEdge(from, to){
        // Add v to u's list.
        this.adjList[from].push(to);
    }

    // Nodes without 
    looseNodes(){
        let loose_nodes = [];
    
        for(let i=0; i<this.v; i++){
            if(this.adjList[i].length==0){
                loose_nodes.push(i);
            }
        }
    
        return loose_nodes;
    }

    allVicinity(s, d){
        let paths = {};
    
        // Initialization
        for(let i=0; i<this.v; i++){
            paths[i] = [];
        }
        
        // 
        for(let i=0; i<this.v; i++){
            for(let j=0; j<this.v; j++){
                if(i!=j){
                    let paths_ij = this.allPaths(i, j)
                
                    if(paths_ij.length!=0){
                        paths[i].push(j);
                    }
                }
            }
        }
    
        return paths;
    }

    // Prints all paths from 's' to 'd'
    allPaths(from, to){
        let isVisited = new Array(this.v);
        for(let i=0;i<this.v;i++) {
            isVisited[i]=false;
        }

        let pathList = [];
        let paths = [];

        // add source to path[]
        pathList.push(from);

        // Call recursive utility
        this.depth_search(from, to, isVisited, pathList, paths);

        return paths;
    }

    // A recursive function to print all paths from 'u' to 'd'.
    // isVisited[] keeps track of vertices in current path.
    // localPathList<> stores actual vertices in the current path
    depth_search(from, to, isVisited, localPathList, paths) {
        if (from == to) {
            // Push the discoverred path
            paths.push([...localPathList]);

            // if match found then no need to traverse more till depth
            return;
        }
        
        // Mark the current node
        isVisited[from] = true;

        // Recur for all the vertices adjacent to current vertex u
        let adj_len = this.adjList[from].length;
        for (let i=0; i<adj_len; i++) {
            if(!isVisited[this.adjList[from][i]]) {
                // store current node in path[]
                localPathList.push(this.adjList[from][i]);

                this.depth_search(this.adjList[from][i], to, isVisited, localPathList, paths);
                
                // remove current node  in path[]
                let idx = localPathList.indexOf(this.adjList[from][i]);
                localPathList.splice(idx, 1);
            }
        }
        
        // Mark the current node
        isVisited[from] = false;
    }
};
