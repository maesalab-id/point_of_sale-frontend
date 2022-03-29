import { Button, Checkbox, Classes, NonIdealState, Spinner } from "@blueprintjs/core";
import { Box, Container, Flex, ListGroup, State, useClient, useList } from "components";
import { Pagination } from "components/Pagination";
import { toaster } from "components/toaster";
import { useEffect, useState } from "react";
import { DialogRemove } from "./Dialog.Remove";
import _get from "lodash.get";
import { DialogEdit } from "./Dialog.Edit";

const List = () => {
  const client = useClient();
  const { filter, setFilter, items, setItems, status, paging, setPaging, selectedItem, dispatchSelectedItem } = useList();
  const [dialogOpen, setDialogOpen] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setItems(null);
      try {
        const query = {
          $distinct: true,
          $limit: 25,
          "category_id": filter["category_id"] || undefined,
          "name": filter["name"] ? {
            $iLike: `%${filter["name"]}%`
          } : undefined,
          $select: ["id", "name", "code", "price", "quantity"],
          $skip: paging.skip,
          $sort: {
            id: 1
          },
          $include: [{
            model: "categories",
            $select: ["id", "name"]
          }],
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
              <Box>
                <Button
                  minimal={true}
                  intent="danger"
                  text={`Delete ${selectedItem.length} selected`}
                  onClick={() => setDialogOpen("delete")}
                />
              </Box>
            }
            <DialogRemove
              data={selectedItem}
              isOpen={dialogOpen === "delete"}
              onClose={() => { setDialogOpen(null) }}
              onSubmitted={() => {
                setFilter(f => ({ ...f, type: undefined }));
                toaster.show({
                  intent: "success",
                  message: `User deleted`
                });
              }}
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
              {[{
                label: "Code",
                props: "code",
              }, {
                label: "Name",
                props: "name",
              }, {
                label: "Price",
                props: "price",
              }, {
                label: "Quantity",
                props: "quantity",
              }, {
                label: "Category",
                props: "category.name",
              }].map(({ label, props }) => (
                <Box key={label} sx={{ width: `${100 / 5}%` }}>
                  <Box sx={{ color: "gray.5" }}>
                    {label}
                  </Box>
                  <Box>
                    {_get(item, props)}
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
                            message: "Product has been created"
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