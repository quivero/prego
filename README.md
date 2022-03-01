# A structure, many possibilities

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

```dot-quiver``` as a service

1. Add router to handle multiple use cases;
2. Add a docker-compose.yaml to ```up``` application

## Prelude

In case you run it as a service, nodemon may disappear from terminal. You may kill the process by run of command ```fuser -k 8080/tcp``` 

