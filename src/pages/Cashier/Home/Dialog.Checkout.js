import { Button, Classes, Dialog, FormGroup } from "@blueprintjs/core";
import { Box, Divider, FetchAndSelect, Flex, State, useClient } from "components";
import { CURRENCY_OPTIONS } from "components/constants";
import { toaster } from "components/toaster";
import currency from "currency.js";
import { Formik } from "formik";
import { DialogAdd as CheckoutDialogAdd } from "pages/Admin/Customers/Dialog.Add";
import * as Yup from "yup";
import _get from "lodash.get";

const Schema = Yup.object().shape({
  "customer_id": Yup.string().required(),
});

const initialValues = {
  "customer_id": "",
}

export const DialogCheckout = ({
  initialValue = initialValues,
  data,
  price,
  isOpen,
  onClose = () => { },
  onSubmitted = () => { }
}) => {
  const client = useClient();

  return (
    <Dialog
      enforceFocus={false}
      isOpen={isOpen}
      onClose={() => { onClose() }}
      title="Confirm your order"
    >
      <Formik
        validationSchema={Schema}
        initialValues={{
          ...initialValues,
          ...initialValue
        }}
        onSubmit={async (values) => {
          onClose();
          onSubmitted(values);
        }}
      >
        {({ values, errors, isSubmitting, handleSubmit, setFieldValue }) =>
          <form onSubmit={handleSubmit}>
            <div className={Classes.DIALOG_BODY}>
              <State
                initialValue={{
                  isOpen: false,
                  query: ""
                }}
              >
                {([state, setState]) => <>
                  <FormGroup
                    label="Customer"
                    labelFor="f-customer_id"
                    helperText={errors["customer_id"]}
                    intent={"danger"}
                  >
                    <FetchAndSelect
                      allowCreateItem={true}
                      service={client["customers"]}
                      id="f-customer_id"
                      name="customer_id"
                      value={values["customer_id"]}
                      intent={errors["customer_id"] ? "danger" : "none"}
                      onChange={async ({ value }) => {
                        await setFieldValue("customer_id", value);
                      }}
                      onCreateNew={(query) => {
                        setState({
                          isOpen: true,
                          query
                        })
                      }}
                      onPreFetch={(q, query) => {
                        return {
                          ...query,
                          $or: q ? {
                            "name": q ? {
                              $iLike: `%${q}%`
                            } : undefined,
                            "phone_number": q ? {
                              $iLike: `%${q}%`
                            } : undefined,
                          } : undefined,
                          $select: ["id", "name", "phone_number"]
                        }
                      }}
                      onFetched={(items) => {
                        return items.map((item) => {
                          return {
                            label: item["name"],
                            value: `${item["id"]}`,
                            info: `${item["phone_number"]}`,
                          }
                        })
                      }}
                    />
                  </FormGroup>
                  <CheckoutDialogAdd
                    isOpen={state.isOpen}
                    initialValue={{
                      name: state.query
                    }}
                    onClose={() => {
                      setState(s => ({ ...s, isOpen: false }));
                    }}
                    onSubmitted={() => {
                      toaster.show({
                        intent: "success",
                        message: "Customer created"
                      });
                    }}
                  />
                </>}
              </State>
              <Box className={Classes.CARD} sx={{ px: 0, py: 2, mb: 3, }}>
                <Flex sx={{ px: 2, mb: 2 }}>
                  <Box sx={{ flexGrow: 1 }}>Subtotal</Box>
                  <Box>{currency(price["subtotal"], CURRENCY_OPTIONS).format()}</Box>
                </Flex>
                <Flex sx={{ px: 2 }}>
                  <Box sx={{ flexGrow: 1 }}>Tax (10%)</Box>
                  <Box>{currency(price["tax"], CURRENCY_OPTIONS).format()}</Box>
                </Flex>
                <Divider />
                <Flex sx={{ px: 2, fontSize: 2, fontWeight: "bold" }}>
                  <Box sx={{ flexGrow: 1 }}>Total</Box>
                  <Box>{currency(price["total"], CURRENCY_OPTIONS).format()}</Box>
                </Flex>
              </Box>
            </div>
            <div className={Classes.DIALOG_FOOTER}>
              <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                <Button
                  minimal={true}
                  onClick={() => onClose()}
                  text="Cancel"
                />
                <Button
                  loading={isSubmitting}
                  type="submit"
                  intent="primary"
                  text="Checkout"
                />
              </div>
            </div>
          </form>
        }
      </Formik>
    </Dialog>
  )
}