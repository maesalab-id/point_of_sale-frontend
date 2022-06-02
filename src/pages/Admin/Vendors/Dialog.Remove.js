import { DialogRemove as BaseDialogRemove } from "components/common";
import { useClient } from "components";
import { toaster } from "components/toaster";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";
import { Classes, Spinner } from "@blueprintjs/core";

export const DialogRemove = (props) => {
  const {
    isOpen,
    data,
    onClose = () => {},
    onSubmit = () => {},
    onSubmitted = () => {},
  } = props;
  const { t } = useTranslation("vendors-page");
  const client = useClient();

  const handleSubmit = useCallback(
    async (values, { setSubmitting, setErrors }) => {
      try {
        const toast = toaster.show({
          intent: "info",
          icon: <Spinner className={Classes.ICON} size={16} />,
          message: `Deleting vendor`,
        });
        await onSubmit(data);
        const res = await client["vendors"].remove(data);
        onClose();
        await onSubmitted(res);
        toaster.dismiss(toast);
        toaster.show({
          icon: "tick",
          intent: "success",
          message: `Vendor deleted`,
        });
      } catch (err) {
        console.error(err.message);
        setErrors({ submit: err.message });
        setSubmitting(false);
        toaster.show({
          icon: "cross",
          intent: "danger",
          message: err.message,
        });
      }
    },
    [client, data, onClose, onSubmit, onSubmitted]
  );

  return (
    <BaseDialogRemove
      isOpen={isOpen}
      onClose={onClose}
      data={data}
      title={t("dialog_remove.title")}
      onSubmit={handleSubmit}
    />
  );
};
