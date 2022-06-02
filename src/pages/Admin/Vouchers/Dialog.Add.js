import { Button, Classes, Dialog, Spinner } from "@blueprintjs/core";
import { useClient } from "components";
import { toaster } from "components/toaster";
import { Formik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { DialogForm } from "./Dialog.Form";
import { useMemo } from "react";

const initialValues = {
  name: "",
  value: "",
  start: moment().startOf("day").toDate(),
  end: moment().endOf("day").add(1, "month").toDate(),
};

export const DialogAdd = ({
  initialValue = initialValues,
  isOpen,
  onClose = () => {},
  onSubmitted = () => {},
}) => {
  const client = useClient();

  const { t } = useTranslation("vouchers-page");

  const Schema = useMemo(
    () =>
      Yup.object().shape({
        name: Yup.string().required(t("dialog_form.name.error_message")),
        value: Yup.number().required(t("dialog_form.discount.error_message")),
        start: Yup.date().required(),
        end: Yup.date().required(),
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
              message: `Creating new Voucher`,
            });
            const res = await client["vouchers"].create(values);
            onClose();
            await onSubmitted(res);
            toaster.dismiss(toast);
            toaster.show({
              intent: "success",
              message: "Voucher created",
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
