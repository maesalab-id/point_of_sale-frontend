import { Card, Tag } from "@blueprintjs/core";
import { Box, Divider, Flex } from "components";
import currency from "currency.js";
import { useMemo } from "react";
import _get from "lodash.get";
import moment from "moment";

export const Item = ({
  data,
  onClick = () => { }
}) => {

  const meta = useMemo(() => {
    let quantity = 0;
    let price = _get(data, "receipt_items").reduce((p, c) => {
      const price = parseInt(c.price);
      const discount_price = (price * (c.discount / 100) || 0);
      const price_discounted = price - discount_price;
      quantity += c.quantity;
      return p + (price_discounted * c.quantity);
    }, 0);

    let voucher = (_get(data, "voucher.value") || 0) / 100;
    price = price - (price * voucher);

    let tax = price * data["tax"];
    let total = price + tax;

    return {
      tax,
      total,
      quantity,
      price,
      voucher,
    }
  }, [data]);

  return (
    <Card
      style={{ padding: 0 }}
      interactive={true}
      onClick={onClick}
    >
      {/* <AspectRatio ratio="4:3"> */}
      <Box sx={{ px: 2, py: 3, height: "100%" }}>
        <Flex sx={{ flexDirection: "column", flexGrow: 1, height: "100%" }}>
          <Flex sx={{
            fontSize: 1,
            fontWeight: "bold"
          }}>
            <Box sx={{ flexGrow: 1 }}>
              Receipt
            </Box>
            <Box>
              #{String(_get(data, "receipt_number")).padStart(7, "0")}
            </Box>
          </Flex>
          <Flex sx={{ fontSize: 0 }}>
            <Box sx={{ flexGrow: 1 }}>
              Date
            </Box>
            <Box>
              at {moment(_get(data, "created_at")).format("HH:mm a")}
            </Box>
          </Flex>
          <Flex>
            <Box sx={{ fontSize: 0, flexGrow: 1, color: "gray.5" }}>
              {_get(meta, "quantity")} unit of {_get(data, "receipt_items.length")} item
            </Box>
            {_get(data, "voucher") &&
              <Tag intent="warning">-{_get(data, "voucher.value")}%</Tag>}
          </Flex>

          <Divider />
          <Flex sx={{ fontSize: 0, color: "gray.5" }}>
            <Box sx={{ flexGrow: 1 }}>Subtotal</Box>
            <Box sx={{
              fontWeight: "bold"
            }}>
              {currency(_get(meta, "price"), { symbol: "Rp. ", precision: 0 }).format()}
            </Box>
          </Flex>
          <Flex sx={{ fontSize: 0, color: "gray.5" }}>
            <Box sx={{ flexGrow: 1 }}>Tax (10%)</Box>
            <Box>
              {currency(_get(meta, "tax"), { symbol: "Rp. ", precision: 0 }).format()}
            </Box>
          </Flex>
          <Flex sx={{ fontSize: 1 }}>
            <Box sx={{ flexGrow: 1 }}>Total</Box>
            <Box sx={{
              fontSize: 1,
              fontWeight: "bold"
            }}>
              {currency(_get(meta, "total"), { symbol: "Rp. ", precision: 0 }).format()}
            </Box>
          </Flex>
        </Flex>
      </Box>
      {/* </AspectRatio> */}
    </Card>
  )
}