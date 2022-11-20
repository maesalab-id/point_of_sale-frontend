import { useTranslation } from "react-i18next";
import {
  Button,
  Classes,
  Dialog,
  Text,
  Divider,
  ButtonGroup,
} from "@blueprintjs/core";
import { useClient } from "components";
import { toaster } from "components/toaster";
import { useMutation } from "react-query";

export const DialogReceived = (props) => {
  const { isOpen, data, onClose = () => {}, onConfirm = () => {} } = props;
  const { t } = useTranslation("orders-page");
  const client = useClient();
  const { mutate, isLoading } = useMutation(
    () =>
      client["orders"]
        .patch(data.id, { received: true })
        .then((resp) => {
          console.log(resp);
          onConfirm?.();
          return resp;
        })
        .catch((err) => {
          toaster.show({
            icon: "cross",
            intent: "danger",
            message: err.message,
          });
          throw err;
        }),
    {
      onSuccess: () => {
        onConfirm?.();
      },
    }
  );

  return (
    <Dialog
      isOpen={isOpen}
      onClose={isLoading ? undefined : onClose}
      title={t("received_dialog.title", {
        order_number: data.order_number,
      })}
    >
      <div className={Classes.DIALOG_BODY}>
        <Text>
          {t("received_dialog.labels.confirm_text", {
            order_number: data.order_number,
          })}
        </Text>
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <ButtonGroup>
          <Button
            loading={isLoading}
            disabled={isLoading}
            onClick={mutate}
            intent="success"
          >
            {t("received_dialog.labels.confirm")}
          </Button>
          <Divider />
          <Button disabled={isLoading} onClick={onClose}>
            {t("received_dialog.labels.cancel")}
          </Button>
        </ButtonGroup>
      </div>
    </Dialog>
  );
};
