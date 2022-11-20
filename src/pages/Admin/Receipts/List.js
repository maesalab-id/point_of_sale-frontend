import { ListBodyItem, ListView, useListContext } from "components/common/List";
import { useEffect, useState } from "react";
import _get from "lodash.get";
import _isNil from "lodash.isnil";
import { MenuDivider, MenuItem } from "@blueprintjs/core";
import moment from "moment";
import { CURRENCY_OPTIONS } from "components/constants";
import currency from "currency.js";
import { DialogDetails } from "./Dialog.Details";
import { DialogRemove } from "components/common";
import { useTranslation } from "react-i18next";
import DialogReturn from "./Dialog.Return";

export const List = () => {
  const [selectedData, setSelectedData] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(null);
  const { t } = useTranslation("receipts-page");

  const { refetch, clearSelection } = useListContext();

  useEffect(() => {
    let timeout;
    if (dialogOpen === null) {
      timeout = setTimeout(() => {
        setSelectedData(null);
      }, 350);
    }
    return () => {
      typeof timeout !== "undefined" && clearTimeout(timeout);
    };
  }, [dialogOpen]);

  return (
    <>
      <ListView>
        <ListBodyItem
          fields={(data) => [
            {
              label: "Order Number",
              value: `#${_get(data, "receipt_number")}`,
            },
            {
              label: "Subtotal",
              value: `${currency(
                _get(data, "price"),
                CURRENCY_OPTIONS
              ).format()}`,
            },
            {
              label: "Total Price + 10% tax",
              value: `${currency(
                _get(data, "total"),
                CURRENCY_OPTIONS
              ).format()}`,
            },
            {
              label: "Quantity",
              value: `${_get(data, "quantity")} unit`,
            },
            {
              label: "Date",
              value: `${moment(_get(data, "created_at")).format("DD/MM/YYYY")}`,
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
              <MenuItem
                icon="undo"
                intent="warning"
                text={t("toolbar.return")}
                onClick={() => {
                  setDialogOpen("return");
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
          <DialogReturn
            isOpen={dialogOpen === "return"}
            onClose={() => {
              setDialogOpen(null);
            }}
            data={selectedData}
            onConfirm={() => {
              refetch();
            }}
          />
        </>
      )}
    </>
  );
};
