import { Box, useClient } from "components";
import { Admin } from "./Admin";
import { Cashier } from "./Cashier";
import { Inventory } from "./Inventory";
import _get from "lodash.get";

export const Root = (props) => {
  const client = useClient();
  const type = _get(client, "account.type");
  switch (type) {
    case "administrator":
      return (<Admin {...props} />);
    case "cashier":
      return (<Cashier {...props} />);
    case "inventory":
      return (<Inventory {...props} />);
    default: return (
      <Box> Loading </Box>
    );
  }
}