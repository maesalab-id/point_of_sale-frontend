import {
  Button,
  Classes,
  Dialog,
  FormGroup,
  InputGroup,
  TextArea,
} from "@blueprintjs/core";
import { useClient, InputMask } from "components";
import { toaster } from "components/toaster";
import { Formik } from "formik";
import * as Yup from "yup";
import _get from "lodash.get";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

export const DialogEdit = ({
  data,
  isOpen,
  onClose = () => {},
  onSubmitted = () => {},
}) => {
  const client = useClient();
  const { t } = useTranslation("customers-page");

  const Schema = useMemo(
    () =>
      Yup.object().shape({
        name: Yup.string().required(t("dialog_edit.form.name.error_message")),
        address: Yup.string().required(
          t("dialog_edit.form.address.error_message")
        ),
        phone_number: Yup.string()
          .matches(
            /^\+?([ -]?\d+)+|\(\d+\)([ -]\d+)$/,
            t("dialog_edit.form.phone_number.error_message.matches")
          )
          .required(t("dialog_edit.form.phone_number.error_message.required")),
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
      title={t("dialog_edit.title")}
    >
      <Formik
        validationSchema={Schema}
        // validateOnChange={false}
        initialValues={{
          name: _get(data, "name"),
          address: _get(data, "address"),
          phone_number: _get(data, "phone_number"),
        }}
        onSubmit={async (values, { setSubmitting }) => {
          console.log(values);
          return;
          try {
            const res = await client["customers"].patch(data["id"], values);
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
          dirty,
          handleSubmit,
          handleChange,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <div className={Classes.DIALOG_BODY}>
              <FormGroup
                label={t("dialog_edit.form.name.label")}
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
                label={t("dialog_edit.form.phone_number.label")}
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
                label={t("dialog_edit.form.address.label")}
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
                  text={t("dialog_edit.form.close_button")}
                />
                <Button
                  disabled={!dirty}
                  loading={isSubmitting}
                  type="submit"
                  intent="primary"
                  text={t("dialog_edit.form.submit_button")}
                />
              </div>
            </div>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};
