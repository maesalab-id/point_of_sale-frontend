import { Card } from "@blueprintjs/core";
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
      quantity += c.quantity;
      return p + (parseInt(c.price) * c.quantity);
    }, 0);

    let tax = price * data["tax"];
    let total = price + tax;

    return {
      tax,
      total,
      quantity,
      price
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
          <Box sx={{ flexGrow: 1, color: "gray.5" }}>
            {_get(meta, "quantity")} unit of {_get(data, "receipt_items.length")} item
          </Box>
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