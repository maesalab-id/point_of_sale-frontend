import { Button, Classes, Dialog, Spinner } from "@blueprintjs/core";
import { useClient } from "components";
import { toaster } from "components/toaster";
import { Formik } from "formik";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { DialogForm } from "./Dialog.Form";

const initialValues = {
  name: "",
  address: "",
  phone_number: "",
};

export const DialogAdd = ({
  isOpen,
  onClose = () => {},
  onSubmitted = () => {},
}) => {
  const client = useClient();
  const { t } = useTranslation("vendors-page");

  const Schema = useMemo(
    () =>
      Yup.object().shape({
        name: Yup.string().required(t("dialog_form.name.error_message")),
        address: Yup.string().required(t("dialog_form.address.error_message")),
        phone_number: Yup.string().required(
          t("dialog_form.phone_number.error_message")
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
        initialValues={initialValues}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const toast = toaster.show({
              intent: "info",
              icon: <Spinner className={Classes.ICON} size={16} />,
              message: `Creating new Vendor`,
            });
            const res = await client["vendors"].create(values);
            onClose();
            await onSubmitted(res);
            toaster.dismiss(toast);
            toaster.show({
              intent: "success",
              message: "Vendor created",
            });
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
        {({ isSubmitting, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <DialogForm />
            <div className={Classes.DIALOG_FOOTER}>
              <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                <Button
                  minimal={true}
                  onClick={() => onClose()}
                  text={t("dialog_form.close_button")}
                />
                <Button
                  loading={isSubmitting}
                  type="submit"
                  intent="primary"
                  text={t("dialog_form.submit_button")}
                />
              </div>
            </div>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};
