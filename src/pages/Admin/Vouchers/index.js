import { Box, Divider, useClient } from "components";
import { ListContextProvider } from "components/common/List";
import { useCallback } from "react";
import { Header } from "./Header";
import { List } from "./List";
import { Toolbar } from "./Toolbar";

export const filterField = ["name"];

export const Vouchers = () => {
  const client = useClient();

  const fetch = useCallback(
    async ({ filter, pagination }) => {
      try {
        const query = {
          $distinct: true,
          $limit: pagination.limit,
          $or: filter["name"]
            ? {
                name: filter["name"]
                  ? {
                      $iLike: `%${filter["name"]}%`,
                    }
                  : undefined,
              }
            : undefined,
          $select: ["id", "name", "value", "start", "end"],
          $skip: pagination.skip,
          $sort: {
            id: -1,
          },
        };
        const res = await client["vouchers"].find({ query });
        return res;
      } catch (err) {
        console.error(err);
        return {};
      }
    },
    [client]
  );

  return (
    <ListContextProvider resource="users" queryFn={fetch} limit={10}>
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
