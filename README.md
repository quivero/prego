# Prego

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/330043511b8240faa6161331a11e2abb)](https://app.codacy.com/gh/quivero/prego?utm_source=github.com&utm_medium=referral&utm_content=quivero/prego&utm_campaign=Badge_Grade_Settings)
[![StandWithUkraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/badges/StandWithUkraine.svg)](https://github.com/vshymanskyy/StandWithUkraine/blob/main/docs/README.md)
[![npm version](https://img.shields.io/npm/v/dot-quiver)](https://www.npmjs.com/package/quivero-api)
[![Code coverage report](https://codecov.io/gh/quivero/prego/branch/main/graph/badge.svg?token=U6VOO56PDL)](https://app.codecov.io/gh/quivero/prego)
[![downloads](https://img.shields.io/npm/dm/quivero-api)](https://www.npmjs.com/package/quivero-api)

This is a npm data-structure package and application service: The former is work in progress; the latter exhibits a more mature form. It is a bootstrap from this project: https://github.com/trekhleb/javascript-algorithms.

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

[Here is an example](https://github.com/quivero/use-case) of the library use case.

1. Navigate to your project path (for example, NodeJS or React);
2. Install the library by command run `npm install --save quivero-api`;
3. Import in your project, for example, `import Graph from 'quivero-api/data-structures/graph/Graph.js'`

### As a service

We host the app on a cloud service `{AWS, Azure, GCloud}` or run locally. For it, we run either commands below:

1. Dockerfile:

```
docker build -t quivero . &&& docker run --publish 8080:8080 quivero
```

2. docker-compose:

```
docker-compose up
```

We follow the instructions below to host the service locally:

1. Clone the repository by command run on terminal: `git clone git@github.com:quivero/quivero-api.git`;
2. Run the commands:

   2.1. `npm install`: install local dependencies;

   2.2. `npm start`: run the server locally;

3. Go to route `localhost:8080` on the URL field of predilect browser;

## Featured

The library [Mermaid](https://github.com/mermaid-js/mermaid-cli) offers a graphical manner to visualize, among others, graphs. It is a feature as a parser for development tool [FlowBuild](https://github.com/flow-build) workflow JSON-artifacts, available [here](https://github.com/quivero-api/quivero-api/blob/44217b78c9b15dfbe33708b8f744ce8d3ea00e99/utils/workflow/parsers.js#L531). There are some samples [here](https://github.com/quivero/quivero-api-api/tree/main/src/samples/blueprints/diagrams).

For diagrams rendering, you need to:

1. Copy the text file content available [here](https://github.com/quivero/quivero-api/tree/main/src/samples/blueprints/diagrams);
2. Open online Mermaid Editor [here](https://mermaid.live);
3. Paste the copied content from item 1) on the respective text field;
4. In the case of big enough textual diagram, the platform will complain and deactivate auto-rendering. You must reactivate it to see the rendered diagram.

__Remark__: The resulting diagram text-code outputs as a string with escape characters `\n`. The online tool [FreeFormater](https://www.freeformatter.com/json-escape.html) allows the developer to indent the text without these non-compilable escape characters. We follow instructions below:

1. Open online tool [FreeFormater](https://www.freeformatter.com/json-escape.html);
2. Copy-paste the text on the text field;
3. Press `Unescape JSON`: the unescaped text appears on text field below.

## Backlog

### As a solution

There are similar libraries in different languages for the particular case of data-structure "graph" e.g. [networkx](https://networkx.org/documentation/stable/reference/classes/index.html): they provide multiple concepts for graph formalization and defition whose current author's knowledge lacks. Hence, it seems reasonable to offer similar features in these direction.

### As a package

A glossary with implementation possibilities is available [here](https://en.wikipedia.org/wiki/Glossary_of_graph_theory). This package author is sofar able to obtain the following ideas from it:

1. data-structures/graph/Graph.js:

   - [ ] isTraceable(): [definition](https://mathworld.wolfram.com/TraceableGraph.html)

## Prelude

In case you run it as a service, nodemon may disappear from terminal. You may kill the process by run of command `fuser -k 8080/tcp`
