import {
  Button,
  Classes,
  Dialog,
  FormGroup,
  InputGroup,
  Spinner,
  TextArea,
} from "@blueprintjs/core";
import { InputMask, useClient } from "components";
import { toaster } from "components/toaster";
import { Formik } from "formik";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import _get from "lodash.get";

const initialValues = {
  name: "",
  address: "",
  phone_number: "",
};

export const DialogAdd = ({
  initialValue = initialValues,
  isOpen,
  onClose = () => {},
  onSubmitted = () => {},
}) => {
  const client = useClient();

  const { t } = useTranslation("customers-page");

  const Schema = useMemo(
    () =>
      Yup.object().shape({
        name: Yup.string().required(t("dialog_add.form.name.error_message")),
        address: Yup.string().required(
          t("dialog_add.form.address.error_message")
        ),
        phone_number: Yup.string().required(
          t("dialog_add.form.phone_number.error_message")
        ),
      }),
    [t]
  );

  return (
    <Dialog
      enforceFocus={false}
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
      title={t("dialog_add.title")}
    >
      <Formik
        validationSchema={Schema}
        validateOnChange={false}
        initialValues={{
          ...initialValues,
          ...initialValue,
        }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const toast = toaster.show({
              intent: "info",
              icon: <Spinner className={Classes.ICON} size={16} />,
              message: `Creating new Customer`,
            });
            const res = await client["customers"].create(values);
            onClose();
            await onSubmitted(res);
            toaster.dismiss(toast);
            toaster.show({
              intent: "success",
              message: "Customer created",
            });
          } catch (err) {
            console.error(err);
            setSubmitting(false);
            toaster.show({
              icon: "cross",
              intent: "danger",
              message: err.message,
            });
          }
        }}
      >
        {({ values, errors, isSubmitting, handleSubmit, handleChange }) => (
          <form onSubmit={handleSubmit}>
            <div className={Classes.DIALOG_BODY}>
              <FormGroup
                label={t("dialog_add.form.name.label")}
                labelFor="f-name"
                helperText={errors["name"]}
                intent={"danger"}
              >
                <InputGroup
                  id="f-name"
                  name="name"
                  value={values["name"]}
                  onChange={handleChange}
                  intent={errors["name"] ? "danger" : "none"}
                />
              </FormGroup>
              <FormGroup
                label={t("dialog_add.form.phone_number.label")}
                labelFor="f-phone_number"
                helperText={errors["phone_number"]}
                intent={"danger"}
              >
                <InputMask
                  mask={[
                    { mask: "+{62} 000-000-0000" },
                    { mask: "+{62} 000-0000-0000" },
                  ]}
                  value={_get(values, "phone_number")}
                  onChange={handleChange}
                >
                  {({ ref }) => (
                    <InputGroup
                      inputRef={ref}
                      id="f-phone_number"
                      name="phone_number"
                      intent={errors["phone_number"] ? "danger" : "none"}
                    />
                  )}
                </InputMask>
              </FormGroup>
              <FormGroup
                label={t("dialog_add.form.address.label")}
                labelFor="f-address"
                helperText={errors["address"]}
                intent={"danger"}
              >
                <TextArea
                  fill={true}
                  growVertically={true}
                  id="f-address"
                  name="address"
                  value={values["address"]}
                  onChange={handleChange}
                  intent={errors["address"] ? "danger" : "none"}
                />
              </FormGroup>
            </div>
            <div className={Classes.DIALOG_FOOTER}>
              <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                <Button
                  minimal={true}
                  onClick={() => onClose()}
                  text={t("dialog_add.form.close_button")}
                />
                <Button
                  loading={isSubmitting}
                  type="submit"
                  intent="primary"
                  text={t("dialog_add.form.submit_button")}
                />
              </div>
            </div>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};
