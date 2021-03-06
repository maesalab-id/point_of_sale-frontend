import { Button, Classes, Dialog, Spinner } from "@blueprintjs/core";
import { useClient } from "components";
import { toaster } from "components/toaster";
import { Formik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { DialogForm } from "./Dialog.Form";

const Schema = Yup.object().shape({
  name: Yup.string().required(),
  username: Yup.string().required(),
  password: Yup.string().required(),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("password"), null], "Password must match")
    .required(),
  type: Yup.string().oneOf(["administrator", "cashier", "inventory"]),
  show_password: Yup.boolean(),
});

export const DialogAdd = ({
  isOpen,
  onClose = () => {},
  onSubmitted = () => {},
}) => {
  const { t } = useTranslation("users-page");
  const client = useClient();

  return (
    <Dialog
      enforceFocus={false}
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
      title="Tambah User Baru"
    >
      <Formik
        validationSchema={Schema}
        validateOnChange={false}
        enableReinitialize={true}
        initialValues={{
          name: "",
          username: "",
          password: "",
          confirm_password: "",
          show_password: false,
          type: "administrator",
        }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const toast = toaster.show({
              intent: "info",
              icon: <Spinner className={Classes.ICON} size={16} />,
              message: `Creating new User`,
            });
            const res = await client["users"].create(values);
            onClose();
            await onSubmitted(res);
            toaster.dismiss(toast);
            toaster.show({
              intent: "success",
              message: "User created",
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
