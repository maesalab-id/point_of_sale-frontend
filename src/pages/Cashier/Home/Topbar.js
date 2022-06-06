import { Box, Flex, useClient } from "components";
import _get from "lodash.get";
import { VENDOR_INFORMATION } from "components/constants";
import { Text } from "@blueprintjs/core";
import { useTranslation } from "react-i18next";

export const Topbar = () => {
  const client = useClient();
  const { t } = useTranslation("cashier-home-page");

  return (
    <Flex sx={{ py: 3, px: 3, alignItems: "center" }}>
      <Box sx={{ flexGrow: 1, fontWeight: "bold" }}>
        <Text>{VENDOR_INFORMATION.NAME}</Text>
      </Box>
      <Box sx={{ px: 3, flexGrow: 1, textAlign: "right" }}>
        <Box sx={{ fontSize: 0, color: "gray.5" }}>{t("topbar.account")}</Box>
        <Box>{_get(client, "account.name")}</Box>
      </Box>
    </Flex>
  );
};
