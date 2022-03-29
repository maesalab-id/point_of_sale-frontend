import { Button, Text } from "@blueprintjs/core"
import { Box, Divider, Flex, useClient } from "components"
import { useState } from "react"
import { List } from "./List"
import { Receipt } from "./Receipt"
import _get from "lodash.get";

export const Layout = () => {
  const client = useClient();
  const [selected, setSelected] = useState();

  return (
    <Flex sx={{ height: 615 }}>
      <Flex sx={{ flexGrow: 1, flexDirection: "column" }}>
        <Flex sx={{ py: 3, px: 3, alignItems: "center" }}>
          <Box sx={{ flexGrow: 1, fontWeight: "bold" }}>
            <Text>TRANSACTIONS</Text>
          </Box>
          <Box sx={{ px: 3, flexGrow: 1, textAlign: "right" }}>
            <Box sx={{ fontSize: 0, color: "gray.5" }}>Logged in as</Box>
            <Box>{_get(client, "account.name")}</Box>
          </Box>
          <Box>
            <Button outlined={true} icon="info-sign" text="help" />
          </Box>
        </Flex>
        <List onClick={(item) => {
          setSelected(item);
        }} />
      </Flex>
      <Divider />
      <Receipt data={selected} />
    </Flex>
  )
}