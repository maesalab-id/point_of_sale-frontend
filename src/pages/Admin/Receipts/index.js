import { Box, Divider, useClient } from "components";
import moment from "moment";
import { useCallback } from "react";
import { Header } from "./Header";
import { List } from "./List";
import { Toolbar } from "./Toolbar";
import _get from "lodash.get";
import { ListContextProvider } from "components/common/List";

export const filterField = ["receipt_number", "start", "end"];

export const Receipts = () => {
  const client = useClient();

  const fetchList = useCallback(
    async ({ limit = 25, skip = 0, filter }) => {
      const startDate = moment(_get(filter, "start"), "DD-MM-YYYY");
      const endDate = moment(_get(filter, "end"), "DD-MM-YYYY");
      const query = {
        $distinct: true,
        $limit: limit,
        $skip: skip,
        receipt_number: _get(filter, "receipt_number") || undefined,
        created_at:
          startDate.isValid() && endDate.isValid()
            ? {
                $gte: startDate.isValid()
                  ? startDate.startOf("day").toISOString()
                  : undefined,
                $lte: endDate.isValid()
                  ? endDate.endOf("day").toISOString()
                  : undefined,
              }
            : undefined,
        $select: ["id", "receipt_number", "tax", "created_at"],
        $sort: {
          id: -1,
        },
        $include: [
          {
            model: "receipt_items",
            $select: ["price", "quantity"],
          },
        ],
      };
      const res = await client["receipts"].find({ query });
      const data = res.data.map((item) => {
        let tax = item["tax"];
        let quantity = 0;
        let price = _get(item, "receipt_items").reduce((p, c) => {
          quantity += c.quantity;
          return p + parseInt(c.price) * c.quantity;
        }, 0);
        tax = price * tax;
        let total = price + tax;
        return {
          ...item,
          total,
          price,
          quantity,
        };
      });
      return {
        total: res.total,
        limit: res.limit,
        skip: res.skip,
        data,
      };
    },
    [client]
  );

  const fetch = useCallback(
    async ({ filter, pagination }) => {
      try {
        const res = await fetchList({
          limit: pagination.limit,
          skip: pagination.skip,
          filter,
        });
        return res;
      } catch (err) {
        console.error(err);
        return {};
      }
    },
    [fetchList]
  );

  return (
    <ListContextProvider resource="receipts" queryFn={fetch} limit={25}>
      <Box>
        <Box sx={{ pt: 4 }}>
          <Header />
        </Box>
        <Divider />
        <Box sx={{ mt: 3, px: 3, mb: 3 }}>
          <Toolbar />
        </Box>
        <Box sx={{ mb: 4 }}>
          <List />
        </Box>
      </Box>
    </ListContextProvider>
  );
};
