import {
  Button,
  Classes,
  Dialog,
  FormGroup,
  InputGroup,
  Spinner,
  Tag,
} from "@blueprintjs/core";
import { useClient } from "components";
import { toaster } from "components/toaster";
import { Formik, useFormikContext } from "formik";
import * as Yup from "yup";
import _get from "lodash.get";
import { useMemo } from "react";
import currency from "currency.js";
import { CURRENCY_OPTIONS } from "components/constants";
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
        {() => <DialogEditInfoAndDiscount data={data} onClose={onClose} />}
      </Formik>
    </Dialog>
  );
};

const DialogEditInfoAndDiscount = (props) => {
  const { data, onClose } = props;
  const { t } = useTranslation("products-page");
  const { values, errors, isSubmitting, handleSubmit, handleChange } =
    useFormikContext();

  const extras = useMemo(() => {
    const discount_price = values.price * (values.discount / 100) || 0;
    const price_discounted = values.price - discount_price;
    return {
      discount_price,
      price_discounted,
    };
  }, [values.discount, values.price]);

  return (
    <form onSubmit={handleSubmit}>
      <div className={Classes.DIALOG_BODY}>
        <DialogForm />
        <h6 className={Classes.HEADING}>{t("dialog_form.title_2")}</h6>
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
            value={_get(data, "quantity")}
            onChange={handleChange}
            intent={errors["stock"] ? "danger" : "none"}
          />
        </FormGroup>
        <FormGroup
          label={t("dialog_form.discount.label")}
          labelFor="f-discount"
          helperText={errors["discount"]}
          intent={"danger"}
        >
          <InputGroup
            id="f-discount"
            name="discount"
            value={values["discount"] || ""}
            onChange={handleChange}
            intent={errors["discount"] ? "danger" : "none"}
            rightElement={<Tag minimal={true}>%</Tag>}
          />
        </FormGroup>
        <FormGroup
          label={t("dialog_form.discounted.label")}
          labelFor="f-price_discounted"
          helperText={errors["price_discounted"]}
          intent={"danger"}
        >
          <InputGroup
            id="f-price_discounted"
            name="price_discounted"
            readOnly={true}
            value={currency(
              extras["price_discounted"],
              CURRENCY_OPTIONS
            ).format()}
            onChange={handleChange}
            intent={errors["price_discounted"] ? "danger" : "none"}
            rightElement={
              <Tag minimal={true}>
                {currency(
                  extras["discount_price"] * -1,
                  CURRENCY_OPTIONS
                ).format()}
              </Tag>
            }
          />
        </FormGroup>
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
  );
};
