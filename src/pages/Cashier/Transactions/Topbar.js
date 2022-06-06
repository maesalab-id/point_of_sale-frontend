import { Box, Flex, useClient } from "components";
import _get from "lodash.get";
import { Button, Text } from "@blueprintjs/core";
import { useTranslation } from "react-i18next";
import moment from "moment";

export const Topbar = ({ onExport }) => {
  const client = useClient();
  const { t } = useTranslation("cashier-home-page");

  return (
    <Flex sx={{ py: 3, px: 3, alignItems: "center" }}>
      <Flex sx={{ alignItems: "center" }}>
        <Box sx={{ flexGrow: 1, fontWeight: "bold" }}>
          <Text>TRANSACTIONS on {moment().format("DD-MM-YYYY")}</Text>
        </Box>
        <Box sx={{ ml: 3 }}>
          <Button
            outlined={true}
            small={true}
            text="Export to CSV"
            onClick={() => {
              onExport();
            }}
          />
        </Box>
      </Flex>
      <Box sx={{ px: 3, flexGrow: 1, textAlign: "right" }}>
        <Box sx={{ fontSize: 0, color: "gray.5" }}>{t("topbar.account")}</Box>
        <Box>{_get(client, "account.name")}</Box>
      </Box>
    </Flex>
  );
};
