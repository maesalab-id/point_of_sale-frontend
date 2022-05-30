import { Box, useClient } from "components";
import { Admin } from "./Admin";
import { Cashier } from "./Cashier";
import { Inventory } from "./Inventory";
import _get from "lodash.get";
import { useTranslation } from "react-i18next";

export const Root = (props) => {
  const { t } = useTranslation();
  const client = useClient();
  const type = _get(client, "account.type");
  switch (type) {
    case "administrator":
      return <Admin {...props} />;
    case "cashier":
      return <Cashier {...props} />;
    case "inventory":
      return <Inventory {...props} />;
    default:
      return <Box>{t("general.loading-message")}</Box>;
  }
};
