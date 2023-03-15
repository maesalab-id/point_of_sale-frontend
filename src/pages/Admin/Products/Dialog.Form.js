import { Classes, FormGroup, InputGroup, Tag } from "@blueprintjs/core";
import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";
import { DialogAdd as CategoryDialogAdd } from "../Categories/Dialog.Add";
import { FetchAndSelect, State, useClient } from "components";
import { toaster } from "components/toaster";
import { useMemo } from "react";
import { CURRENCY_OPTIONS, isDev } from "components/constants";
import currency from "currency.js";
import FileUpload from "components/FileUpload";

export const DialogForm = () => {
  const client = useClient();
  const { values, errors, handleChange, setFieldValue } = useFormikContext();
  const { t } = useTranslation("products-page");

  const extras = useMemo(() => {
    const discount_price = values.price * (values.discount / 100) || 0;
    const price_discounted = values.price - discount_price;
    return {
      discount_price,
      price_discounted,
    };
  }, [values.discount, values.price]);

  return (
    <>
      <h6 className={Classes.HEADING}>{t("dialog_form.title_1")}</h6>
      <State
        initialValue={{
          isOpen: false,
          query: "",
        }}
      >
        {([state, setState]) => (
          <>
            <FormGroup
              label={t("dialog_form.category.label")}
              labelFor="f-category_id"
              helperText={errors["category_id"]}
              intent={"danger"}
            >
              <FetchAndSelect
                initialValue={values["category_id"]}
                allowCreateItem={true}
                service={client["categories"]}
                id="f-category_id"
                name="category_id"
                value={values["category_id"]}
                intent={errors["category_id"] ? "danger" : "none"}
                onChange={async ({ value }) => {
                  await setFieldValue("category_id", value);
                }}
                onCreateNew={(query) => {
                  setState({
                    isOpen: true,
                    query,
                  });
                }}
                onPreFetch={(q, query) => {
                  return {
                    ...query,
                    name: q
                      ? {
                          [isDev ? "$iLike" : "$like"]: `%${q}%`,
                        }
                      : undefined,
                    $select: ["id", "name"],
                  };
                }}
                onFetched={(items) => {
                  return items.map((item) => {
                    return {
                      label: item["name"],
                      value: `${item["id"]}`,
                    };
                  });
                }}
              />
            </FormGroup>
            <CategoryDialogAdd
              isOpen={state.isOpen}
              initialValue={{
                name: state.query,
              }}
              onClose={() => {
                setState((s) => ({ ...s, isOpen: false }));
              }}
              onSubmitted={() => {
                toaster.show({
                  intent: "success",
                  message: "Category created",
                });
              }}
            />
          </>
        )}
      </State>
      <FormGroup
        label={t("dialog_form.code.label")}
        labelFor="f-code"
        helperText={errors["code"]}
        intent={"danger"}
      >
        <InputGroup
          id="f-code"
          name="code"
          value={values["code"] || ""}
          onChange={handleChange}
          intent={errors["code"] ? "danger" : "none"}
        />
      </FormGroup>
      <FormGroup
        label={t("dialog_form.name.label")}
        labelFor="f-name"
        helperText={errors["name"]}
        intent={"danger"}
      >
        <InputGroup
          id="f-name"
          name="name"
          value={values["name"] || ""}
          onChange={handleChange}
          intent={errors["name"] ? "danger" : "none"}
        />
      </FormGroup>
      <FormGroup
        label={t("dialog_form.price.label")}
        labelFor="f-price"
        helperText={errors["price"]}
        intent={"danger"}
      >
        <InputGroup
          id="f-price"
          name="price"
          value={values["price"] || ""}
          onChange={handleChange}
          intent={errors["price"] ? "danger" : "none"}
        />
      </FormGroup>
      <FormGroup
        label={t("dialog_form.quantity.label")}
        labelFor="f-quantity"
        helperText={errors["quantity"]}
        intent={"danger"}
      >
        <InputGroup
          id="f-quantity"
          name="quantity"
          value={values["quantity"] || ""}
          onChange={handleChange}
          intent={errors["quantity"] ? "danger" : "none"}
          placeholder="Jumlah Produk"
          rightElement={<Tag minimal={true}>Buah</Tag>}
        />
      </FormGroup>
      <FormGroup
        label={t("dialog_form.image.label")}
        labelFor="f-image"
        helperText={errors["image"]}
        intent={"danger"}
      >
        <FileUpload
          id="f-image"
          name="image"
          value={values["image"] || ""}
          onChange={(file) => setFieldValue("image", file)}
          intent={errors["image"] ? "danger" : "none"}
          accept="image/png, image/jpeg, image/jpg"
        />
      </FormGroup>
      <h6 className={Classes.HEADING}>{t("dialog_form.title_2")}</h6>
      <FormGroup
        label={t("dialog_form.discount.label")}
        labelInfo={"(optional)"}
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
    </>
  );
};
