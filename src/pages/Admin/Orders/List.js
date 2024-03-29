import { ListBodyItem, ListView, useListContext } from "components/common/List";
import { useCallback, useRef, useState } from "react";
import _get from "lodash.get";
import _isNil from "lodash.isnil";
import { MenuDivider, MenuItem, Tag } from "@blueprintjs/core";
import moment from "moment";
import { CURRENCY_OPTIONS } from "components/constants";
import currency from "currency.js";
import { DialogDetails } from "./Dialog.Details";
import { DialogRemove } from "components/common";
import { useTranslation } from "react-i18next";
import { DialogReceived } from "./Dialog.Received";
import { useReactToPrint } from "react-to-print";
import { Print } from "./Print";
import { VENDOR_INFORMATION } from "components/constants";

let timeout;

export const List = () => {
  const [selectedData, setSelectedData] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(null);
  const { t } = useTranslation("orders-page");
  const printArea = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printArea.current,
    documentTitle: `Print receipt`,
    removeAfterPrint: true,
    onAfterPrint: () => {
      setSelectedData(null);
      timeout && clearTimeout(timeout);
    },
  });

  const printPurchaseOrder = useCallback(
    (data) => {
      setSelectedData(data);
      timeout = setTimeout(() => {
        handlePrint();
      }, 200);
    },
    [handlePrint]
  );

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
              label: "Status",
              value: _get(data, "received") ? (
                <Tag intent="success">{t("list_order.labels.received")}</Tag>
              ) : (
                <Tag intent="primary">
                  {t("list_order.labels.not_received")}
                </Tag>
              ),
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
                text={t("list_order.labels.details")}
                onClick={() => {
                  setDialogOpen("details");
                  setSelectedData(data);
                }}
              />,
              <MenuItem
                icon="saved"
                intent="success"
                disabled={data.received}
                text={t("list_order.labels.received")}
                onClick={() => {
                  setDialogOpen("received");
                  setSelectedData(data);
                }}
              />,
              <MenuItem
                icon="print"
                intent="primary"
                text={t("list_order.labels.print")}
                onClick={() => {
                  printPurchaseOrder(data);
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
          <DialogReceived
            isOpen={dialogOpen === "received"}
            onClose={() => {
              setDialogOpen(null);
            }}
            onConfirm={async () => {
              setDialogOpen(null);
              setSelectedData(null);
              await refetch();
            }}
            data={selectedData}
          />
        </>
      )}
      <Print
        ref={printArea}
        data={selectedData}
        items={selectedData?.order_lists ?? []}
        receipt_no={selectedData?.order_number ?? 0}
        total={selectedData?.price ?? 0}
        company_name={VENDOR_INFORMATION.NAME}
        company_address={VENDOR_INFORMATION.ADDRESS}
        date={selectedData?.created_at}
      />
    </>
  );
};
