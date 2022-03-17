# A structure, many possibilities

[![StandWithUkraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/badges/StandWithUkraine.svg)](https://github.com/vshymanskyy/StandWithUkraine/blob/main/docs/README.md)
[![npm version](https://img.shields.io/npm/v/dot-quiver)](https://www.npmjs.com/package/dot-quiver)
![GitHub Sponsors](https://img.shields.io/github/sponsors/dot-quiver)
![Documentation Status](https://img.shields.io/npm/l/dot-quiver)
[![Code coverage report](https://codecov.io/gh/dot-quiver/dot-quiver-api/branch/main/graph/badge.svg?token=U6VOO56PDL)](https://app.codecov.io/gh/dot-quiver/dot-quiver-api)

Hi, this may be interpreted as an app service or a library: The former is work in progress; the latter exhibits a more mature form.

Its objective is to provide a graph structure for application-suitable scenarios. It was bootstraped from this project: https://github.com/trekhleb/javascript-algorithms .

## Preamble

For a beginner, a graph is a bunch of dots connected by either undirected lines or directed arrows. Take a look at the following URL: https://adrianmejia.com/data-structures-for-beginners-graphs-time-complexity-tutorial/

## How to install as a package

The package allows to be used as a library. [Here is an example](https://github.com/brunolnetto/node-link-use-case) of the library use case.

1) Go to your project path (for example, NodeJS or React);
2) Install the library with the command ```npm install --save dot-quiver```;
3) Import in your project folder from project root folder, for example, '```import Graph from 'dot-quiver/data-structures/graph/Graph.js''```

## How to run as a service

You may utilize some cloud service to host the app, like AWS, Azure or GCloud, but in this case you might run locally.

You must follow the instructions below

1) Clone the repository typing on terminal `git clone git@github.com:brunolnetto/dot-quiver.git`;
2) Run the commands:
    
    2.1. `npm install`: install local dependencies;
    
    2.2. `npm start`: run the server locally;

3) Open a browser;
4) Type `localhost:8080` on the URL field;

## Backlog

### As a solution

I may apologize the reader for the author's envy for similar python library [networkx](https://networkx.org/documentation/stable/reference/classes/index.html). They provide multiple concepts for graph formalization and defition whose author's knowledge lacks. Hence, it seems reasonable to offer similar features in this directions.

Likewise, the library [Dracula](https://www.graphdracula.net/) offers a graphical manner to visualize graphs. It may be a future feature.

### As a Package

A glossary with implementation possibilities is available [here](https://en.wikipedia.org/wiki/Glossary_of_graph_theory). The author of this library is able sofar to obtain the following ideas from it:

1. data-structures/graph/Graph.js:

    - [x] isChain(vertices_indices_path)
    - [x] isEmpty()
    - [x] girth()
    - [ ] isTraceable(): [definition](https://mathworld.wolfram.com/TraceableGraph.html)
    - [x] isReachable(from_vertex, to_vertex):
    - [x] isCyclicHamiltonian(): 
    - [x] isPredecessor(vertex, candidate):
    - [x] getReachibilityList(type = 0)
    - [x] getReachibilityVenn(type = 0)
    - [x] volume(vertices_indices):
    - [x] islands()

4. data-structures/utils/graph/graph.js -> {petersonCycles}

### As a Service

1. Add router to handle multiple use cases;
2. Add a docker-compose.yaml to ```up``` application

## Prelude

In case you run it as a service, nodemon may disappear from terminal. You may kill the process by run of command ```fuser -k 8080/tcp``` 

