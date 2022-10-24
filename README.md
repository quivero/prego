# Some structures, many possibilities

[![StandWithUkraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/badges/StandWithUkraine.svg)](https://github.com/vshymanskyy/StandWithUkraine/blob/main/docs/README.md) 
[![npm version](https://img.shields.io/npm/v/dot-quiver)](https://www.npmjs.com/package/quivero-api)
![GitHub Sponsors](https://img.shields.io/github/sponsors/dot-quiver)
![Documentation Status](https://img.shields.io/npm/l/dot-quiver)
[![Code coverage report](https://codecov.io/gh/dot-quiver/dot-quiver-api/branch/main/graph/badge.svg?token=U6VOO56PDL)](https://app.codecov.io/gh/dot-quiver/dot-quiver-api)

Hi, this may be interpreted as an app service or a library: The former is work in progress; the latter exhibits a more mature form.

Its objective is to provide some data structures for application-suitable scenarios. It was bootstraped from this project: https://github.com/trekhleb/javascript-algorithms .

## Table of contents

1. [Preamble](#preamble)
2. [How to run](#how-to-run)
3. [Featured](#featured)
4. [Backlog](#backlog)
5. [Prelude](#prelude)

## Preamble

"In computer science, a data structure is a data organization, management, and storage format that enables efficient access and modification. More precisely, a data structure is a collection of data values, the relationships among them, and the functions or operations that can be applied to the data i.e., it is an algebraic structure about data." [From wikipedia](https://en.wikipedia.org/wiki/Data_structure)

## How to run

### As a package

The package allows to be used as a library. [Here is an example](https://github.com/dot-quiver/use-case) of the library use case.

1) Go to your project path (for example, NodeJS or React);
2) Install the library with the command ```npm install --save dot-quiver```;
3) Import in your project folder from project root folder, for example, ```import Graph from 'dot-quiver/data-structures/graph/Graph.js'```

### As a service

You may utilize some cloud service to host the app, like AWS, Azure or GCloud, but in this case you might run locally. You can use the docker file by building and running the application with commands below

```>>> docker build -t quivero . &&& docker run --publish 8080:8080 quivero```

To host it locally, you must follow the instructions below:

1) Clone the repository typing on terminal `git clone git@github.com:dot-quiver/dot-quiver-api.git`;
2) Run the commands:
    
    2.1. `npm install`: install local dependencies;
    
    2.2. `npm start`: run the server locally;

3) Open a browser;
4) Type `localhost:8080` on the URL field;

## Featured

The library [Mermaid](https://github.com/mermaid-js/mermaid-cli) offers a graphical manner to visualize graphs. It is a feature as a parser for Flowbuild Workflow blueprints, available [here](https://github.com/dot-quiver/dot-quiver-api/blob/44217b78c9b15dfbe33708b8f744ce8d3ea00e99/utils/workflow/parsers.js#L531). There are some samples [here](https://github.com/dot-quiver/dot-quiver-api/tree/main/src/samples/blueprints/diagrams). 

For diagrams rendering, you need to: 

1) Copy the content of some text file from [this](https://github.com/dot-quiver/dot-quiver-api/tree/main/src/samples/blueprints/diagrams) path; 
2) Enter on the Mermaid Editor [here](https://mermaid.live);
3) Paste the copied content from item 1) on the respective text field;
4) In case the diagram is too big, the platform will complain and deactivate auto-rendering. You must reactivate it to see the rendered diagram. 

## Backlog

### As a solution

I ask the reader apologies for the author's envy regarding similar python library [networkx](https://networkx.org/documentation/stable/reference/classes/index.html). They provide multiple concepts for graph formalization and defition whose author's knowledge lacks. Hence, it seems reasonable to offer similar features in this directions.

### As a Package

A glossary with implementation possibilities is available [here](https://en.wikipedia.org/wiki/Glossary_of_graph_theory). The author of this library is able sofar to obtain the following ideas from it:

1. data-structures/graph/Graph.js:

    - [ ] isTraceable(): [definition](https://mathworld.wolfram.com/TraceableGraph.html)


## Prelude

In case you run it as a service, nodemon may disappear from terminal. You may kill the process by run of command ```fuser -k 8080/tcp``` 

