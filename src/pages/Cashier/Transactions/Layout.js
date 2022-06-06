import { Divider, Flex, useList } from "components";
import { useCallback, useState } from "react";
import { List } from "./List";
import { Receipt } from "./Receipt";
import { exportToCSV } from "components/utils/exportToCSV";
import moment from "moment";
import { Topbar } from "./Topbar";

export const Layout = () => {
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
          tax: 0,
        };
        price["subTotal"] = item["receipt_items"].reduce((p, c) => {
          return p + c["price"] * c["quantity"];
        }, 0);
        price["tax"] = item["tax"] * price["subTotal"];
        price["total"] = price["tax"] + price["subTotal"];
        return [
          item["receipt_number"],
          moment(item["created_at"]).format("DD/MM/YYYY HH:mm"),
          price["subTotal"],
          price["tax"],
          price["total"],
        ];
      },
    });
  }, [items]);

  return (
    <Flex sx={{ height: 615 }}>
      <Flex sx={{ flexGrow: 1, flexDirection: "column" }}>
        <Topbar onExport={onExport} />
        <List
          onClick={(item) => {
            setSelected(item);
          }}
        />
      </Flex>
      <Divider />
      <Receipt data={selected} />
    </Flex>
  );
};
