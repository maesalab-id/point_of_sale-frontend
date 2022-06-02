import { Button, Classes, Dialog, Spinner } from "@blueprintjs/core";
import { toaster } from "components/toaster";
import { Formik } from "formik";
import * as Yup from "yup";
import _get from "lodash.get";
import { useClient } from "components";
import { useTranslation } from "react-i18next";
import { DialogForm } from "./Dialog.Form";

const Schema = Yup.object().shape({
  name: Yup.string().required(),
  username: Yup.string().required(),
  password: Yup.string(),
  confirm_password: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Password must match"
  ),
  type: Yup.string().oneOf(["administrator", "cashier", "inventory"]),
  show_password: Yup.boolean(),
});

export const DialogEdit = ({
  data,
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
      title={t("dialog_edit.title")}
    >
      <Formik
        validationSchema={Schema}
        validateOnChange={false}
        initialValues={{
          name: _get(data, "name"),
          username: _get(data, "username"),
          password: undefined,
          confirm_password: undefined,
          show_password: false,
          type: _get(data, "type"),
        }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const toast = toaster.show({
              intent: "info",
              icon: <Spinner className={Classes.ICON} size={16} />,
              message: `Submit changes`,
            });
            const res = await client["users"].patch(data["id"], values);
            onClose();
            await onSubmitted(res);
            toaster.dismiss(toast);
            toaster.show({
              intent: "success",
              message: "User updated",
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
