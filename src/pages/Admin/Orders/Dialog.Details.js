import { Classes, Dialog, Spinner } from "@blueprintjs/core";
import { Box, Divider, Flex, useClient } from "components";
import { toaster } from "components/toaster";
import { useEffect, useMemo, useState } from "react";
import _get from "lodash.get";
import currency from "currency.js";
import { CURRENCY_OPTIONS } from "components/constants";
import moment from "moment";
import { useTranslation } from "react-i18next";

export const DialogDetails = ({ id, isOpen, onClose = () => {} }) => {
  const { t } = useTranslation("orders-page");
  const client = useClient();

  const [order, setOrder] = useState(null);

  const price = useMemo(() => {
    let total = 0;
    let subtotal = 0;
    let tax = 0;

    if (order === null)
      return {
        total,
        subtotal,
        tax,
      };
    subtotal = _get(order, "order_lists").reduce((p, { price, quantity }) => {
      return p + price * quantity;
    }, 0);
    tax = _get(order, "tax") * subtotal;
    total = subtotal + tax;
    return {
      total,
      subtotal,
      tax,
    };
  }, [order]);

  useEffect(() => {
    if (!isOpen) return;
    const fetch = async () => {
      try {
        const res = await client["orders"].get(id, {
          query: {
            $select: [
              "order_number",
              "tax",
              "vendor",
              "order_lists",
              "created_at",
            ],
            $include: [
              {
                model: "vendors",
                $select: ["name"],
              },
              {
                model: "order_list",
                $select: ["price", "quantity"],
                $include: [
                  {
                    model: "items",
                    $select: ["name", "code"],
                  },
                ],
              },
            ],
          },
        });
        setOrder(res);
      } catch (err) {
        console.error(err);
        toaster.show({
          intent: "danger",
          message: err.message,
        });
      }
    };
    fetch();
  }, [client, id, isOpen]);

  return (
    <Dialog
      enforceFocus={false}
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
      title={
        order
          ? t("dialog_detail.title", {
              order_number: _get(order, "order_number"),
            })
          : t("common:loading_message")
      }
    >
      <div className={Classes.DIALOG_BODY}>
        {order === null && <Spinner />}
        {order && (
          <>
            <Box sx={{ mb: 3 }}>
              <Flex sx={{ mb: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                  {t("dialog_detail.labels.vendor")}:
                </Box>
                <Box>{_get(order, "vendor.name")}</Box>
              </Flex>
              <Flex>
                <Box sx={{ flexGrow: 1 }}>
                  {t("dialog_detail.labels.date")}:
                </Box>
                <Box>{moment(_get(order, "created_at")).format("LLLL")}</Box>
              </Flex>
            </Box>
            <Box>
              <Box className={Classes.CARD} sx={{ px: 0, py: 2 }}>
                <Box>
                  {_get(order, "order_lists").map((item, index) => (
                    <Flex key={index} sx={{ px: 2, mb: 2 }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ mr: 2 }}>{_get(item, "item.name")}</Box>
                        <Box sx={{ fontSize: 0, color: "gray.5" }}>
                          {_get(item, "item.code")}
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Flex sx={{ fontSize: 0, color: "gray.5" }}>
                          <Box sx={{ whiteSpace: "nowrap", mr: 2 }}>
                            {currency(
                              _get(item, "price"),
                              CURRENCY_OPTIONS
                            ).format()}
                          </Box>
                          <Box sx={{ whiteSpace: "nowrap" }}>
                            x {_get(item, "quantity")}
                          </Box>
                        </Flex>
                        <Box sx={{ whiteSpace: "nowrap", textAlign: "right" }}>
                          {currency(
                            _get(item, "price") * _get(item, "quantity"),
                            CURRENCY_OPTIONS
                          ).format()}
                        </Box>
                      </Box>
                    </Flex>
                  ))}
                </Box>
                <Divider />
                <Flex sx={{ px: 2, mb: 2 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    {t("dialog_detail.labels.subtotal")}
                  </Box>
                  <Box>
                    {currency(price["subtotal"], CURRENCY_OPTIONS).format()}
                  </Box>
                </Flex>
                <Flex sx={{ px: 2 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    {t("dialog_detail.labels.tax")} ({_get(order, "tax") * 100}
                    %)
                  </Box>
                  <Box>{currency(price["tax"], CURRENCY_OPTIONS).format()}</Box>
                </Flex>
                <Divider />
                <Flex sx={{ px: 2, fontSize: 2, fontWeight: "bold" }}>
                  <Box sx={{ flexGrow: 1 }}>
                    {t("dialog_detail.labels.total")}
                  </Box>
                  <Box>
                    {currency(price["total"], CURRENCY_OPTIONS).format()}
                  </Box>
                </Flex>
              </Box>
            </Box>
          </>
        )}
      </div>
    </Dialog>
  );
};
