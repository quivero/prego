# A structure, many possibilities

Hi, this may be interpreted as an app service or a library. Its main funcionality is to provide a graph structure for application-suitable scenarios. It was bootstraped from this project: https://github.com/trekhleb/javascript-algorithms .

## Preamble

For a beginner, a graph is a bunch of dots connected by either undirected lines or directed arrows. Take a look at the following URL: https://adrianmejia.com/data-structures-for-beginners-graphs-time-complexity-tutorial/


## How to run as a service

You may utilize some cloud service to host the app, like AWS, Azure or GCloud, but in this case you might run locally.

You must follow the instructions below

1) Clone the repository typing on terminal `git clone git@github.com:brunolnetto/node-link.git`;
3) Run the command `npm install` to install local dependencies;
3) Run the command `npm start` to run the server locally;
4) Open a browser;
5) Type `localhost:8080` on the URL field;

## How to install as a package

The package allows to be used as a library. [Here is an example](https://github.com/brunolnetto/node-link) of the library use case.

1) Go to your project path (for example, NodeJS or React); 
2) Install the library with the command ```npm install --save '@brunolnetto/node-link'```;
3) Import in your project with the paths from ```src``` folder. For example, '```import Graph from '@brunolnetto/node-link/src/data-structures/graph/Graph.js''```
 