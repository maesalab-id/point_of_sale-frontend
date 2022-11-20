import { Box, Divider, useClient } from "components";
import { ListContextProvider } from "components/common/List";
import { useCallback } from "react";
import { Header } from "./Header";
import { List } from "./List";
import { Toolbar } from "./Toolbar";

export const filterField = ["name", "category_id"];

export const Products = () => {
  const client = useClient();

  const fetch = useCallback(
    async ({ filter, pagination }) => {
      try {
        const query = {
          $distinct: true,
          $limit: pagination.limit,
          $skip: pagination.skip,
          category_id: filter["category_id"] || undefined,
          $or: filter["name"]
            ? {
                name: {
                  $iLike: `%${filter["name"]}%`,
                },
                code: {
                  $iLike: `%${filter["name"]}%`,
                },
              }
            : undefined,
          $select: ["id", "name", "discount", "code", "price", "quantity", "bad_quantity"],
          $sort: {
            id: -1,
          },
          $include: [
            {
              model: "categories",
              $select: ["id", "name"],
            },
          ],
        };
        const res = await client["items"].find({ query });
        return res;
      } catch (err) {
        console.error(err);
        return {};
      }
    },
    [client]
  );

  return (
    <ListContextProvider resource="products" queryFn={fetch} limit={10}>
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
