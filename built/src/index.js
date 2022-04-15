"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// [START app]
var express_1 = require("express");
var module_1 = require("module");
var fs_1 = require("fs");
var parsers_js_1 = require("../utils/workflow/parsers.js");
var require = module_1.createRequire(import.meta.url);
var app = express_1.default();
// [START enable_parser]
// This middleware is available in Express v4.16.0 onwards
app.use(express_1.default.json({ extended: true }));
// [END enable_parser]
// Listen to the App Engine-specified port, or 8080 otherwise
var PORT = process.env.PORT || 8080;
app.listen(PORT, function () {
    console.log("Listening on port: " + PORT);
});
app.get('/', function (req, res) {
    // Driver program - Create a sample graph
    var bps_root = process.cwd() + "/src/samples/blueprints/approva/";
    var blueprints_fnames = fs_1.default.readdirSync(bps_root);
    var READ_ALL_BPS = true;
    var sf_nodes = {};
    var loose_nodes = [];
    var orphan_nodes = [];
    if (READ_ALL_BPS) {
        var paths = {};
        var total_paths_len = 0;
        for (var i = 0; i < blueprints_fnames.length; i += 1) {
            var blueprint_i_name = blueprints_fnames[i];
            var fname = bps_root + blueprint_i_name;
            var tokens = fname.split('.');
            if (tokens[tokens.length - 1] === 'json') {
                var blueprint_i = require(fname);
                var graph = parsers_js_1.parseBlueprintToGraph(blueprint_i);
                paths[blueprint_i_name] = parsers_js_1.fromStartToFinishCombsAllPaths(blueprint_i);
                total_paths_len += paths[blueprints_fnames[i]].length;
            }
        }
        res.send({
            length: total_paths_len,
            blueprints: paths,
        });
    }
    else {
        var blueprint_fname = 'botMessage.json';
        var fname = bps_root + blueprint_fname;
        var blueprint = require(fname);
        res.send(parsers_js_1.fromStartToFinishCombsAllPaths(blueprint));
    }
});
// [END app]
