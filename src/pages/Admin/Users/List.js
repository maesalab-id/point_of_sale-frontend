import { ListBodyItem, ListView, useListContext } from "components/common/List";
import { useState } from "react";
import { DialogEdit } from "./Dialog.Edit";
import _isNil from "lodash.isnil";
import { Button, MenuDivider, MenuItem } from "@blueprintjs/core";
import { DialogRemove } from "./Dialog.Remove";
import { Box } from "components";

export const List = () => {
  const [selectedData, setSelectedData] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(null);

  const { refetch, clearSelection, selectedIds } = useListContext();

  return (
    <>
      <ListView
        bulkActions={
          <>
            <Box>
              <Button
                minimal={true}
                intent="danger"
                text={`Delete ${selectedIds.length} selected`}
                onClick={() => {
                  setDialogOpen("bulk-delete");
                }}
              />
              <DialogRemove
                data={selectedIds}
                isOpen={dialogOpen === "bulk-delete"}
                onClose={() => {
                  setDialogOpen(null);
                }}
                onSubmitted={async () => {
                  await clearSelection();
                  await refetch();
                }}
              />
            </Box>
          </>
        }
      >
        <ListBodyItem
          fields={[
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
          ]}
          actions={(data) => {
            return [
              <MenuItem
                icon="edit"
                text="Edit"
                onClick={() => {
                  setDialogOpen("edit");
                  setSelectedData(data);
                }}
              />,
              <MenuDivider />,
              <MenuItem
                intent="danger"
                icon="trash"
                text="Delete"
                onClick={() => {
                  setDialogOpen("delete");
                  setSelectedData(data);
                }}
              />,
            ];
          }}
        />
      </ListView>
      {!_isNil(selectedData) && (
        <>
          <DialogRemove
            data={[selectedData.id]}
            isOpen={dialogOpen === "delete"}
            onClose={() => {
              setSelectedData(null);
            }}
            onSubmitted={async () => {
              await refetch();
              await clearSelection();
            }}
          />
          <DialogEdit
            data={selectedData}
            isOpen={dialogOpen === "edit"}
            onClose={() => {
              setSelectedData(null);
            }}
            onSubmitted={async () => {
              await refetch();
            }}
          />
        </>
      )}
    </>
  );
};
