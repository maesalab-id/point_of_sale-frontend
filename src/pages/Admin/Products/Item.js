import { Button, Checkbox, Tag } from "@blueprintjs/core";
import { Box, Flex, ListGroup, State, useList } from "components";
import { DialogEdit } from "./Dialog.Edit";
import currency from "currency.js";
import { CURRENCY_OPTIONS } from "components/constants";
import { DialogDetail } from "./Dialog.Detail";
import _get from "lodash.get";
import { toaster } from "components/toaster";
import { useMemo } from "react";

export const Item = ({ data: item }) => {
  const { setFilter, selectedItem, dispatchSelectedItem } = useList();

  const extras = useMemo(() => {
    const price = Number(item.price);
    const discount_price = price * (item.discount / 100) || 0;
    const price_discounted = price - discount_price;
    const isDiscounted = price_discounted !== price;
    return {
      isDiscounted,
      discount_price,
      price_discounted,
    };
  }, [item.discount, item.price]);

  return (
    <ListGroup.Item
      sx={{
        "& .action-button": {
          opacity: 0.25,
        },
        "&:hover .action-button": {
          opacity: 1,
        },
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
                  value: e.target.checked,
                },
              });
            }}
          />
        </Box>
        <Flex sx={{ flexGrow: 1 }}>
          {[
            {
              label: "Code",
              value: `${_get(item, "code")}`,
            },
            {
              label: "Name",
              value: `${_get(item, "name")}`,
            },
            {
              label: (
                <Box>
                  <Box as="span" sx={{ mr: 1 }}>
                    Price
                  </Box>
                  {extras.isDiscounted && (
                    <Tag intent="warning">{`-${_get(item, "discount")}%`}</Tag>
                  )}
                </Box>
              ),
              value: (
                <Box>
                  {extras.isDiscounted && (
                    <strike>
                      {`${currency(
                        _get(item, "price"),
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
              value: `${_get(item, "quantity")} unit`,
            },
            {
              label: "Category",
              value: `${_get(item, "category.name")}`,
            },
          ].map(({ label, value, hide }, idx) => (
            <Box key={idx} sx={{ width: `${100 / 5}%`, opacity: hide ? 0 : 1 }}>
              <Box sx={{ color: "gray.5" }}>{label}</Box>
              <Box>{value}</Box>
            </Box>
          ))}
        </Flex>
        <Flex
          className="action-button"
          sx={{ width: 60, alignItems: "center" }}
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
                  onClose={() => {
                    setOpen(false);
                  }}
                  onSubmitted={() => {
                    setFilter((f) => ({ ...f, type: undefined }));
                    toaster.show({
                      intent: "success",
                      message: "Product has been updated",
                    });
                  }}
                />
              </>
            )}
          </State>
          <State>
            {([isOpen, setOpen]) => (
              <>
                <Button
                  minimal={true}
                  icon="info-sign"
                  onClick={() => {
                    setOpen(true);
                  }}
                />
                <DialogDetail
                  data={item}
                  isOpen={isOpen}
                  onClose={() => {
                    setOpen(false);
                  }}
                  onSubmitted={() => {
                    setFilter((f) => ({ ...f, type: undefined }));
                  }}
                />
              </>
            )}
          </State>
        </Flex>
      </Flex>
    </ListGroup.Item>
  );
};
