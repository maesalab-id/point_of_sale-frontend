import { Button, Classes, Text } from "@blueprintjs/core";
import { Box, Divider, Flex, useClient } from "components";
import { toaster } from "components/toaster";
import { useCallback, useMemo, useRef, useState } from "react";
import currency from "currency.js";
import _get from "lodash.get";
import { DialogCheckout } from "./Dialog.Checkout";
import { CURRENCY_OPTIONS } from "components/constants";
import { Print } from "../Transactions/Print";
import { useReactToPrint } from "react-to-print";

export const Cart = ({
  cart,
  onAdd = () => { },
  onRemove = () => { },
  onClear = () => { },
  onSubmitted = () => { }
}) => {
  const client = useClient();
  const printArea = useRef(null);

  const [submitted, setSubmitted] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(null);

  const price = useMemo(() => {
    let total = 0;
    let subtotal = 0;
    let tax = 10;
    subtotal = cart.reduce((p, { price, count }) => {
      return p + (price * count);
    }, 0);
    tax = (10 * subtotal) / 100;
    total = subtotal + tax;
    return {
      total,
      subtotal,
      tax,
    }
  }, [cart]);

  const handlePrint = useReactToPrint({
    content: () => printArea.current,
    documentTitle: `Print receipt`,
    removeAfterPrint: true,
    onAfterPrint: () => {
      setSubmitted(null);
    }
  });

  const onSubmit = useCallback(async (values) => {
    const toast = toaster.show({
      intent: "none",
      message: "Checking out"
    });
    try {
      const res = await client["receipts"].create(values);
      toaster.dismiss(toast);
      toaster.show({
        intent: "success",
        message: `Successfull Check out #${res["receipt_number"]}`
      });

      onClear();
      onSubmitted(res);
      return res;
    } catch (err) {
      console.error(err);
      toaster.dismiss(toast);
      toaster.show({
        intent: "danger",
        message: err.message
      });
    }
    return null;
  }, [client, cart]);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Flex sx={{ backgroundColor: "gray.1", flexDirection: "column", flexShrink: 0, width: "30%" }}>
      <Flex sx={{ py: 3, px: 3, alignItems: "center" }}>
        <Box sx={{ flexGrow: 1, fontWeight: "bold" }}>
          <Text>Current Order</Text>
        </Box>
        <Box>
          <Button
            intent="danger"
            outlined={true}
            text="Clear All"
            onClick={() => {
              onClear();
            }}
          />
        </Box>
      </Flex>
      <Box sx={{ flexGrow: 1, overflowX: "hidden" }}>
        {cart.map((item, i) => (
          <Flex key={i} sx={{ py: 2, px: 3, alignItems: "center" }}>
            <Box sx={{ mr: 2, flexGrow: 1 }}>
              <Box>
                {item["name"]}
              </Box>
              <Box sx={{ fontWeight: "bold" }}>{currency(item["price"], { symbol: "Rp. ", precision: 0 }).format()}</Box>
            </Box>
            <Flex sx={{ alignItems: "center", mr: 2 }}>
              <Button
                small={true}
                icon={item["count"] > 1 ? "minus" : "trash"}
                onClick={() => {
                  onRemove(item);
                }} />
              <Box sx={{ width: "30px", textAlign: "center", p: 1 }}>{item["count"]}</Box>
              <Button
                disabled={item.count >= item.quantity}
                small={true}
                icon="plus"
                onClick={() => {
                  onAdd(item);
                }}
              />
            </Flex>
          </Flex>
        ))}
      </Box>
      <Box sx={{ px: 3, pt: 2 }}>
        <Box className={Classes.CARD} sx={{ px: 0, py: 2, mb: 3, }}>
          <Flex sx={{ px: 2, mb: 2 }}>
            <Box sx={{ flexGrow: 1 }}>Subtotal</Box>
            <Box>{currency(price["subtotal"], CURRENCY_OPTIONS).format()}</Box>
          </Flex>
          <Flex sx={{ px: 2 }}>
            <Box sx={{ flexGrow: 1 }}>Tax (10%)</Box>
            <Box>{currency(price["tax"], CURRENCY_OPTIONS).format()}</Box>
          </Flex>
          <Divider />
          <Flex sx={{ px: 2, fontSize: 2, fontWeight: "bold" }}>
            <Box sx={{ flexGrow: 1 }}>Total</Box>
            <Box>{currency(price["total"], CURRENCY_OPTIONS).format()}</Box>
          </Flex>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Button
            disabled={cart.length === 0}
            large={true}
            fill={true}
            intent="primary"
            text="Checkout"
            onClick={() => {
              setDialogOpen("checkout");
            }}
          />
          <DialogCheckout
            isOpen={dialogOpen === "checkout"}
            price={price}
            onClose={() => {
              setDialogOpen(null);
            }}
            onSubmitted={async (values) => {
              await onSubmit(values);
            }}
            initialValue={{
              items: cart.map((item) => {
                return {
                  item_id: item["id"],
                  quantity: item["count"],
                  price: item["price"]
                }
              })
            }}
          />
        </Box>
        <Box sx={{ mb: 4 }}>
          <Button
            outlined={true}
            disabled={cart.length === 0}
            small={true}
            fill={true}
            intent="primary"
            text="Checkout and Print Invoice"
            onClick={() => {
              setDialogOpen("checkout-print");
            }}
          />
          <DialogCheckout
            isOpen={dialogOpen === "checkout-print"}
            price={price}
            onClose={() => {
              setDialogOpen(null);
            }}
            onSubmitted={async (values) => {
              const res = await onSubmit(values);
              await setSubmitted({
                ...res,
                meta: price,
                items: cart.map((item) => {
                  return {
                    name: item["name"],
                    item_id: item["id"],
                    quantity: item["count"],
                    price: item["price"]
                  }
                })
              });
              await handlePrint();
            }}
            initialValue={{
              items: cart.map((item) => {
                return {
                  item_id: item["id"],
                  quantity: item["count"],
                  price: item["price"]
                }
              })
            }}
          />
        </Box>
        <Print
          ref={printArea}
          company_name="Sample Company Ltd"
          company_address="35 Kingsland Road London AK E2 8AA"
          receipt_no={_get(submitted, "receipt_number")}
          items={_get(submitted, "items") && _get(submitted, "items").map((item) => ({
            ...item,
            item: {
              name: item["name"]
            }
          }))}
          date={_get(submitted, "created_at")}
          subtotal={_get(submitted, "meta.subtotal")}
          tax={_get(submitted, "meta.tax")}
          total={_get(submitted, "meta.total")}
        />
      </Box>
    </Flex>
  )
}