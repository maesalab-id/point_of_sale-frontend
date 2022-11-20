import {
  Button,
  Classes,
  Dialog,
  FormGroup,
  InputGroup,
} from "@blueprintjs/core";
import {
  Box,
  FetchAndSelect,
  Flex,
  ListGroup,
  State,
  useClient,
} from "components";
import ListGroupHeader from "components/ListGroup.Header";
import ListGroupItem from "components/ListGroup.Item";
import { toaster } from "components/toaster";
import { FieldArray, Formik } from "formik";
import * as Yup from "yup";
import _get from "lodash.get";
import { DialogAdd as VendorDialogAdd } from "../Vendors/Dialog.Add";
import { useTranslation } from "react-i18next";

const Schema = Yup.object().shape({
  vendor_id: Yup.string().required(),
  orders: Yup.array()
    .of(
      Yup.object().shape({
        item_id: Yup.number().required(),
        price: Yup.number().required(),
        quantity: Yup.number().min(1).required(),
      })
    )
    .required("Add item to order")
    .min(1, "Minimum of 1 item"),
});

const initialValues = {
  vendor_id: undefined,
  orders: [
    {
      item_id: undefined,
      price: 0,
      quantity: 1,
    },
  ],
};

export const DialogAdd = ({
  isOpen,
  onClose = () => {},
  onSubmitted = () => {},
}) => {
  const client = useClient();
  const { t } = useTranslation("orders-page");

  return (
    <Dialog
      enforceFocus={false}
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
      title={t("dialog_create.titles")}
    >
      <Formik
        validationSchema={Schema}
        initialValues={initialValues}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const res = await client["orders"].create({
              vendor_id: values["vendor_id"],
              orders: values["orders"],
            });
            onClose();
            onSubmitted(res);
          } catch (err) {
            console.error(err);
            setSubmitting(false);
            toaster.show({
              intent: "danger",
              message: err.message,
            });
          }
        }}
      >
        {({
          values,
          errors,
          isSubmitting,
          setFieldValue,
          handleSubmit,
          handleChange,
        }) => (
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
                      label="Vendor"
                      labelFor="f-vendor_id"
                      helperText={errors["vendor_id"]}
                      intent={"danger"}
                    >
                      <FetchAndSelect
                        allowCreateItem={true}
                        service={client["vendors"]}
                        id="f-vendor_id"
                        name="vendor_id"
                        value={values["vendor_id"]}
                        intent={errors["vendor_id"] ? "danger" : "none"}
                        onChange={async ({ value }) => {
                          await setFieldValue("vendor_id", value);
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
                            name: q
                              ? {
                                  $iLike: `%${q}%`,
                                }
                              : undefined,
                            $select: ["id", "name"],
                          };
                        }}
                        onFetched={(items) => {
                          return items.map((item) => {
                            return {
                              label: item["name"],
                              value: `${item["id"]}`,
                            };
                          });
                        }}
                      />
                    </FormGroup>
                    <VendorDialogAdd
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
                          message: "Vendor created",
                        });
                      }}
                    />
                  </>
                )}
              </State>
              <FormGroup label="Items">
                <FieldArray
                  name="orders"
                  render={(arr) => (
                    <ListGroup>
                      <ListGroupHeader>
                        <Flex sx={{ alignItems: "center" }}>
                          <Box sx={{ mr: 2, flexGrow: 1 }}>
                            {_get(values, "orders.length")} Items
                          </Box>
                          <Box>
                            <Button
                              text="Add item"
                              onClick={() => {
                                arr.push({
                                  item_id: undefined,
                                  price: 0,
                                  quantity: 1,
                                });
                              }}
                            />
                          </Box>
                        </Flex>
                      </ListGroupHeader>
                      {values["orders"].map((value, index) => {
                        return (
                          <ListGroupItem key={index}>
                            <Flex sx={{ mx: -2 }}>
                              <Box sx={{ px: 2, width: `${100 / 2}%` }}>
                                <FormGroup
                                  label="Item"
                                  labelFor="f-code"
                                  helperText={errors["code"]}
                                  intent={"danger"}
                                >
                                  <FetchAndSelect
                                    fill={true}
                                    service={client["items"]}
                                    id="f-item_id"
                                    name={`orders[${index}].item_id`}
                                    value={_get(value, "item_id")}
                                    intent={
                                      _get(errors, `orders[${index}].item_id`)
                                        ? "danger"
                                        : "none"
                                    }
                                    onChange={async ({ value }) => {
                                      await setFieldValue(
                                        `orders[${index}].item_id`,
                                        value
                                      );
                                    }}
                                    onPreFetch={(q, query) => {
                                      let selectedItems = _get(values, `orders`)
                                        .filter((_, i) => i !== index)
                                        .map((order) => {
                                          return order["item_id"];
                                        })
                                        .reduce((p, c) => {
                                          if (typeof c === "undefined")
                                            return p;
                                          return [...p, c];
                                        }, []);
                                      return {
                                        ...query,
                                        name: q
                                          ? {
                                              $iLike: `%${q}%`,
                                            }
                                          : undefined,
                                        id:
                                          selectedItems.length > 0
                                            ? {
                                                $nin: selectedItems,
                                              }
                                            : undefined,
                                        $select: ["id", "name"],
                                      };
                                    }}
                                    onFetched={(items) => {
                                      return items.map((item) => {
                                        return {
                                          label: item["name"],
                                          value: `${item["id"]}`,
                                        };
                                      });
                                    }}
                                  />
                                </FormGroup>
                              </Box>
                              <Box sx={{ px: 2, width: `${100 / 4}%` }}>
                                <FormGroup
                                  label={t("dialog_create.labels.price")}
                                  labelFor="f-price"
                                  helperText={_get(
                                    errors,
                                    `orders[${index}].price`
                                  )}
                                  intent={"danger"}
                                >
                                  <InputGroup
                                    fill={true}
                                    id="f-price"
                                    name={`orders[${index}].price`}
                                    value={_get(
                                      values,
                                      `orders[${index}].price`
                                    )}
                                    onChange={handleChange}
                                    intent={
                                      _get(errors, `orders[${index}].price`)
                                        ? "danger"
                                        : "none"
                                    }
                                  />
                                </FormGroup>
                              </Box>
                              <Box sx={{ px: 2, width: `${100 / 4}%` }}>
                                <FormGroup
                                  label={t("dialog_create.labels.quantity")}
                                  labelFor="f-quantity"
                                  helperText={_get(
                                    errors,
                                    `orders[${index}].quantity`
                                  )}
                                  intent={"danger"}
                                >
                                  <InputGroup
                                    fill={true}
                                    id="f-quantity"
                                    name={`orders[${index}].quantity`}
                                    value={_get(
                                      values,
                                      `orders[${index}].quantity`
                                    )}
                                    onChange={handleChange}
                                    intent={
                                      _get(errors, `orders[${index}].quantity`)
                                        ? "danger"
                                        : "none"
                                    }
                                  />
                                </FormGroup>
                              </Box>
                              <Box sx={{ px: 2, maxWidth: "30" }}>
                                <Button
                                  disabled={_get(values, "orders.length") === 1}
                                  minimal={true}
                                  intent="danger"
                                  icon="cross"
                                  onClick={() => {
                                    arr.remove(index);
                                  }}
                                />
                              </Box>
                            </Flex>
                          </ListGroupItem>
                        );
                      })}
                    </ListGroup>
                  )}
                />
              </FormGroup>
            </div>
            <div className={Classes.DIALOG_FOOTER}>
              <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                <Button minimal={true} onClick={() => onClose()} text={t("dialog_create.labels.cancel")} />
                <Button
                  loading={isSubmitting}
                  type="submit"
                  intent="primary"
                  text={t("dialog_create.labels.confirm")}
                />
              </div>
            </div>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};
