import { Box, Divider, useClient } from "components";
import { ListContextProvider } from "components/common/List";
import { isDev } from "components/constants";
import { useCallback } from "react";
import { Header } from "./Header";
import { List } from "./List";
import { Toolbar } from "./Toolbar";

export const filterField = ["search"];

export const Customers = () => {
  const client = useClient();

  const fetch = useCallback(
    async ({ filter, pagination }) => {
      try {
        const query = {
          $distinct: true,
          $limit: pagination.limit,
          $or: filter["search"]
            ? {
                name: filter["search"]
                  ? {
                      [isDev ? "$iLike" : "$like"]: `%${filter["search"]}%`,
                    }
                  : undefined,
                address: filter["search"]
                  ? {
                      [isDev ? "$iLike" : "$like"]: `%${filter["search"]}%`,
                    }
                  : undefined,
                phone_number: filter["search"]
                  ? {
                      [isDev ? "$iLike" : "$like"]: `%${filter["search"]}%`,
                    }
                  : undefined,
              }
            : undefined,
          $select: ["id", "name", "phone_number", "address"],
          $skip: pagination.skip,
          $sort: {
            id: -1,
          },
        };
        const res = await client["customers"].find({ query });
        return res;
      } catch (err) {
        console.error(err);
        return {};
      }
    },
    [client]
  );

  return (
    <ListContextProvider resource="customers" queryFn={fetch} limit={10}>
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
