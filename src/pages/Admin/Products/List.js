import { ListBodyItem, ListView, useListContext } from "components/common/List";
import { useState } from "react";
import { DialogEdit } from "./Dialog.Edit";
import _isNil from "lodash.isnil";
import _get from "lodash.get";
import { Button, MenuDivider, MenuItem, Tag } from "@blueprintjs/core";
import { DialogRemove } from "./Dialog.Remove";
import { Box } from "components";
import { CURRENCY_OPTIONS } from "components/constants";
import currency from "currency.js";
import { DialogDetails } from "./Dialog.Details";
import { useTranslation } from "react-i18next";

export const List = () => {
  const [selectedData, setSelectedData] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(null);
  const { t } = useTranslation("products-page");

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
          fields={(data) => {
            const extras = (() => {
              const price = Number(data.price);
              const discount_price = price * (data.discount / 100) || 0;
              const price_discounted = price - discount_price;
              const isDiscounted = price_discounted !== price;
              return {
                isDiscounted,
                discount_price,
                price_discounted,
              };
            })();

            return [
              {
                label: t('table.code'),
                value: `${_get(data, "code")}`,
              },
              {
                label: t('table.name'),
                value: `${_get(data, "name")}`,
              },
              {
                label: (
                  <Box>
                    <Box as="span" sx={{ mr: 1 }}>
                      {t('table.price')}
                    </Box>
                    {extras.isDiscounted && (
                      <Tag intent="warning">{`-${_get(
                        data,
                        "discount"
                      )}%`}</Tag>
                    )}
                  </Box>
                ),
                value: (
                  <Box>
                    {extras.isDiscounted && (
                      <strike>
                        {`${currency(
                          _get(data, "price"),
                          CURRENCY_OPTIONS
                        ).format()}`}
                      </strike>
                    )}
                    <Box>
                      {`${currency(
                        _get(extras, "price_discounted"),
                        CURRENCY_OPTIONS
                      ).format()} /unit`}
                    </Box>
                  </Box>
                ),
              },
              {
                label: "Stock",
                value: `${_get(data, "quantity")} unit`,
              },
              {
                label: "Bad Stock",
                value: `${_get(data, "bad_quantity") ?? 0} unit`,
              },
              {
                label: t('table.category'),
                value: `${_get(data, "category.name")}`,
              },
            ];
          }}
          actions={(data) => {
            return [
              <MenuItem
                icon="info-sign"
                text="Details"
                onClick={() => {
                  setDialogOpen("details");
                  setSelectedData(data);
                }}
              />,
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
          <DialogDetails
            data={selectedData}
            isOpen={dialogOpen === "details"}
            onClose={() => {
              setSelectedData(null);
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
        </>
      )}
    </>
  );
};
