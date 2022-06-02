import { Box, Divider, useClient } from "components";
import { ListContextProvider } from "components/common/List";
import { useCallback } from "react";
import { Header } from "./Header";
import { List } from "./List";
import { Toolbar } from "./Toolbar";

export const filterField = ["search"];

export const Vendors = () => {
  const client = useClient();

  const fetch = useCallback(
    async ({ filter, pagination }) => {
      try {
        const query = {
          $limit: pagination.limit,
          $skip: pagination.skip,
          $distinct: true,
          $or: filter["search"]
            ? {
                name: filter["search"]
                  ? {
                      $iLike: `%${filter["search"]}%`,
                    }
                  : undefined,
                address: filter["search"]
                  ? {
                      $iLike: `%${filter["search"]}%`,
                    }
                  : undefined,
                phone_number: filter["search"]
                  ? {
                      $iLike: `%${filter["search"]}%`,
                    }
                  : undefined,
              }
            : undefined,
          $select: ["id", "name", "phone_number", "address"],
          $sort: {
            id: -1,
          },
        };
        const res = await client["vendors"].find({ query });
        return res;
      } catch (err) {
        console.error(err);
        return {};
      }
    },
    [client]
  );

  return (
    <ListContextProvider resource="vendors" queryFn={fetch} limit={25}>
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
