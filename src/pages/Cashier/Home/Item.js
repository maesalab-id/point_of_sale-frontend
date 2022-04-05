import { Card, Tag } from "@blueprintjs/core";
import { AspectRatio, Box, Flex } from "components";
import currency from "currency.js";
import _get from "lodash.get";
import { useMemo } from "react";

export const Item = ({
  data,
  onClick = () => { }
}) => {

  const extras = useMemo(() => {
    const discount_price = (data.price * (data.discount / 100) || 0);
    const price_discounted = data.price - discount_price;
    return {
      discount_price,
      price_discounted
    }
  }, [data.discount, data.price]);

  return (
    <Card
      style={{ padding: 0 }}
      interactive={data["quantity"] > 0 ? true : false}
      onClick={data["quantity"] > 0 ? onClick : () => { }}
    >
      <AspectRatio ratio="4:3">
        <Box sx={{
          px: 2,
          py: 3,
          height: "100%",
          opacity: data["quantity"] > 0 ? 1 : 0.25
        }}>
          <Flex sx={{ flexDirection: "column", flexGrow: 1, height: "100%" }}>
            <Box sx={{
              fontSize: 2,
              fontWeight: "bold"
            }}>
              {data["name"]}
            </Box>
            <Box sx={{ color: "gray.4" }}>
              {data["code"]}
            </Box>
            <Box sx={{ flexGrow: 1, color: "gray.5" }}>
              {data["quantity"]} unit left
            </Box>
            {_get(data, "discount") &&
              <Box sx={{
                fontSize: 0
              }}>
                <strike>
                  {currency(data["price"], { symbol: "Rp. ", precision: 0 }).format()}
                </strike>
              </Box>}
            <Flex>
              <Box sx={{
                mr: 1,
                fontSize: 2,
                fontWeight: "bold"
              }}>
                {currency(_get(extras, "price_discounted"), { symbol: "Rp. ", precision: 0 }).format()}
              </Box>
              {_get(data, "discount") &&
                <Tag intent="warning">-{_get(data, "discount")}%</Tag>}
            </Flex>
          </Flex>
        </Box>
      </AspectRatio>
    </Card>
  )
}