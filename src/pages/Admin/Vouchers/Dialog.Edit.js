import { Button, Classes, Dialog, Spinner } from "@blueprintjs/core";
import { useClient } from "components";
import { toaster } from "components/toaster";
import { Formik } from "formik";
import * as Yup from "yup";
import _get from "lodash.get";
import moment from "moment";
import { DialogForm } from "./Dialog.Form";
import { useTranslation } from "react-i18next";

const Schema = Yup.object().shape({
  name: Yup.string().required(),
  value: Yup.number().required(),
  start: Yup.date().required(),
  end: Yup.date().required(),
});

export const DialogEdit = ({
  data,
  isOpen,
  onClose = () => {},
  onSubmitted = () => {},
}) => {
  const client = useClient();
  const { t } = useTranslation("vouchers-page");
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
          value: _get(data, "value"),
          start: moment(_get(data, "start"), "YYYY-MM-DD")
            .startOf("day")
            .toDate(),
          end: moment(_get(data, "end"), "YYYY-MM-DD").endOf("day").toDate(),
        }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const toast = toaster.show({
              intent: "info",
              icon: <Spinner className={Classes.ICON} size={16} />,
              message: `Submit changes`,
            });
            const res = await client["vouchers"].patch(data["id"], values);
            onClose();
            await onSubmitted(res);
            toaster.dismiss(toast);
            toaster.show({
              intent: "success",
              message: "Voucher updated",
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
