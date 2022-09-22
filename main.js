import { WebSocketServer } from "ws";

const ws = new WebSocketServer({ port: 8080 });

ws.on("connection", async (ws) => {
  ws.on("message", (data) => {
    console.log("received: %s", data);
  });

  ws.send(
    JSON.stringify({
      service: "ble",
      id: "test1234",
      data: {
        export: "start_scan",
        arguments: ["test", "test234"],
      },
    })
  );

  await new Promise((r) => setTimeout(r, 20000));
  ws.send(
    JSON.stringify({
      service: "ble",
      id: "newId",
      data: {
        export: "peripherals",
        arguments: [],
      },
    })
  );

  await new Promise((r) => setTimeout(r, 3000));

  ws.send(
    JSON.stringify({
      service: "ble",
      id: "newId",
      data: {
        export: "connect",
        arguments: ["22:FA:9F:3F:EB:16"],
      },
    })
  );

  await new Promise((r) => setTimeout(r, 3000));

  ws.send(
    JSON.stringify({
      service: "ble",
      id: "newId",
      data: {
        export: "discover_services",
        arguments: [],
      },
    })
  );

  await new Promise((r) => setTimeout(r, 3000));

  ws.send(
    JSON.stringify({
      service: "ble",
      id: "newId",
      data: {
        export: "write_to_uuid",
        arguments: [0xffd9, [0x56, 0xff, 0x00, 0x00, 0x00, 0xf0, 0xaa]],
      },
    })
  );

  await new Promise((r) => setTimeout(r, 3000));

  ws.send(
    JSON.stringify({
      service: "core",
      id: "newId",
      data: {
        export: "restart",
        arguments: [0xffd9, [0x56, 0xff, 0x00, 0x00, 0x00, 0xf0, 0xaa]],
      },
    })
  );

  console.log("new connection");
});
