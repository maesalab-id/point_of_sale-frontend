import { Text } from "@blueprintjs/core";
import { Box, Divider, Flex, useClient, useList } from "components";
import { VENDOR_INFORMATION } from "components/constants";
import { Cart } from "./Cart";
import { Toolbar } from "./Toolbar";
import { List } from "./List";
import { useReducer } from "react";
import _get from "lodash.get";

const reducerCart = (state, action) => {
  let index;
  switch (action["type"]) {
    case "add":
      index = state.findIndex((item) => item["id"] === action.data["id"]);
      if (index === -1) {
        state.push({
          ...action["data"],
          count: 0
        })
      }
      return state.map((item) => {
        if (item["id"] !== action.data["id"]) return item;
        let count = item["count"];
        if (count < item["quantity"]) {
          count = item["count"] + 1;
        }
        return {
          ...item,
          count
        }
      });
    case "remove":
      index = state.findIndex((item) => item["id"] === action.data["id"]);
      if (index === -1) {
        return state;
      }
      if (state[index]["count"] > 1) {
        return state.map((item) => {
          if (item["id"] !== action.data["id"]) return item;
          return {
            ...item,
            count: item["count"] - 1
          }
        });
      } else {
        return state.filter((item) => item["id"] !== action.data["id"]);
      }
    case "clear":
      return [];
    default:
      return state;
  }
}

export const Layout = () => {
  const client = useClient();
  const { items, setFilter } = useList();
  const [cart, dispatchCart] = useReducer(reducerCart, []);
  return (
    <Flex sx={{ height: 615 }}>
      <Flex sx={{ flexGrow: 1, flexDirection: "column" }}>
        <Flex sx={{ py: 3, px: 3, alignItems: "center" }}>
          <Box sx={{ flexGrow: 1, fontWeight: "bold" }}>
            <Text>{VENDOR_INFORMATION.NAME}</Text>
          </Box>
          <Box sx={{ px: 3, flexGrow: 1, textAlign: "right" }}>
            <Box sx={{ fontSize: 0, color: "gray.5" }}>Logged in as</Box>
            <Box>{_get(client, "account.name")}</Box>
          </Box>
        </Flex>
        <Toolbar />
        <List
          items={items}
          onAdd={(item) => {
            dispatchCart({
              type: "add",
              data: item
            });
          }}
        />
      </Flex>
      <Divider />
      <Cart
        cart={cart}
        onSubmitted={() => {
          setFilter(f => ({
            category_id: undefined
          }))
        }}
        onClear={() => {
          dispatchCart({
            type: "clear"
          });
        }}
        onAdd={(item) => {
          dispatchCart({
            type: "add",
            data: item
          });
        }}
        onRemove={(item) => {
          dispatchCart({
            type: "remove",
            data: item
          });
        }}
      />
    </Flex>
  )
}