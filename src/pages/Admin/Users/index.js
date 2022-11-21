import { Box, Divider, useClient } from "components";
import { ListContextProvider } from "components/common/List";
import { isDev } from "components/constants";
import { useCallback } from "react";
import { Header } from "./Header";
import { List } from "./List";
import { Toolbar } from "./Toolbar";

export const filterField = ["type", "username"];

export const Users = () => {
  const client = useClient();

  const fetch = useCallback(
    async ({ filter, pagination }) => {
      try {
        const query = {
          $distinct: true,
          type: filter["type"] || undefined,
          name: filter["username"]
            ? {
                [isDev ? "$iLike" : "$like"]: `%${filter["username"]}%`,
              }
            : undefined,
          $select: ["id", "name", "username", "type"],
          $skip: pagination.skip,
          $sort: {
            id: -1,
          },
          $limit: pagination.limit,
        };
        const res = await client["users"].find({ query });
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
