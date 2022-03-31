import { Button, Text } from "@blueprintjs/core"
import { Box, Divider, Flex, useClient, useList } from "components"
import { useCallback, useState } from "react"
import { List } from "./List"
import { Receipt } from "./Receipt"
import _get from "lodash.get";
import { exportToCSV } from "components/exportToCSV"
import moment from "moment";

export const Layout = () => {
  const client = useClient();
  const [selected, setSelected] = useState();

  const { items } = useList();

  const onExport = useCallback(() => {
    exportToCSV({
      fileName: `[POS] ${moment().format("DD-MM-YYYY")}.csv`,
      header: ["Receipt No.", "Date", "Subtotal", "Tax (10%)", "Total"],
      items,
      parseData(item) {
        const price = {
          total: 0,
          subTotal: 0,
          tax: 0
        }
        price["subTotal"] = item["receipt_items"].reduce((p, c) => {
          return p + (c["price"] * c["quantity"]);
        }, 0);
        price["tax"] = item["tax"] * price["subTotal"];
        price["total"] = price["tax"] + price["subTotal"];
        return [
          item["receipt_number"],
          moment(item["created_at"]).format("DD/MM/YYYY HH:mm"),
          price["subTotal"],
          price["tax"],
          price["total"]
        ]
      }
    });

  }, [items]);

  return (
    <Flex sx={{ height: 615 }}>
      <Flex sx={{ flexGrow: 1, flexDirection: "column" }}>
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
                }} />
            </Box>
          </Flex>
          <Box sx={{ px: 3, flexGrow: 1, textAlign: "right" }}>
            <Box sx={{ fontSize: 0, color: "gray.5" }}>Logged in as</Box>
            <Box>{_get(client, "account.name")}</Box>
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