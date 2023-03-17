import {
  Button,
  Classes,
  Dialog,
  FormGroup,
  InputGroup,
  Spinner,
} from "@blueprintjs/core";
import { useClient } from "components";
import { toaster } from "components/toaster";
import { Formik } from "formik";
import * as Yup from "yup";
import _get from "lodash.get";
import { useMemo } from "react";
import { DialogForm } from "./Dialog.Form";
import { useTranslation } from "react-i18next";

export const DialogEdit = ({
  data,
  isOpen,
  onClose = () => {},
  onSubmitted = () => {},
}) => {
  const { t } = useTranslation("products-page");
  const client = useClient();

  const Schema = useMemo(
    () =>
      Yup.object().shape({
        name: Yup.string().required(t("dialog_form.name.error_message")),
        code: Yup.string().required(t("dialog_form.code.error_message")),
        price: Yup.number().required(t("dialog_form.price.error_message")),
        discount: Yup.number(),
        category_id: Yup.number().required(
          t("dialog_form.category.error_message")
        ),
        quantity: Yup.number().required(
          t("dialog_form.quantity.error_message")
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
      title={t("dialog_edit.title")}
    >
      <Formik
        validationSchema={Schema}
        validateOnChange={false}
        initialValues={{
          name: _get(data, "name"),
          code: _get(data, "code"),
          price: _get(data, "price"),
          category_id: _get(data, "category.id"),
          discount: _get(data, "discount"),
          quantity: _get(data, "quantity"),
        }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const toast = toaster.show({
              intent: "info",
              icon: <Spinner className={Classes.ICON} size={16} />,
              message: `Submit changes`,
            });
            const res = await client["items"].patch(data["id"], values);
            onClose();
            await onSubmitted(res);
            toaster.dismiss(toast);
            toaster.show({
              intent: "success",
              message: "Product updated",
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
        {({ handleSubmit, isSubmitting, values, errors }) => (
          <form onSubmit={handleSubmit}>
            <div className={Classes.DIALOG_BODY}>
              <FormGroup
                label={t("dialog_form.stock.label")}
                labelFor="f-stock"
                helperText={errors["stock"]}
                intent={"danger"}
              >
                <InputGroup
                  readOnly={true}
                  id="f-stock"
                  name="stock"
                  defaultValue={_get(data, "quantity")}
                  intent={errors["stock"] ? "danger" : "none"}
                />
              </FormGroup>
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
