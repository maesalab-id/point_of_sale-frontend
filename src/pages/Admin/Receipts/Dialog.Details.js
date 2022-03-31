import { Button, Classes, Dialog, FormGroup, InputGroup, Spinner } from "@blueprintjs/core";
import { Box, Divider, Flex, useClient } from "components";
import { toaster } from "components/toaster";
import { useEffect, useMemo, useState } from "react";
import _get from "lodash.get";
import currency from "currency.js";
import { CURRENCY_OPTIONS } from "components/constants";
import moment from "moment";

export const DialogDetails = ({
  id,
  isOpen,
  onClose = () => { }
}) => {
  const client = useClient();

  const [receipt, setReceipt] = useState(null);

  const price = useMemo(() => {
    let total = 0;
    let subtotal = 0;
    let tax = 0;

    if (receipt === null) return {
      total,
      subtotal,
      tax,
    }
    subtotal = _get(receipt, "receipt_items").reduce((p, { price, quantity }) => {
      return p + (price * quantity);
    }, 0);
    tax = _get(receipt, "tax") * subtotal;
    total = subtotal + tax;
    return {
      total,
      subtotal,
      tax,
    }
  }, [receipt]);

  useEffect(() => {
    if (!isOpen) return;
    const fetch = async () => {
      try {
        const res = await client["receipts"].get(id, {
          query: {
            $select: ["receipt_number", "tax", "vendor", "receipt_items", "customer", "customer_id", "created_at"],
            $include: [{
              model: "receipt_items",
              $select: ["price", "quantity"],
              $include: [{
                model: "items",
                $select: ["name", "code"]
              }]
            }, {
              model: "customers",
              $select: ["name", "phone_number"]
            }]
          }
        });
        console.log(res);
        setReceipt(res);
      } catch (err) {
        console.error(err);
        toaster.show({
          intent: "danger",
          message: err.message
        })
      }
    }
    fetch();
  }, [id, isOpen]);

  return (
    <Dialog
      enforceFocus={false}
      isOpen={isOpen}
      onClose={() => { onClose() }}
      title={receipt ? `Detail Receipt #${_get(receipt, "receipt_number")}` : "Loading"}
    >
      <div className={Classes.DIALOG_BODY}>
        {receipt === null &&
          <Spinner />}
        {receipt &&
          <>
            <Box sx={{ mb: 3 }}>
              <Flex>
                <Box sx={{ flexGrow: 1 }}>Date:</Box><Box>{moment(_get(receipt, "created_at")).format("LLLL")}</Box>
              </Flex>
              {_get(receipt, "customer") &&
                <Flex sx={{ mt: 2 }}>
                  <Box sx={{ flexGrow: 1 }}>Customer:</Box>
                  <Box  sx={{ textAlign: "right" }}>
                    <Box>{_get(receipt, "customer.name")}</Box>
                    <Box sx={{ color: "gray.5" }}>{_get(receipt, "customer.phone_number")}</Box>
                  </Box>
                </Flex>}
            </Box>
            <Box>
              <Box className={Classes.CARD} sx={{ px: 0, py: 2 }}>
                <Box></Box>
                <Box>
                  {_get(receipt, "receipt_items").map((item) => (
                    <Flex sx={{ px: 2, mb: 2 }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ mr: 2 }}>{_get(item, "item.name")}</Box>
                        <Box sx={{ fontSize: 0, color: "gray.5" }}>{_get(item, "item.code")}</Box>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Flex sx={{ fontSize: 0, color: "gray.5" }}>
                          <Box sx={{ whiteSpace: "nowrap", mr: 2 }}>{currency(_get(item, "price"), CURRENCY_OPTIONS).format()}</Box>
                          <Box sx={{ whiteSpace: "nowrap" }}>x {_get(item, "quantity")}</Box>
                        </Flex>
                        <Box sx={{ whiteSpace: "nowrap", textAlign: "right" }}>{currency(_get(item, "price") * _get(item, "quantity"), CURRENCY_OPTIONS).format()}</Box>
                      </Box>
                    </Flex>
                  ))}
                </Box>
                <Divider />
                <Flex sx={{ px: 2, mb: 2 }}>
                  <Box sx={{ flexGrow: 1 }}>Subtotal</Box>
                  <Box>{currency(price["subtotal"], CURRENCY_OPTIONS).format()}</Box>
                </Flex>
                <Flex sx={{ px: 2 }}>
                  <Box sx={{ flexGrow: 1 }}>Tax ({_get(receipt, "tax") * 100}%)</Box>
                  <Box>{currency(price["tax"], CURRENCY_OPTIONS).format()}</Box>
                </Flex>
                <Divider />
                <Flex sx={{ px: 2, fontSize: 2, fontWeight: "bold" }}>
                  <Box sx={{ flexGrow: 1 }}>Total</Box>
                  <Box>{currency(price["total"], CURRENCY_OPTIONS).format()}</Box>
                </Flex>
              </Box>
            </Box>
          </>
        }
      </div>
    </Dialog>
  )
}