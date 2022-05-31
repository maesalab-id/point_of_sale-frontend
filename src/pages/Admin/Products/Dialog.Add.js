import { Button, Classes, Dialog } from "@blueprintjs/core";
import { useClient } from "components";
import { toaster } from "components/toaster";
import { Formik } from "formik";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { DialogForm } from "./Dialog.Form";

const initialValues = {
  name: "",
  code: "",
  price: 0,
  quantity: 0,
  category_id: undefined,
};

export const DialogAdd = ({
  isOpen,
  onClose = () => {},
  onSubmitted = () => {},
}) => {
  const client = useClient();
  const { t } = useTranslation("products-page");

  const Schema = useMemo(
    () =>
      Yup.object().shape({
        name: Yup.string().required(t("dialog_form.name.error_message")),
        code: Yup.string().required(t("dialog_form.code.error_message")),
        price: Yup.number().required(t("dialog_form.price.error_message")),
        quantity: Yup.number().required(
          t("dialog_form.quantity.error_message")
        ),
        category_id: Yup.number().required(
          t("dialog_form.category.error_message")
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
            const res = await client["items"].create(values);
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
        {({ isSubmitting, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className={Classes.DIALOG_BODY}>
              <DialogForm />
            </div>
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
