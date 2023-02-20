import config from "@proxtx/config";
import { WebSocketServer } from "ws";

export const clients = {};

const wss = new WebSocketServer({ port: config.wsPort });

wss.on("connection", async (ws) => {
  let newMessage;
  let latestData;
  let id;

  ws.on("message", (data) => {
    try {
      data = JSON.parse(data);
    } catch {}
    newMessage(data);
    latestData = data;
  });

  ws.on("close", () => {
    delete clients[id];
    console.log("A client disconnected:", id);
  });

  ws.send(
    JSON.stringify({
      service: "core",
      id: "init",
      auth: "no_auth_request",
      data: {
        export: "id",
        arguments: [],
      },
    })
  );

  while (!(latestData && latestData.id == "init")) {
    await new Promise((r) => (newMessage = r));
  }

  id = latestData.result;
  let client = new Client(ws, id);
  clients[id] = client;
  newMessage = (msg) => client.message(msg);
});

class Client {
  messageAwaiters = {};
  latestMessage;

  constructor(socket, id) {
    this.id = id;
    this.socket = socket;
    console.log("Client logon:", id);
  }

  async sendRequest(request) {
    this.socket.send(JSON.stringify(request));
    let resolved = false;
    await new Promise((r) => {
      this.messageAwaiters[request.id] = r;
      setTimeout(() => {
        if (!resolved && request.service == "core") {
          delete clients[this.id];
          this.latestMessage = false;
          console.log("A client disconnected due to a timeout:", this.id);
          r();
        }
      }, 20000);
    });
    resolved = true;
    delete this.messageAwaiters[request.id];
    return this.latestMessage;
  }

  message(msg) {
    if (this.messageAwaiters[msg.id]) {
      this.latestMessage = msg;
      this.messageAwaiters[msg.id]();
    }
  }
}

console.log("WebSocket listening on:", config.wsPort);
