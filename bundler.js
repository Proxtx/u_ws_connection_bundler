import { clients } from "./ws.js";
import config from "@proxtx/config";

export const request = async (id, request) => {
  if (clients[id]) {
    if (
      request.service == "core" &&
      request.data?.export == "key" &&
      request.auth != config.auth
    )
      return { success: false, error: 2 };
    return { success: true, result: await clients[id].sendRequest(request) };
  } else return { success: false, error: 1 };
};

export const listClients = () => {
  return { success: true, clients: Object.keys(clients) };
};
