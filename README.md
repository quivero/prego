# Paths in a Graph from A to B

Hi, this is an app, but you can interpret it as a service. Its duty is to find all paths in a connected graph com node A to B.

## Preamble

For a beginner, a graph is a bunch of dots connected by either undirected lines or directed arrows. Take a look at the following URL: https://adrianmejia.com/data-structures-for-beginners-graphs-time-complexity-tutorial/

*Premisse*: There is ALWAYS at least one path from A to B. (Improvement required)

## How to run

You may utilize some cloud service to host the app, like AWS, Azure or GCloud, but in this case you might run locally.
You must follow the instructions below

1) Clone the repository typing on terminal `git clone git@github.com:brunolnetto/path_finder.git`;
3) Run the command `npm install` to install local dependencies;
3) Run the command `npm start` to run the server locally;
4) Open a browser;
5) Type `localhost:8080` on the URL field;
6) See the possible paths from node 2 to 3.

## Backlog

New features to this service are:

[:priority]: :explanation

1) [  High  ]: Allow to identify cyclic paths: 
    How: A cycle appears in a graph if 
        a) The current node has at least ONE upcoming arrow and ONE outcoming arrow
        b) Both outer nodes were already visited.
    Status: Undone
2) [ Medium ]: identify loose nodes (vertices)
    How: A loose node has no adjacent nodes.
3) [ Medium ]: Given a node, which nodes it can reach;
    Status: Done
4) [ Low ]: Empty array for non-reachable destination node;
    Status: Done