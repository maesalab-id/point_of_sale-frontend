import React, { useEffect, useState, useMemo } from "react";
import {
  Dialog,
  Button,
  Classes,
  Spinner,
  NumericInput,
  RadioGroup,
  Radio,
  FormGroup,
} from "@blueprintjs/core";
import { useTranslation } from "react-i18next";
import { Box, Divider, Flex, useClient } from "components";
import { get as _get } from "lodash";
import { useMutation, useQuery } from "react-query";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import * as yup from "yup";
import { toaster } from "components/toaster";

const DialogReturn = ({
  isOpen,
  data,
  onClose = () => {},
  onConfirm = () => {},
}) => {
  const { t } = useTranslation("receipts-page");
  const client = useClient();
  const [items, setItems] = useState([]);
  const { mutate, isLoading: submitting } = useMutation(
    async (val) => {
      console.log(val);
      return await client["returns"]
        .create({
          receipt_id: data.id,
          items: val.items
            .filter((item) => item.return_quantity > 0)
            .map((item) => ({
              receipt_item_id: item.id,
              item_id: item.item.id,
              quantity: item.return_quantity,
              type: item.type,
              price: item.price,
            })),
        })
        .then((resp) => resp)
        .catch((e) => {
          throw e;
        });
    },
    {
      onSuccess: (data) => {
        console.log(data);
        onConfirm?.();
        onClose?.();
        toaster.clear();
      },
      onMutate: () => {
        toaster.show({
          message: "Returning items",
          intent: 'primary',
        });
      },
    }
  );

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        items: yup.array().of(
          yup.object().shape({
            return_quantity: yup.number(),
            type: yup.string().when("return_quantity", {
              is: (quantity) => quantity > 0,
              then: yup
                .string(t("return_dialog.labels.errors.type"))
                .required(t("return_dialog.labels.errors.type")),
            }),
          })
        ),
      }),
    [t]
  );

  const { data: receipt, isLoading } = useQuery(
    ["return-item", data.id],
    ({ queryKey: [, id] }) =>
      client["receipts"]
        .get(id, {
          query: {
            $select: [
              "receipt_number",
              "tax",
              "vendor",
              "receipt_items",
              "customer",
              "customer_id",
              "created_at",
            ],
            $include: [
              {
                model: "receipt_items",
                $select: ["price", "quantity", "id"],
                $include: [
                  {
                    model: "items",
                    $select: ["name", "code", "id"],
                  },
                ],
              },
              {
                model: "customers",
                $select: ["name", "phone_number"],
              },
            ],
          },
        })
        .then((resp) => {
          console.log(resp);
          return resp;
        })
  );

  useEffect(() => {
    if (typeof receipt !== "undefined") {
      setItems(
        receipt.receipt_items.map((item) => ({
          ...item,
          return_quantity: 0,
          type: undefined,
        }))
      );
    }
  }, [receipt]);

  return (
    <Dialog
      title={t("toolbar.return")}
      isOpen={isOpen}
      onClose={submitting ? undefined : onClose}
    >
      {!isLoading && items.length > 0 && (
        <Formik
          onSubmit={mutate}
          validationSchema={validationSchema}
          initialValues={{ items }}
        >
          {({ values }) => (
            <Form>
              <div className={Classes.DIALOG_BODY}>
                <Box className={Classes.CARD} sx={{ px: 0, py: 2 }}>
                  {isLoading ? (
                    <Spinner size={70} />
                  ) : (
                    <Box>
                      <FieldArray name="items">
                        {({ form: { errors, setFieldValue } }) =>
                          values.items.map((item, id) => (
                            <React.Fragment key={`receipt-item-return-${id}`}>
                              <Flex sx={{ px: 2, mb: 2, gap: 12 }}>
                                <Box sx={{ flexGrow: 1 }}>
                                  <Box sx={{ mr: 2 }}>
                                    {_get(item, "item.name")}
                                  </Box>
                                  <Box
                                    sx={{
                                      fontSize: 0,
                                      color: "gray.5",
                                      marginBottom: 10,
                                    }}
                                  >
                                    {_get(item, "item.code")} {"("}x{" "}
                                    {_get(item, "quantity")} buah
                                    {")"}
                                  </Box>
                                  <Field name={`items.${id}.type`}>
                                    {({
                                      field: { value, onChange, name },
                                      meta: { error },
                                    }) => (
                                      <FormGroup
                                        helperText={
                                          <ErrorMessage
                                            name={`items.${id}.type`}
                                          />
                                        }
                                        intent="danger"
                                      >
                                        <RadioGroup
                                          label={t(
                                            "return_dialog.labels.reason"
                                          )}
                                          name={name}
                                          onChange={onChange}
                                          selectedValue={value}
                                        >
                                          <Radio
                                            label={t(
                                              "return_dialog.labels.reasons.error"
                                            )}
                                            value="error"
                                          />
                                          <Radio
                                            label={t(
                                              "return_dialog.labels.reasons.damaged"
                                            )}
                                            value="damaged"
                                          />
                                        </RadioGroup>
                                      </FormGroup>
                                    )}
                                  </Field>
                                </Box>
                                <Box sx={{ alignSelf: "center" }}>
                                  <Field name={`items.${id}.return_quantity`}>
                                    {({ field }) => (
                                      <NumericInput
                                        max={item.quantity}
                                        min={0}
                                        name={field.name}
                                        onValueChange={(val) =>
                                          setFieldValue(
                                            `items.${id}.return_quantity`,
                                            val
                                          )
                                        }
                                        value={field.value}
                                        defaultValue={0}
                                      />
                                    )}
                                  </Field>
                                </Box>
                              </Flex>
                              <Divider />
                            </React.Fragment>
                          ))
                        }
                      </FieldArray>
                    </Box>
                  )}
                </Box>
              </div>
              <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                  <Button onClick={onClose} icon="time" intent="danger">
                    {t("return_dialog.labels.cancel")}
                  </Button>
                  <Button
                    type="submit"
                    loading={submitting}
                    icon="undo"
                    intent="warning"
                  >
                    {t("return_dialog.labels.confirm")}
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </Dialog>
  );
};

export default DialogReturn;
