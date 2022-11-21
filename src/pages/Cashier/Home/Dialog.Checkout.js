import {
  Button,
  Classes,
  Dialog,
  FormGroup,
  InputGroup,
  Tag,
} from "@blueprintjs/core";
import {
  Box,
  Divider,
  FetchAndSelect,
  Flex,
  State,
  useClient,
} from "components";
import { CURRENCY_OPTIONS, isDev } from "components/constants";
import { toaster } from "components/toaster";
import currency from "currency.js";
import { useFormik } from "formik";
import { DialogAdd as CheckoutDialogAdd } from "pages/Admin/Customers/Dialog.Add";
import * as Yup from "yup";
import _get from "lodash.get";
import moment from "moment";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const Schema = Yup.object().shape({
  customer_id: Yup.number(),
  cash_in: Yup.number(),
});

const initialValues = {
  customer_id: undefined,
  cash_in: undefined,
};

export const DialogCheckout = ({
  initialValue = {},
  tax,
  price,
  isOpen,
  onClose = () => {},
  onSubmitted = () => {},
}) => {
  const { t } = useTranslation("cashier-home-page");
  const client = useClient();
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const {
    values,
    errors,
    isSubmitting,
    resetForm,
    handleSubmit,
    handleChange,
    setFieldValue,
  } = useFormik({
    validationSchema: Schema,
    initialValues: {
      ...initialValues,
      ...initialValue,
    },
    onReset: () => {
      setSelectedVoucher(null);
    },
    onSubmit: async ({ cash_in, cash_out, ...values }) => {
      onClose();
      onSubmitted(values);
    },
  });

  const extras = useMemo(() => {
    const voucher_discount =
      price["subtotal"] *
      ((selectedVoucher ? selectedVoucher["value"] : 0) / 100);
    let subtotal_discounted = price["subtotal"] - voucher_discount;
    const taxed = subtotal_discounted * (tax / 100);
    let total = subtotal_discounted + taxed;
    const result = {
      subtotal_discounted,
      voucher_discount,
      total,
      taxed,
    };
    return result;
  }, [price, tax, selectedVoucher]);

  return (
    <Dialog
      enforceFocus={false}
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
      title={t("dialog_order.title")}
    >
      <form onSubmit={handleSubmit}>
        <div className={Classes.DIALOG_BODY}>
          <State
            initialValue={{
              isOpen: false,
              query: "",
            }}
          >
            {([state, setState]) => (
              <>
                <FormGroup
                  label={t("dialog_order.form.customer.label")}
                  labelInfo="optional"
                  labelFor="f-customer_id"
                  helperText={errors["customer_id"]}
                  intent={"danger"}
                >
                  <FetchAndSelect
                    allowCreateItem={true}
                    service={client["customers"]}
                    id="f-customer_id"
                    name="customer_id"
                    placeholder="Select Customer"
                    value={values["customer_id"]}
                    intent={errors["customer_id"] ? "danger" : "none"}
                    onChange={async ({ value }) => {
                      await setFieldValue("customer_id", value);
                    }}
                    onCreateNew={(query) => {
                      setState({
                        isOpen: true,
                        query,
                      });
                    }}
                    onPreFetch={(q, query) => {
                      return {
                        ...query,
                        $or: q
                          ? {
                              name: q
                                ? {
                                    [isDev ? "$iLike" : "$like"]: `%${q}%`,
                                  }
                                : undefined,
                              phone_number: q
                                ? {
                                    [isDev ? "$iLike" : "$like"]: `%${q}%`,
                                  }
                                : undefined,
                            }
                          : undefined,
                        $select: ["id", "name", "phone_number"],
                      };
                    }}
                    onFetched={(items) => {
                      return items.map((item) => {
                        return {
                          label: item["name"],
                          value: `${item["id"]}`,
                          info: `${item["phone_number"]}`,
                        };
                      });
                    }}
                  />
                </FormGroup>
                <CheckoutDialogAdd
                  isOpen={state.isOpen}
                  initialValue={{
                    name: state.query,
                  }}
                  onClose={() => {
                    setState((s) => ({ ...s, isOpen: false }));
                  }}
                  onSubmitted={() => {
                    toaster.show({
                      intent: "success",
                      message: "Customer created",
                    });
                  }}
                />
              </>
            )}
          </State>
          <FormGroup
            label={t("dialog_order.form.voucher.label")}
            labelInfo="optional"
            labelFor="f-voucher_id"
            helperText={errors["voucher_id"]}
            intent={"danger"}
          >
            <FetchAndSelect
              service={client["vouchers"]}
              id="f-voucher_id"
              name="voucher_id"
              placeholder="Use Voucher"
              value={values["voucher_id"]}
              intent={errors["voucher_id"] ? "danger" : "none"}
              onChange={async ({ label, value, info }) => {
                await setFieldValue("voucher_id", value);
                const v = Number(info.replace("%", ""));
                await setSelectedVoucher({
                  value: v,
                  name: label,
                });
              }}
              onPreFetch={(q, query) => {
                return {
                  ...query,
                  $or: q
                    ? {
                        name: q
                          ? {
                              [isDev ? "$iLike" : "$like"]: `%${q}%`,
                            }
                          : undefined,
                      }
                    : undefined,
                  end: {
                    $gte: moment().format("YYYY-MM-DD"),
                  },
                  $select: ["id", "name", "value", "start", "end"],
                };
              }}
              onFetched={(items) => {
                return items.map((item) => {
                  const start = moment(item["start"], "YYYY-MM-DD");
                  const end = moment(item["end"], "YYYY-MM-DD");
                  const isDisabled = start.diff(moment()) > 0;
                  const isExpired = end.diff(moment()) < 0;
                  return {
                    disabled: isDisabled || isExpired,
                    label: `${item["name"]}`,
                    value: `${item["id"]}`,
                    info: isDisabled
                      ? `until ${start.format("DD-MMMM")}`
                      : isExpired
                      ? `expired`
                      : `${item["value"]}%`,
                  };
                });
              }}
            />
          </FormGroup>
          <FormGroup
            label={t("dialog_order.form.input_cash.label")}
            intent="danger"
            helperText={_get(errors, "cash_in")}
          >
            <InputGroup
              name="cash_in"
              type="number"
              value={values["cash_in"] || ""}
              onChange={handleChange}
              intent={errors["cash_in"] ? "danger" : "none"}
              leftElement={<Tag minimal={true}>Rp.</Tag>}
            />
          </FormGroup>
          <Box className={Classes.CARD} sx={{ px: 0, py: 2, mb: 3 }}>
            <Flex sx={{ px: 2, mb: 2 }}>
              <Box sx={{ flexGrow: 1 }}>Subtotal</Box>
              <Box>
                {currency(price["subtotal"], CURRENCY_OPTIONS).format()}
              </Box>
            </Flex>
            {selectedVoucher && (
              <>
                <Flex sx={{ px: 2, mb: 2 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    Voucher Discount (-{_get(selectedVoucher, "value")}%)
                  </Box>
                  <Box>
                    <Tag minimal={true}>
                      {currency(
                        extras["voucher_discount"] * -1,
                        CURRENCY_OPTIONS
                      ).format()}
                    </Tag>{" "}
                    {currency(
                      extras["subtotal_discounted"],
                      CURRENCY_OPTIONS
                    ).format()}
                  </Box>
                </Flex>
              </>
            )}
            <Flex sx={{ px: 2 }}>
              <Box sx={{ flexGrow: 1 }}>Tax (10%)</Box>
              <Box>{currency(extras["taxed"], CURRENCY_OPTIONS).format()}</Box>
            </Flex>
            <Divider />
            <Flex sx={{ px: 2, fontSize: 2, fontWeight: "bold" }}>
              <Box sx={{ flexGrow: 1 }}>Total</Box>
              <Box>{currency(extras["total"], CURRENCY_OPTIONS).format()}</Box>
            </Flex>
            <Divider />
            <Flex sx={{ mb: 2, px: 2, fontSize: 1 }}>
              <Box sx={{ flexGrow: 1 }}>{t("dialog_order.form.cash")}</Box>
              <Box>
                {currency(_get(values, "cash_in"), CURRENCY_OPTIONS).format()}
              </Box>
            </Flex>
            <Flex sx={{ px: 2, fontSize: 2, fontWeight: "bold" }}>
              <Box sx={{ flexGrow: 1 }}>{t("dialog_order.form.change")}</Box>
              <Box>
                {currency(
                  _get(values, "cash_in")
                    ? _get(values, "cash_in") - extras["total"]
                    : 0,
                  CURRENCY_OPTIONS
                ).format()}
              </Box>
            </Flex>
          </Box>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button minimal={true} onClick={() => resetForm()} text="Reset" />
            <Button minimal={true} onClick={() => onClose()} text="Cancel" />
            <Button
              loading={isSubmitting}
              type="submit"
              intent="primary"
              text="Checkout"
            />
          </div>
        </div>
      </form>
    </Dialog>
  );
};
