import { Button, Tag } from "@blueprintjs/core";
import { Box, Flex } from "components";
import { CURRENCY_OPTIONS } from "components/constants";
import currency from "currency.js";
import { useMemo } from "react";
import _get from "lodash.get";

export const CartItem = ({
  data: item,
  onAdd,
  onRemove
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
            {item["name"]}
          </Box>
          {_get(item, "discount") &&
            <Tag intent="warning">-{_get(item, "discount")}%</Tag>}
        </Flex>
        <Box sx={{ fontWeight: "bold" }}>{currency(_get(extras, "price_discounted"), CURRENCY_OPTIONS).format()}</Box>
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
  )
}