import { Card } from "@blueprintjs/core";
import { AspectRatio, Box, Flex } from "components";
import currency from "currency.js";

export const Item = ({
  data,
  onClick = () => { }
}) => {
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
            <Box sx={{ flexGrow: 1, color: "gray.5" }}>
              {data["quantity"]} unit left
            </Box>
            <Box sx={{
              fontSize: 3,
              fontWeight: "bold"
            }}>
              {currency(data["price"], { symbol: "Rp. ", precision: 0 }).format()}
            </Box>
          </Flex>
        </Box>
      </AspectRatio>
    </Card>
  )
}