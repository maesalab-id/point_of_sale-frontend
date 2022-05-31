import { Button, Checkbox, Classes, NonIdealState, Spinner, Tag } from "@blueprintjs/core";
import { Box, Container, Flex, ListGroup, State, useClient, useList } from "components";
import { Pagination } from "components/Pagination";
import { useCallback, useEffect } from "react";
import _get from "lodash.get";
import currency from "currency.js";
import moment from "moment";
import { exportToCSV } from "components/utils/exportToCSV";
import { toaster } from "components/toaster";
import { DialogDetails } from "./Dialog.Details";

const List = () => {
  const client = useClient();
  const { filter, items, setItems, status, paging, setPaging, selectedItem, dispatchSelectedItem } = useList();

  const fetchList = useCallback(async ({
    limit = 25,
    start,
    end
  }) => {
    const startDate = moment(start || filter["start"], "DD-MM-YYYY");
    const endDate = moment(start || filter["end"], "DD-MM-YYYY");
    const query = {
      $distinct: true,
      $limit: limit,
      "receipt_number": filter["receipt_number"] || undefined,
      "created_at": (startDate.isValid() && endDate.isValid()) ? {
        $gte: startDate.isValid() ? startDate.startOf("day").toISOString() : undefined,
        $lte: endDate.isValid() ? endDate.endOf("day").toISOString() : undefined
      } : undefined,
      $select: ["id", "receipt_number", "tax", "created_at"],
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
    const data = res.data.map((item) => {
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
    });
    setItems(data);
    return {
      total: res.total,
      limit: res.limit,
      skip: res.skip,
      data
    };
  }, [client, paging.skip, setItems, filter]);

  const onExport = useCallback(async () => {
    let data = null;

    let toast = toaster.show({
      intent: "none",
      message: "Fetching data..."
    });

    const startEnd = [
      filter.start ? moment(filter.start, "DD-MM-YYYY").format("DD-MM-YYYY") : moment().format("DD-MM-YYYY"),
      filter.end ? moment(filter.end, "DD-MM-YYYY").format("DD-MM-YYYY") : moment().format("DD-MM-YYYY"),
    ];

    try {
      data = await fetchList({
        limit: 1000,
        start: startEnd[0],
        end: startEnd[1],
      });
    } catch (err) {
      console.error(err);
      toaster.dismiss(toast);
      toaster.show({
        intent: "danger",
        message: err.message
      });
    }
    if (!data) {
      toaster.show({
        intent: "warning",
        message: "Can't export data"
      })
      return;
    }

    toaster.dismiss(toast);
    toast = toaster.show({
      intent: "none",
      message: "Exporting data..."
    });

    const fileName = `[POS] ${startEnd.join(" to ")}.csv`;

    try {
      exportToCSV({
        fileName,
        header: ["Receipt No.", "Date", "Subtotal", "Tax (10%)", "Total"],
        items: data.data,
        parseData(item) {
          const price = {
            total: 0,
            subTotal: 0,
            tax: 0
          }
          price["subTotal"] = item["receipt_items"].reduce((p, c) => {
            return p + (c["price"] * c["quantity"]);
          }, 0);
          price["tax"] = item["tax"] * price["subTotal"];
          price["total"] = price["tax"] + price["subTotal"];
          return [
            item["receipt_number"],
            moment(item["created_at"]).format("DD/MM/YYYY HH:mm"),
            price["subTotal"],
            price["tax"],
            price["total"]
          ]
        }
      });
    } catch (err) {
      toaster.dismiss(toast);
      console.error(err);
      toaster.show({
        intent: "danger",
        message: err.message
      })
    }

    toaster.dismiss(toast);
    toaster.show({
      intent: "success",
      message: (
        <>
          {"Data exported "}<Tag>{`${fileName}`}</Tag>
        </>
      )
    });

  }, [fetchList, filter.start, filter.end]);

  useEffect(() => {
    const fetch = async () => {

      setItems(null);
      try {
        let res = await fetchList({
          $limit: 25,
        });
        setItems(res.data);
        setPaging({
          total: res.total,
          limit: res.limit,
          skip: res.skip
        });
      } catch (err) {
        console.error(err);
        setItems([]);
        toaster.show({
          intent: "danger",
          message: err.message
        })
      }
    }
    fetch();
  }, [fetchList, setItems, setPaging]);

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
            <Box sx={{ flexGrow: 1 }} />
            <Button
              text="Export to CSV"
              onClick={() => onExport()}
            />
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
                  value: `#${_get(item, "receipt_number")}`,
                }, {
                  label: "Subtotal",
                  value: `${currency(_get(item, "price"), { symbol: "Rp. ", precision: 0 }).format()}`,
                }, {
                  label: "Total Price + 10% tax",
                  value: `${currency(_get(item, "total"), { symbol: "Rp. ", precision: 0 }).format()}`,
                }, {
                  label: "Quantity",
                  value: `${_get(item, "quantity")} unit`,
                }, {
                  label: "Date",
                  value: `${moment(_get(item, "created_at")).format("DD/MM/YYYY")}`,
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
        sx={{ mt: 3 }}
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