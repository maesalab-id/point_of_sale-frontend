import {
  Button,
  Classes,
  Dialog,
  FormGroup,
  InputGroup,
  Tag,
} from "@blueprintjs/core";
import _get from "lodash.get";
import { useMemo } from "react";
import currency from "currency.js";
import { CURRENCY_OPTIONS } from "components/constants";
import { useTranslation } from "react-i18next";

export const DialogDetails = ({ data, isOpen, onClose = () => {} }) => {
  const { t } = useTranslation("products-page");

  const extras = useMemo(() => {
    const discount_price = data.price * (data.discount / 100) || 0;
    const price_discounted = data.price - discount_price;
    return {
      discount_price,
      price_discounted,
    };
  }, [data]);

  return (
    <Dialog
      enforceFocus={false}
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
      title="Detail Product"
    >
      <div className={Classes.DIALOG_BODY}>
        <h6 className={Classes.HEADING}>{t("dialog_form.title_1")}</h6>
        <FormGroup label={t("dialog_form.code.label")} labelFor="f-code">
          <InputGroup
            readOnly={true}
            id="f-code"
            name={"code"}
            value={_get(data, "code")}
          />
        </FormGroup>
        <FormGroup label={t("dialog_form.name.label")} labelFor="f-name">
          <InputGroup
            readOnly={true}
            id="f-name"
            name="name"
            value={_get(data, "name")}
          />
        </FormGroup>
        <FormGroup label={t("dialog_form.price.label")} labelFor="f-price">
          <InputGroup
            readOnly={true}
            id="f-price"
            name="price"
            value={_get(data, "price")}
          />
        </FormGroup>
        <h6 className={Classes.HEADING}>{t("dialog_form.title_2")}</h6>
        <FormGroup label={t("dialog_form.quantity.label")} labelFor="f-stock">
          <InputGroup
            readOnly={true}
            id="f-stock"
            name="stock"
            value={_get(data, "quantity")}
            intent={_get(data, "quantity") > 1 ? "none" : "danger"}
          />
        </FormGroup>
        <FormGroup label={t("dialog_form.discount.label")} labelFor="f-discount">
          <InputGroup
            readOnly={true}
            id="f-discount"
            name="discount"
            value={_get(data, "discount") || ""}
            rightElement={<Tag minimal={true}>%</Tag>}
          />
        </FormGroup>
        <FormGroup label={t("dialog_form.discounted.label")} labelFor="f-price_discounted">
          <InputGroup
            readOnly={true}
            id="f-price_discounted"
            name="price_discounted"
            value={currency(
              extras["price_discounted"],
              CURRENCY_OPTIONS
            ).format()}
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
        <FormGroup label={t("dialog_form.category.label")} labelFor="f-category">
          <InputGroup
            readOnly={true}
            id="f-category"
            name="category"
            value={_get(data, "category.name")}
          />
        </FormGroup>
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button minimal={true} onClick={() => onClose()} text="Close" />
        </div>
      </div>
    </Dialog>
  );
};
