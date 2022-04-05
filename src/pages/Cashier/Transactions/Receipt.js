import { Button, Classes, NonIdealState, Spinner, Tag, Text } from "@blueprintjs/core";
import { Box, Divider, Flex, useClient } from "components"
import { toaster } from "components/toaster";
import { useEffect, useMemo, useRef, useState } from "react";
import _get from "lodash.get";
import currency from "currency.js";
import { Print } from "./Print";
import { useReactToPrint } from "react-to-print";
import { ReceiptItem } from "./Receipt.Item";

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
    let discount = 0;
    let voucher = 0;
    let subtotal_discounted = 0;
    if (data) {

      price = _get(data, "receipt_items").reduce((p, c) => {
        const price = parseInt(c.price);
        const discount_price = (price * (c.discount / 100) || 0);
        const price_discounted = price - discount_price;
        quantity += c.quantity;
        return p + (price_discounted * c.quantity);
      }, 0);
      voucher = (_get(data, "voucher.value") || 0) / 100;
      discount = voucher * price;
      subtotal_discounted = price - discount;
      tax = subtotal_discounted * data["tax"];
    }

    let total = subtotal_discounted + tax;

    return {
      tax,
      total,
      quantity,
      price,
      subtotal_discounted,
      discount,
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
              $select: ["id", "price", "quantity", "discount"],
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
    <Flex sx={{ backgroundColor: "gray.1", flexDirection: "column", flexShrink: 0, width: "35%" }}>
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
            <ReceiptItem key={i} data={item} />
          ))}
        </Box>
        <Box sx={{ px: 3, pt: 2 }}>
          <Box className={Classes.CARD} sx={{ px: 0, py: 2, mb: 3, }}>
            <Flex sx={{ px: 2, mb: 2 }}>
              <Box sx={{ flexGrow: 1 }}>Subtotal</Box>
              <Box>{currency(_get(meta, "price"), { symbol: "Rp. ", precision: 0 }).format()}</Box>
            </Flex>
            {_get(data, "voucher") &&
              <Flex sx={{ px: 2, mb: 2 }}>
                <Box sx={{ flexGrow: 1 }}>Voucher (-{_get(data, "voucher.value")}%)</Box>
                <Flex>
                  <Tag>{currency(_get(meta, "discount") * -1, { symbol: "Rp. ", precision: 0 }).format()}</Tag>
                  <Box sx={{ ml: 1 }}>
                    {currency(_get(meta, "subtotal_discounted"), { symbol: "Rp. ", precision: 0 }).format()}
                  </Box>
                </Flex>
              </Flex>}
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