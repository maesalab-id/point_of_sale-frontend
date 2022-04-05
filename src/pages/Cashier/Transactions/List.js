import { NonIdealState, Spinner } from "@blueprintjs/core";
import { Box, Flex, Pagination, useClient, useList } from "components";
import { useEffect } from "react";
import { Item } from "./Item";
import moment from "moment";

export const List = ({
  onClick = () => { }
}) => {
  const client = useClient();
  const { filter, items, setItems, paging, setPaging } = useList();
  useEffect(() => {
    const fetch = async () => {
      setItems(null);
      try {
        const query = {
          $distinct: true,
          $limit: 9,
          created_at: {
            $gte: moment().startOf("day").toISOString(),
            $lte: moment().endOf("day").toISOString(),
          },
          $select: ["id", "receipt_number", "tax", "created_at", "voucher_id"],
          $include: [{
            model: "receipt_items",
          }, {
            model: "vouchers",
            $select: ["name", "value"]
          }],
          $skip: paging.skip,
          $sort: {
            id: -1
          },
        };
        const res = await client["receipts"].find({ query });
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
                onClick(item);
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