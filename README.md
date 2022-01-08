# Paths in a Graph from A to B

Hi, this is an app, but you can interpret it as a service. Its service is to find all paths in a connected graph com node A to B.

Premisse: There is ALWAYS at least one path from A to B. 

The natural extension to this service are:

1) How far one can reach from one node;
2) return empty array in case there is no path feasible.

You may utilize some cloud service to host the app, like AWS, Azure or GCloud, but in this case you might run locally.
You must follow the instructions below

1) Clone the repository typing on terminal `git clone git@github.com:brunolnetto/path_finder.git`;
3) Run the command `npm install` to install local dependencies;
3) Run the command `npm start` to run the server locally;
4) Open a browser;
5) Type `localhost:8080` on the URL field;
6) See the possible paths from node 2 to 3.


