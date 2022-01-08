// JavaScript program to print all paths from a source to destination.
// Adapted from: https://www.geeksforgeeks.org/find-paths-given-source-destination/
 
let  v;
let adjList;

// A directed graph using adjacency list representation
function Graph(num_vertices) {
    // initialise vertex count
    v = num_vertices;

    // initialise adjacency list
    initAdjList();
}

// Utility method to initialise adjacency list
function initAdjList(){
    adjList = new Array(v);
 
    for (let i = 0; i < v; i++) {
        adjList[i] = [];
    }
}

// add edge from u to v
function addEdge(u,v){
    // Add v to u's list.
        adjList[u].push(v);
}

// Prints all paths from 's' to 'd'
function AllPaths(s, d){
    let isVisited = new Array(v);
    for(let i=0;i<v;i++) {
        isVisited[i]=false;
    }

    let pathList = [];
    let paths = [];

    // add source to path[]
    pathList.push(s);

    // Call recursive utility
    AllPathsUtil(s, d, isVisited, pathList, paths);

    return paths;
}

// A recursive function to print all paths from 'u' to 'd'.
// isVisited[] keeps track of vertices in current path.
// localPathList<> stores actual vertices in the current path
function AllPathsUtil(u, d, isVisited, localPathList, paths) {
    if (u == (d)) {
        // Push the discoverred path
        paths.push([...localPathList]);

        // if match found then no need to traverse more till depth
        return;
    }
    
    // Mark the current node
    isVisited[u] = true;

    // Recur for all the vertices adjacent to current vertex u
    for (let i=0; i< adjList[u].length; i++) {
        if(!isVisited[adjList[u][i]]) {
            // store current node in path[]
            localPathList.push(adjList[u][i]);

            AllPathsUtil(adjList[u][i], d, isVisited, localPathList, paths);
            
            // remove current node  in path[]
            let idx = localPathList.indexOf(adjList[u][i]);
            localPathList.splice(idx, 1);
        }
    }
    
    // Mark the current node
    isVisited[u] = false;
}

module.exports = {
    Graph: (num_vertices) => Graph(num_vertices),
    addEdge: (source, destination) => addEdge(source, destination),
    AllPaths: (source, destination) => AllPaths(source, destination)
};
