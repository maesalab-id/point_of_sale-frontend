import { ListBodyItem, ListView, useListContext } from "components/common/List";
import { useState } from "react";
import { DialogEdit } from "./Dialog.Edit";
import _get from "lodash.get";
import _isNil from "lodash.isnil";
import { MenuItem } from "@blueprintjs/core";
import moment from "moment";

export const List = () => {
  const [selectedData, setSelectedData] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(null);

  const { refetch } = useListContext();

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
            return [
              <MenuItem
                icon="edit"
                text="Edit"
                onClick={() => {
                  setDialogOpen("edit");
                  setSelectedData(data);
                }}
              />,
            ];
          }}
        />
      </ListView>
      {!_isNil(selectedData) && (
        <>
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
