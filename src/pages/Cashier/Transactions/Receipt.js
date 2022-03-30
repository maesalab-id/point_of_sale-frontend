import { Button, Classes, NonIdealState, Spinner, Text } from "@blueprintjs/core";
import { Box, Divider, Flex, useClient } from "components"
import { toaster } from "components/toaster";
import { useEffect, useMemo, useRef, useState } from "react";
import _get from "lodash.get";
import currency from "currency.js";
import { Print } from "./Print";
import { useReactToPrint } from "react-to-print";

export const Receipt = ({
  data
}) => {
  const client = useClient();
  const [items, setItems] = useState(null);
  const printArea = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printArea.current,
    documentTitle: `Print receipt`,
    removeAfterPrint: true,
  });

  const meta = useMemo(() => {
    let quantity = 0;
    let price = 0;
    let tax = 0;
    if (data) {
      price = _get(data, "receipt_items").reduce((p, c) => {
        quantity += c.quantity;
        return p + (parseInt(c.price) * c.quantity);
      }, 0);
      tax = price * data["tax"];
    }
    let total = price + tax;

    return {
      tax,
      total,
      quantity,
      price
    }
  }, [data]);

  useEffect(() => {
    if (!data) return;
    const fetch = async () => {
      setItems(null);
      try {
        const res = await client["receipts"].get(data["id"], {
          query: {
            $include: [{
              model: "receipt_items",
              $select: ["id", "price", "quantity"],
              $include: [{
                model: "items",
                $select: ["id", "name", "code"]
              }]
            }]
          }
        });
        setItems(_get(res, "receipt_items"));
      } catch (err) {
        console.error(err);
        toaster.show({
          intent: "error",
          message: err.message
        })
      }
    }
    fetch();
  }, [client, data]);

  return (
    <Flex sx={{ backgroundColor: "gray.1", flexDirection: "column", flexShrink: 0, width: "30%" }}>
      {!data && <NonIdealState
        title="Select receipt"
      />}
      {data && <>
        <Flex sx={{ py: 3, px: 3, alignItems: "center" }}>
          <Box sx={{ flexGrow: 1, fontWeight: "bold" }}>
            <Text>Receipt #{data["id"]}</Text>
          </Box>
        </Flex>
        <Box sx={{ flexGrow: 1, overflowX: "hidden" }}>
          {items && items.length === 0 &&
            <NonIdealState
              title="No Items"
            />}
          {items === null &&
            <Spinner />}
          {items && items.map((item, i) => (
            <Flex key={i} sx={{ py: 2, px: 3, alignItems: "center" }}>
              <Box sx={{ mr: 2, flexGrow: 1 }}>
                <Box>
                  {_get(item, "item.name")}
                </Box>
                <Box sx={{ fontWeight: "bold" }}>{currency(_get(item, "price"), { symbol: "Rp. ", precision: 0 }).format()}</Box>
              </Box>
              <Flex sx={{ alignItems: "center", mr: 2 }}>
                <Box sx={{ width: "30px", whiteSpace: "nowrap", textAlign: "right", p: 1 }}>x {_get(item, "quantity")}</Box>
              </Flex>
            </Flex>
          ))}
        </Box>
        <Box sx={{ px: 3, pt: 2 }}>
          <Box className={Classes.CARD} sx={{ px: 0, py: 2, mb: 3, }}>
            <Flex sx={{ px: 2, mb: 2 }}>
              <Box sx={{ flexGrow: 1 }}>Subtotal</Box>
              <Box>{currency(_get(meta, "price"), { symbol: "Rp. ", precision: 0 }).format()}</Box>
            </Flex>
            <Flex sx={{ px: 2 }}>
              <Box sx={{ flexGrow: 1 }}>Tax (10%)</Box>
              <Box>{currency(_get(meta, "tax"), { symbol: "Rp. ", precision: 0 }).format()}</Box>
            </Flex>
            <Divider />
            <Flex sx={{ px: 2, fontSize: 2, fontWeight: "bold" }}>
              <Box sx={{ flexGrow: 1 }}>Total</Box>
              <Box>{currency(_get(meta, "total"), { symbol: "Rp. ", precision: 0 }).format()}</Box>
            </Flex>
          </Box>
          <Box sx={{ mb: 4 }}>
            <Button
              disabled={items === null}
              outlined={true}
              large={true}
              fill={true}
              intent="primary"
              text="Print Invoice"
              onClick={() => {
                handlePrint();
              }}
            />
            <Print
              ref={printArea}
              company_name="Sample Company Ltd"
              company_address="35 Kingsland Road London AK E2 8AA"
              receipt_no={data["id"]}
              items={items}
              title={`Receipt #${data["id"]}`}
              date={data["created_at"]}
              subtotal={_get(meta, "price")}
              tax={_get(meta, "tax")}
              total={_get(meta, "total")}
            />
          </Box>
        </Box>
      </>}
    </Flex>
  )
}