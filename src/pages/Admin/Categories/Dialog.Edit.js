import {
  Button,
  Classes,
  Dialog,
} from "@blueprintjs/core";
import { useClient } from "components";
import { toaster } from "components/toaster";
import { Formik } from "formik";
import * as Yup from "yup";
import _get from "lodash.get";
import { DialogForm } from "./Dialog.Form";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

export const DialogEdit = ({
  data,
  isOpen,
  onClose = () => {},
  onSubmitted = () => {},
}) => {
  const { t } = useTranslation("categories-page");
  const client = useClient();

  const Schema = useMemo(
    () =>
      Yup.object().shape({
        name: Yup.string().required(t("dialog_form.name.error_message")),
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
        initialValues={{
          name: _get(data, "name"),
        }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const res = await client["categories"].patch(data["id"], values);
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
        {({ values, errors, isSubmitting, handleSubmit, handleChange }) => (
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
