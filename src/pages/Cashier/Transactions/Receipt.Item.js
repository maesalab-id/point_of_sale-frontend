import { Tag } from "@blueprintjs/core";
import { Box, Flex } from "components";
import { CURRENCY_OPTIONS } from "components/constants";
import currency from "currency.js";
import { useMemo } from "react";
import _get from "lodash.get";

export const ReceiptItem = ({
  data: item,
}) => {

  const extras = useMemo(() => {
    const discount_price = (item.price * (item.discount / 100) || 0);
    const price_discounted = item.price - discount_price;
    return {
      discount_price,
      price_discounted
    }
  }, [item.discount, item.price]);

  return (
    <Flex sx={{ py: 2, px: 3, alignItems: "center" }}>
      <Box sx={{ mr: 2, flexGrow: 1 }}>
        <Flex sx={{ alignItems: "center" }}>
          <Box sx={{ mr: 1 }}>
            {_get(item, "item.name")}
          </Box>
          {_get(item, "discount") &&
            <Tag intent="warning">-{_get(item, "discount")}%</Tag>}
        </Flex>
        <Box sx={{ fontWeight: "bold" }}>{currency(_get(extras, "price_discounted"), CURRENCY_OPTIONS).format()}</Box>
      </Box>
      <Flex sx={{ alignItems: "center", mr: 2 }}>
        <Box sx={{ width: "30px", whiteSpace: "nowrap", textAlign: "right", p: 1 }}>x {_get(item, "quantity")}</Box>
      </Flex>
    </Flex>
  )
}