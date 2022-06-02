import { ListBodyItem, ListView, useListContext } from "components/common/List";
import { useState } from "react";
import { DialogEdit } from "./Dialog.Edit";
import _get from "lodash.get";
import _isNil from "lodash.isnil";
import { MenuDivider, MenuItem } from "@blueprintjs/core";
import moment from "moment";
import { DialogRemove } from "./Dialog.Remove";

export const List = () => {
  const [selectedData, setSelectedData] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(null);

  const { refetch, clearSelection } = useListContext();

  return (
    <>
      <ListView>
        <ListBodyItem
          fields={(data) => [
            {
              label: "Name",
              value: _get(data, "name"),
            },
            {
              label: "Discount Value",
              value: `${_get(data, "value")}%`,
            },
            {
              label: "Active Date",
              value: `${moment(_get(data, "start"), "YYYY-MM-DD").format(
                "DD/MM/YYYY"
              )} - ${moment(_get(data, "end"), "YYYY-MM-DD").format(
                "DD/MM/YYYY"
              )}`,
            },
          ]}
          actions={(data) => {
            let list = [
              <MenuItem
                icon="edit"
                text="Edit"
                onClick={() => {
                  setDialogOpen("edit");
                  setSelectedData(data);
                }}
              />,
            ];
            if (process.env.NODE_ENV === "development") {
              list = [
                ...list,
                <MenuDivider />,
                <MenuItem
                  intent="danger"
                  icon="trash"
                  text="Delete"
                  label="in dev"
                  onClick={() => {
                    setDialogOpen("delete");
                    setSelectedData(data);
                  }}
                />,
              ];
            }
            return list;
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
