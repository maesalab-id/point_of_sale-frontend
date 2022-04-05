import { Button, Checkbox, Classes, NonIdealState, Spinner } from "@blueprintjs/core";
import { Box, Container, Flex, ListGroup, State, useClient, useList } from "components";
import { Pagination } from "components/Pagination";
import { toaster } from "components/toaster";
import { useEffect } from "react";
import { DialogEdit } from "./Dialog.Edit";
import _get from "lodash.get";
import moment from "moment";

const List = () => {
  const client = useClient();
  const { filter, setFilter, items, setItems, status, paging, setPaging, selectedItem, dispatchSelectedItem } = useList();

  useEffect(() => {
    const fetch = async () => {
      setItems(null);
      try {
        const query = {
          $distinct: true,
          $limit: 25,
          $or: filter["name"] ? {
            "name": filter["name"] ? {
              $iLike: `%${filter["name"]}%`
            } : undefined,
          } : undefined,
          $select: ["id", "name", "value", "start", "end"],
          $skip: paging.skip,
          $sort: {
            id: -1
          }
        };
        const res = await client["vouchers"].find({ query });
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
                label: "Name",
                value: _get(item, "name"),
              }, {
                label: "Discount Value",
                value: `${_get(item, "value")}%`,
              }, {
                label: "Active Date",
                value: `${moment(_get(item, "start"), "YYYY-MM-DD").format("DD/MM/YYYY")} - ${moment(_get(item, "end"), "YYYY-MM-DD").format("DD/MM/YYYY")}`,
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
              <Box
                className="action-button"
                sx={{ width: 30 }}
              >
                <State>
                  {([isOpen, setOpen]) => (
                    <>
                      <Button
                        minimal={true}
                        icon="edit"
                        onClick={() => {
                          setOpen(true);
                        }}
                      />
                      <DialogEdit
                        data={item}
                        isOpen={isOpen}
                        onClose={() => { setOpen(false) }}
                        onSubmitted={() => {
                          setFilter(f => ({ ...f, type: undefined }));
                          toaster.show({
                            intent: "success",
                            message: "Voucher updated"
                          });
                        }}
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