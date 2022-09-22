import { clients } from "./ws.js";

export const request = async (id, request) => {
  if (clients[id])
    return { success: true, result: await clients.sendRequest(request) };
  else return { success: false, error: 1 };
};

export const listClients = () => {
  return { success: true, clients: Object.keys(clients) };
};
