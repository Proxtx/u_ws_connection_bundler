import { router, server } from "@proxtx/combine-rest";
import express from "express";
import config from "@proxtx/config";

const app = express();

server.addModule("./../../../bundler.js", "bundler");
app.use("api", router);

console.log("API listening on:", config.apiPort);
app.listen(config.apiPort);
