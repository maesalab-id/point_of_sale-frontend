import {
  Button,
  Checkbox,
  Classes,
  NonIdealState,
  Spinner,
} from "@blueprintjs/core";
import { Box, Container, Flex, ListGroup, State } from "components";
import { toaster } from "components/toaster";
import { useState } from "react";
import { DialogEdit } from "./Dialog.Edit";
import { DialogRemove } from "./Dialog.Remove";
import _get from "lodash.get";
import { useListContext, Pagination } from "components/common/List";
import { Tooltip2 } from "@blueprintjs/popover2";

const List = () => {
  const [dialogOpen, setDialogOpen] = useState(null);
  const {
    refetch,
    items,
    total,
    page,
    limit,
    selectionStatus,
    dispatchSelectedItem,
    toggleSelection,
    clearSelection,
    selectedIds,
    setPage,
    isLoading,
    isFetching,
  } = useListContext();

  return (
    <Container sx={{ px: 3 }}>
      <ListGroup
        sx={{
          mb: 3,
          [`.${Classes.CHECKBOX}`]: {
            m: 0,
          },
        }}
      >
        <ListGroup.Header>
          <Flex sx={{ alignItems: "center" }}>
            <Box>
              <Checkbox
                disabled={selectionStatus.disabled}
                checked={selectionStatus.checked}
                indeterminate={selectionStatus.indeterminate}
                onChange={(e) => {
                  console.log(items);
                  dispatchSelectedItem({
                    type: "all",
                    items,
                    data: e.target.checked,
                  });
                }}
              />
            </Box>
            {selectedIds.length > 0 && (
              <Box>
                <Button
                  minimal={true}
                  intent="danger"
                  text={`Delete ${selectedIds.length} selected`}
                  onClick={() => setDialogOpen("delete")}
                />
              </Box>
            )}
            <DialogRemove
              data={selectedIds}
              isOpen={dialogOpen === "delete"}
              onClose={() => {
                setDialogOpen(null);
              }}
              onSubmitted={async () => {
                await refetch();
                await clearSelection();
                toaster.show({
                  intent: "success",
                  message: `User deleted`,
                });
              }}
            />
            <Box sx={{ flexGrow: 1 }} />
            <Box>
              <Tooltip2 content="Refresh">
                <Button
                  loading={isFetching}
                  minimal={true}
                  icon="refresh"
                  onClick={() => {
                    refetch();
                  }}
                />
              </Tooltip2>
            </Box>
          </Flex>
        </ListGroup.Header>
        {isLoading && (
          <Box sx={{ p: 2 }}>
            <Spinner size={50} />
          </Box>
        )}
        {!isLoading && items.length === 0 && (
          <Box sx={{ my: 3 }}>
            <NonIdealState title="No user available" />
          </Box>
        )}
        {!isLoading &&
          items.map((item) => (
            <ListGroup.Item
              key={item["id"]}
              sx={{
                "& .action-button": {
                  opacity: 0.5,
                },
                "&:hover .action-button": {
                  opacity: 1,
                },
              }}
            >
              <Flex>
                <Box sx={{ width: 40, flexShrink: 0 }}>
                  <Checkbox
                    checked={selectedIds.indexOf(item["id"]) !== -1}
                    onChange={(e) => {
                      toggleSelection({
                        name: item["id"],
                        value: e.target.checked,
                      });
                    }}
                  />
                </Box>
                {[
                  {
                    label: "Name",
                    props: "name",
                  },
                  {
                    label: "Username",
                    props: "username",
                  },
                  {
                    label: "Role",
                    props: "type",
                  },
                ].map(({ label, props }) => (
                  <Box key={label} sx={{ width: `${100 / 3}%` }}>
                    <Box sx={{ color: "gray.5" }}>{label}</Box>
                    <Box>{_get(item, props)}</Box>
                  </Box>
                ))}
                <Box className="action-button" sx={{ width: 30 }}>
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
                          onClose={() => {
                            setOpen(false);
                          }}
                          onSubmitted={() => {
                            refetch();
                            toaster.show({
                              intent: "success",
                              message: "User updated",
                            });
                          }}
                        />
                      </>
                    )}
                  </State>
                </Box>
              </Flex>
            </ListGroup.Item>
          ))}
      </ListGroup>
      <Pagination
        loading={items === null}
        total={total}
        limit={limit}
        page={page}
        onClick={(page) => {
          setPage(page);
        }}
      />
    </Container>
  );
};

export default List;
