import { NonIdealState, Spinner } from "@blueprintjs/core";
import { Box, Flex, Pagination, useClient, useList } from "components";
import { useEffect } from "react";
import { Item } from "./Item";

export const List = ({
  onAdd = () => { }
}) => {
  const client = useClient();
  const { filter, items, setItems, paging, setPaging } = useList();
  useEffect(() => {
    const fetch = async () => {
      setItems(null);
      try {
        const query = {
          $limit: 25,
          "category_id": filter["category_id"] || undefined,
          $or: filter["name"] ? {
            "name": filter["name"] ? {
              $iLike: `%${filter["name"]}%`
            } : undefined,
            "code": filter["name"] ? {
              $iLike: `%${filter["name"]}%`
            } : undefined,
          } : undefined,
          $select: ["id", "name", "code", "price", "quantity"],
          $skip: paging.skip,
          $sort: {
            id: 1
          },
        };
        const res = await client["items"].find({ query });
        setItems(res.data);
        setPaging({
          total: res.total,
          limit: res.limit,
          skip: res.skip
        });
      } catch (err) {
        console.error(err);
        setItems([]);
      }
    }
    fetch();
  }, [client, filter, paging.skip, setItems, setPaging]);
  return (
    <>
      <Flex sx={{ flexGrow: 1, flexWrap: "wrap", px: 2, mb: 2 }}>
        {items === null &&
          <Box sx={{ flexGrow: 1, height: "100%" }}>
            <Spinner />
          </Box>}
        {items && (items.length === 0) &&
          <NonIdealState
            title="No Items"
          />}
        {items && items.map((item, i) => (
          <Box
            key={i}
            sx={{
              px: 2, py: 2,
              width: `${100 / 3}%`
            }}
          >
            <Item
              data={item}
              onClick={() => {
                onAdd(item);
              }}
            />
          </Box>))}
      </Flex>
      <Box sx={{ mb: 3 }}>
        <Pagination
          loading={items === null}
          total={paging.total}
          limit={paging.limit}
          skip={paging.skip}
          onClick={({ page, skip }) => {
            setPaging(paging => ({ ...paging, skip: skip }));
          }}
        />
      </Box>
    </>
  )
}