import { DialogRemove as BaseDialogRemove } from "components/common";
import { useClient } from "components";
import { toaster } from "components/toaster";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";

export const DialogRemove = (props) => {
  const { isOpen, data, onClose = () => {}, onSubmitted = () => {} } = props;
  const { t } = useTranslation("products-page");
  const client = useClient();

  const onSubmit = useCallback(
    async (values, { setSubmitting, setErrors }) => {
      try {
        const res = client["items"].remove(data);
        onClose();
        onSubmitted(res);
      } catch (err) {
        console.error(err.message);
        setErrors({ submit: err.message });
        setSubmitting(false);
        toaster.show({
          intent: "danger",
          message: err.message,
        });
      }
    },
    [client, data, onClose, onSubmitted]
  );

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
