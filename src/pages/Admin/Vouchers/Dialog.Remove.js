import { useClient } from "components";
import { DialogRemove as BaseDialogRemove } from "components/common";
import { toaster } from "components/toaster";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export const DialogRemove = (props) => {
  const { isOpen, data, onClose = () => {}, onSubmitted = () => {} } = props;
  const { t } = useTranslation("vouchers-page");
  const client = useClient();
  const onSubmit = useCallback(async (values, { setSubmitting, setErrors }) => {
    try {
      console.log(values);
      // onClose();
      // onSubmitted();
    } catch (err) {
      console.error(err.message);
      setErrors({ submit: err.message });
      setSubmitting(false);
      toaster.show({
        intent: "danger",
        message: err.message,
      });
    }
  }, []);
  return (
    <BaseDialogRemove
      isOpen={isOpen}
      onClose={onClose}
      data={data}
      title={t("dialog_remove.title")}
      onSubmit={onSubmit}
    />
  );
};
