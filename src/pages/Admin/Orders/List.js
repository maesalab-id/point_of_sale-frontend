import { Button, Checkbox, Classes, NonIdealState, Spinner } from "@blueprintjs/core";
import { Box, Container, Flex, ListGroup, State, useClient, useList } from "components";
import { Pagination } from "components/Pagination";
import { useEffect } from "react";
import _get from "lodash.get";
import currency from "currency.js";
import moment from "moment";
import { DialogDetails } from "./Dialog.Details";
import { CURRENCY_OPTIONS } from "components/constants";

const List = () => {
  const client = useClient();
  const { filter, items, setItems, status, paging, setPaging, selectedItem, dispatchSelectedItem } = useList();

  useEffect(() => {
    const fetch = async () => {
      setItems(null);
      const startDate = moment(filter["start"], "DD-MM-YYYY");
      const endDate = moment(filter["end"], "DD-MM-YYYY");
      try {
        const query = {
          $distinct: true,
          $limit: 25,
          "vendor_id": filter["vendor_id"] || undefined,
          "order_number": filter["order_number"] || undefined,
          "created_at": (startDate.isValid() && endDate.isValid()) ? {
            $gte: startDate.isValid() ? startDate.toISOString() : undefined,
            $lte: endDate.isValid() ? endDate.toISOString() : undefined
          } : undefined,
          $select: ["id", "order_number", "tax", "vendor_id"],
          $skip: paging.skip,
          $sort: {
            id: -1
          },
          $include: [{
            model: "order_list",
            $select: ["price", "quantity"],
            $include: [{
              model: "items",
              $select: ["id"]
            }]
          }, {
            model: "vendors",
            $select: ["name"]
          }]
        };
        const res = await client["orders"].find({ query });
        setItems(res.data.map((item) => {
          let quantity = 0;
          let price = _get(item, "order_lists").reduce((p, c) => {
            quantity += c.quantity;
            return p + (parseInt(c.price) * c.quantity);
          }, 0);
          return {
            ...item,
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
              <Flex sx={{ flexGrow: 1 }}>
                {[{
                  label: "Order Number",
                  value: `#${_get(item, "order_number")}`,
                }, {
                  label: "Total Price",
                  value: `${currency(_get(item, "price"), CURRENCY_OPTIONS).format()}`,
                }, {
                  label: "Quantity",
                  value: `${_get(item, "quantity")} of ${_get(item, "order_lists.length")} item`,
                }, {
                  label: "Date",
                  value: `${moment(_get(item, "created_at")).format("DD/MM/YYYY")}`,
                }, {
                  label: "Vendor",
                  value: `${_get(item, "vendor.name")}`,
                }].map(({ label, value }) => (
                  <Box key={label} sx={{ width: `${100 / 5}%` }}>
                    <Box sx={{ color: "gray.5" }}>
                      {label}
                    </Box>
                    <Box>
                      {value}
                    </Box>
                  </Box>
                ))}
              </Flex>
              <Box
                className="action-button"
                sx={{ width: 30 }}
              >
                <State>
                  {([isOpen, setOpen]) => (
                    <>
                      <Button
                        minimal={true}
                        icon="info-sign"
                        onClick={() => {
                          setOpen(true);
                        }}
                      />
                      <DialogDetails
                        id={_get(item, "id")}
                        isOpen={isOpen}
                        onClose={() => { setOpen(false) }}
                      />
                    </>)}
                </State>
              </Box>
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