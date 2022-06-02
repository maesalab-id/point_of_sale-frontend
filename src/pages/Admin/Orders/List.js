import { ListBodyItem, ListView, useListContext } from "components/common/List";
import { useState } from "react";
import _get from "lodash.get";
import _isNil from "lodash.isnil";
import { MenuDivider, MenuItem } from "@blueprintjs/core";
import moment from "moment";
import { CURRENCY_OPTIONS } from "components/constants";
import currency from "currency.js";
import { DialogDetails } from "./Dialog.Details";
import { DialogRemove } from "components/common";

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
              label: "Order Number",
              value: `#${_get(data, "order_number")}`,
            },
            {
              label: "Total Price",
              value: `${currency(
                _get(data, "price"),
                CURRENCY_OPTIONS
              ).format()}`,
            },
            {
              label: "Quantity",
              value: `${_get(data, "quantity")} of ${_get(
                data,
                "order_lists.length"
              )} item`,
            },
            {
              label: "Date",
              value: `${moment(_get(data, "created_at")).format("DD/MM/YYYY")}`,
            },
            {
              label: "Vendor",
              value: `${_get(data, "vendor.name")}`,
            },
          ]}
          actions={(data) => {
            let list = [
              <MenuItem
                icon="info-sign"
                text="Details"
                onClick={() => {
                  setDialogOpen("details");
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
          <DialogDetails
            id={_get(selectedData, "id")}
            isOpen={dialogOpen === "details"}
            onClose={() => {
              setDialogOpen(null);
            }}
          />
        </>
      )}
    </>
  );
};
