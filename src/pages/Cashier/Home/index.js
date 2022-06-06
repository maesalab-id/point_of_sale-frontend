import { Layout } from "./Layout";
import { ListContextProvider } from "components/common/List";
import { useClient } from "components";
import { useCallback } from "react";

export const filterField = ["name", "category_id"];

export const Home = () => {
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
                name: filter["name"]
                  ? {
                      $iLike: `%${filter["name"]}%`,
                    }
                  : undefined,
                code: filter["name"]
                  ? {
                      $iLike: `%${filter["name"]}%`,
                    }
                  : undefined,
              }
            : undefined,
          $select: ["id", "name", "discount", "code", "price", "quantity"],
          $sort: {
            id: 1,
          },
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
    <ListContextProvider
      resource="cashier-items"
      filterDefaultValues={{
        category_id: "",
      }}
      queryFn={fetch}
      limit={9}
      debounce={250}
    >
      <Layout />
    </ListContextProvider>
  );
};
