import Feathers from "@feathersjs/feathers";
import FeathersAuth from "@feathersjs/authentication-client";
import FeathersSocketIOClient from "@feathersjs/socketio-client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import io from "socket.io-client";

export const host = new URL(window.location.origin);
host.protocol = process.env["REACT_APP_SERVER_PROTOCOL"] || "http";
host.hostname = process.env["REACT_APP_SERVER_HOST"];
host.port = process.env["REACT_APP_SERVER_PORT"];

const socket = io(host.toString());

const feathers = Feathers();
feathers.configure(FeathersSocketIOClient(socket));
feathers.configure(
  FeathersAuth({
    storageKey: "accessToken",
  })
);

export const ClientContext = createContext(null);

export const ClientProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const role = useMemo(() => {
    if (account === null) return null;
    return account.type;
  }, [account]);

  useEffect(() => {
    const listener = [
      () => {
        setIsConnected(true);
      },
      () => {
        setIsConnected(false);
      },
    ];
    socket.on("connect", listener[0]);
    socket.on("disconnect", listener[1]);
    return () => {
      socket.off("connect", listener[0]);
      socket.off("disconnect", listener[1]);
    };
  }, []);

  async function authenticate(data, params) {
    try {
      const res = await feathers.authenticate(data, params);
      const account = res.user;
      setAccount(account);
      setIsAuthenticated(true);
      return res;
    } catch (err) {
      throw new Error(err);
    }
  }

  async function reAuthenticate(force = false) {
    try {
      const res = await feathers.reAuthenticate(force);
      const account = res.user;
      setAccount(account);
      setIsAuthenticated(true);
      return res;
    } catch (err) {
      setIsAuthenticated(false);
      throw new Error(err);
    }
  }

  async function logout() {
    const ret = await feathers.logout();
    await setIsAuthenticated(false);
    return ret;
  }

  const client = useMemo(() => {
    return {
      host,
      feathers,
      account,
      role,

      authenticate,
      logout,
      reAuthenticate,

      isAuthenticated() {
        return isAuthenticated;
      },
      isConnected() {
        return isConnected;
      },
      __connected: isConnected,
      __authenticated: isAuthenticated,

      get: (name) => {
        return feathers.get(name);
      },

      service: feathers.service,

      // Services
      get users() {
        return feathers.service("users");
      },
      get customers() {
        return feathers.service("customers");
      },
      get vendors() {
        return feathers.service("vendors");
      },
      get vouchers() {
        return feathers.service("vouchers");
      },

      get items() {
        return feathers.service("items");
      },
      get categories() {
        return feathers.service("categories");
      },

      get receipts() {
        return feathers.service("receipts");
      },
      get orders() {
        return feathers.service("orders");
      },
    };
  }, [isConnected, isAuthenticated, account, role]);

  return (
    <ClientContext.Provider value={client}>{children}</ClientContext.Provider>
  );
};

export const useClient = () => {
  const client = useContext(ClientContext);
  return client;
};
