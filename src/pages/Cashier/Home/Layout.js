import { Divider, Flex } from "components";
import { Cart } from "./Cart";
import { Toolbar } from "./Toolbar";
import { List } from "./List";
import { useReducer } from "react";
import { useListContext } from "components/common/List";
import { Topbar } from "./Topbar";

const reducerCart = (state, action) => {
  let index;
  switch (action["type"]) {
    case "add":
      index = state.findIndex((item) => item["id"] === action.data["id"]);
      if (index === -1) {
        state.push({
          ...action["data"],
          count: 0,
        });
      }
      return state.map((item) => {
        if (item["id"] !== action.data["id"]) return item;
        let count = item["count"];
        if (count < item["quantity"]) {
          count = item["count"] + 1;
        }
        return {
          ...item,
          count,
        };
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
            count: item["count"] - 1,
          };
        });
      } else {
        return state.filter((item) => item["id"] !== action.data["id"]);
      }
    case "clear":
      return [];
    default:
      return state;
  }
};

export const Layout = () => {
  const { items, resetFilters } = useListContext();
  const [cart, dispatchCart] = useReducer(reducerCart, []);
  return (
    <Flex sx={{ height: 615 }}>
      <Flex sx={{ flexGrow: 1, flexDirection: "column" }}>
        <Topbar />
        <Toolbar />
        <List
          items={items}
          onAdd={(item) => {
            dispatchCart({
              type: "add",
              data: item,
            });
          }}
        />
      </Flex>
      <Divider />
      <Cart
        cart={cart}
        onSubmitted={() => {
          resetFilters();
        }}
        onClear={() => {
          dispatchCart({
            type: "clear",
          });
        }}
        onAdd={(item) => {
          dispatchCart({
            type: "add",
            data: item,
          });
        }}
        onRemove={(item) => {
          dispatchCart({
            type: "remove",
            data: item,
          });
        }}
      />
    </Flex>
  );
};
