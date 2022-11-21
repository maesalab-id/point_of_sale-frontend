import { Box, Divider, useClient } from "components";
import { ListContextProvider } from "components/common/List";
import moment from "moment";
import { useCallback } from "react";
import { Header } from "./Header";
import { List } from "./List";
import { Toolbar } from "./Toolbar";
import _get from "lodash.get";
import { isNumeric } from "components/utils";

export const filterField = ["order_number", "start", "end", "vendor_id"];

export const Orders = (props) => {
  const { enableAdd } = props;
  const client = useClient();

  const fetch = useCallback(
    async ({ filter, pagination }) => {
      const startDate = moment(filter["start"], "DD-MM-YYYY");
      const endDate = moment(filter["end"], "DD-MM-YYYY");
      try {
        let query = {
          $limit: pagination.limit,
          $skip: pagination.skip,

          $distinct: true,
          vendor_id: filter["vendor_id"] || undefined,
          order_number: isNumeric(filter["order_number"])
            ? filter["order_number"]
            : undefined,
          created_at:
            startDate.isValid() && endDate.isValid()
              ? {
                  $gte: startDate.isValid()
                    ? startDate.toISOString()
                    : undefined,
                  $lte: endDate.isValid() ? endDate.toISOString() : undefined,
                }
              : undefined,
          $select: [
            "id",
            "order_number",
            "tax",
            "vendor_id",
            "received",
            "created_at",
          ],
          $sort: {
            id: -1,
          },
          $include: [
            {
              model: "order_list",
              $select: ["price", "quantity"],
              $include: [
                {
                  model: "items",
                  $select: ["id", "name"],
                },
              ],
            },
            {
              model: "vendors",
              $select: ["name"],
            },
          ],
        };
        // query = _omitBy(query, _isNil);
        const res = await client["orders"].find({ query });
        console.log({ res });
        return {
          ...res,
          data: res.data.map((item) => {
            let quantity = 0;
            let price = _get(item, "order_lists").reduce((p, c) => {
              quantity += c.quantity;
              return p + parseInt(c.price) * c.quantity;
            }, 0);
            return {
              ...item,
              price,
              quantity,
            };
          }),
        };
      } catch (err) {
        console.error(err);
        return {};
      }
    },
    [client]
  );

  return (
    <ListContextProvider resource="orders" queryFn={fetch} limit={10}>
      <Box>
        <Box sx={{ pt: 4 }}>
          <Header />
        </Box>
        <Divider />
        <Box sx={{ mt: 3, px: 3, mb: 3 }}>
          <Toolbar enableAdd={enableAdd} />
        </Box>
        <Box sx={{ mb: 4 }}>
          <List />
        </Box>
      </Box>
    </ListContextProvider>
  );
};
