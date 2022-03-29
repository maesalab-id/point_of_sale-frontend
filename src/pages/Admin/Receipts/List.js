import { Checkbox, Classes, NonIdealState, Spinner } from "@blueprintjs/core";
import { Box, Container, Flex, ListGroup, useClient, useList } from "components";
import { Pagination } from "components/Pagination";
import { useEffect } from "react";
import _get from "lodash.get";
import currency from "currency.js";

const List = () => {
  const client = useClient();
  const { filter, items, setItems, status, paging, setPaging, selectedItem, dispatchSelectedItem } = useList();

  useEffect(() => {
    const fetch = async () => {
      setItems(null);
      try {
        const query = {
          $distinct: true,
          $limit: 25,
          "receipt_number": filter["receipt_number"] || undefined,
          $select: ["id", "receipt_number", "tax"],
          $skip: paging.skip,
          $sort: {
            id: -1
          },
          $include: [{
            model: "receipt_items",
            $select: ["price", "quantity"],
          }]
        };
        const res = await client["receipts"].find({ query });
        setItems(res.data.map((item) => {
          let tax = item["tax"];
          let quantity = 0;
          let price = _get(item, "receipt_items").reduce((p, c) => {
            quantity += c.quantity;
            return p + (parseInt(c.price) * c.quantity);
          }, 0);
          tax = price * tax;
          let total = price + tax;
          return {
            ...item,
            total,
            price,
            quantity,
          }
        }));
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
    <Container sx={{ px: 3 }}>
      <ListGroup
        sx={{
          [`.${Classes.CHECKBOX}`]: {
            m: 0
          }
        }}
      >
        <ListGroup.Header>
          <Flex sx={{ alignItems: "center" }}>
            <Box>
              <Checkbox
                disabled={status.disabled}
                checked={status.checked}
                indeterminate={status.indeterminate}
                onChange={(e) => {
                  dispatchSelectedItem({
                    type: "all",
                    data: e.target.checked
                  })
                }}
              />
            </Box>
            {selectedItem.length > 0 &&
              <Box sx={{ ml: 2 }}>
                {selectedItem.length} selected
              </Box>
            }
          </Flex>
        </ListGroup.Header>
        {items === null &&
          <Box sx={{ p: 2 }}>
            <Spinner size={50} />
          </Box>
        }
        {items && items.length === 0 && (
          <Box sx={{ my: 3 }}>
            <NonIdealState
              title="No user available"
            />
          </Box>
        )}
        {items && items.map((item) => (
          <ListGroup.Item
            key={item["id"]}
            sx={{
              "& .action-button": {
                opacity: 0
              },
              "&:hover .action-button": {
                opacity: 1
              }
            }}
          >
            <Flex>
              <Box sx={{ width: 40, flexShrink: 0 }}>
                <Checkbox
                  checked={selectedItem.indexOf(item["id"]) !== -1}
                  onChange={(e) => {
                    dispatchSelectedItem({
                      type: "toggle",
                      data: {
                        name: item["id"],
                        value: e.target.checked
                      }
                    })
                  }}
                />
              </Box>
              {[{
                label: "Order Number",
                value: `#${_get(item, "receipt_number")}`,
              }, {
                label: "Subtotal",
                value: `${currency(_get(item, "price"), { symbol: "Rp. ", precision: 0 }).format()}`,
              }, {
                label: "Total Price + 10% tax",
                value: `${currency(_get(item, "total"), { symbol: "Rp. ", precision: 0 }).format()}`,
              }, {
                label: "Quantity",
                value: `${_get(item, "quantity")}`,
              }].map(({ label, value }) => (
                <Box key={label} sx={{ width: `${100 / 3}%` }}>
                  <Box sx={{ color: "gray.5" }}>
                    {label}
                  </Box>
                  <Box>
                    {value}
                  </Box>
                </Box>
              ))}
            </Flex>
          </ListGroup.Item>))}
      </ListGroup>
      <Pagination
        loading={items === null}
        total={paging.total}
        limit={paging.limit}
        skip={paging.skip}
        onClick={({ page, skip }) => {
          setPaging(paging => ({ ...paging, skip: skip }));
        }}
      />
    </Container >
  )
}

export default List;