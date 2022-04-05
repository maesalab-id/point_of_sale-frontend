import { Button, Classes, Dialog, FormGroup, InputGroup, Tag } from "@blueprintjs/core";
import { FetchAndSelect, State, useClient } from "components";
import { toaster } from "components/toaster";
import { useFormik } from "formik";
import * as Yup from "yup";
import _get from "lodash.get";
import { DialogAdd as CategoryDialogAdd } from "../Categories/Dialog.Add";
import { useMemo } from "react";
import currency from "currency.js";
import { CURRENCY_OPTIONS } from "components/constants";

const Schema = Yup.object().shape({
  "name": Yup.string().required(),
  "code": Yup.string().required(),
  "price": Yup.number().required(),
  "category_id": Yup.number().required(),
  "discount": Yup.number().required(),
});

export const DialogEdit = ({
  data,
  isOpen,
  onClose = () => { },
  onSubmitted = () => { }
}) => {
  const client = useClient();

  const { values, errors, isSubmitting, setFieldValue, handleSubmit, handleChange } = useFormik({
    validationSchema: Schema,
    initialValues: {
      "name": _get(data, "name"),
      "code": _get(data, "code"),
      "price": _get(data, "price"),
      "category_id": _get(data, "category.id"),
      "discount": _get(data, "discount"),
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await client["items"].patch(data["id"], values);
        onClose();
        onSubmitted(res);
      } catch (err) {
        console.error(err);
        setSubmitting(false);
        toaster.show({
          intent: "danger",
          message: err.message
        })
      }
    }
  });

  const extras = useMemo(() => {
    const discount_price = (values.price * (values.discount / 100) || 0);
    const price_discounted = values.price - discount_price;
    return {
      discount_price,
      price_discounted
    }
  }, [values.discount, values.price]);


  return (
    <Dialog
      enforceFocus={false}
      isOpen={isOpen}
      onClose={() => { onClose() }}
      title="Edit Product"
    >
      <form onSubmit={handleSubmit}>
        <div className={Classes.DIALOG_BODY}>
          <FormGroup
            label="Stock"
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
          <h6 className={Classes.HEADING}>Product Information</h6>
          <FormGroup
            label="Code"
            labelFor="f-code"
            helperText={errors["code"]}
            intent={"danger"}
          >
            <InputGroup
              id="f-code"
              name="code"
              value={values["code"]}
              onChange={handleChange}
              intent={errors["code"] ? "danger" : "none"}
            />
          </FormGroup>
          <FormGroup
            label="Name"
            labelFor="f-name"
            helperText={errors["name"]}
            intent={"danger"}
          >
            <InputGroup
              id="f-name"
              name="name"
              value={values["name"]}
              onChange={handleChange}
              intent={errors["name"] ? "danger" : "none"}
            />
          </FormGroup>
          <FormGroup
            label="Price"
            labelFor="f-price"
            helperText={errors["price"]}
            intent={"danger"}
          >
            <InputGroup
              id="f-price"
              name="price"
              value={values["price"]}
              onChange={handleChange}
              intent={errors["price"] ? "danger" : "none"}
            />
          </FormGroup>
          <FormGroup
            label="Discount"
            labelFor="f-discount"
            helperText={errors["discount"]}
            intent={"danger"}
          >
            <InputGroup
              id="f-discount"
              name="discount"
              value={values["discount"]}
              onChange={handleChange}
              intent={errors["discount"] ? "danger" : "none"}
              rightElement={(
                <Tag minimal={true}>%</Tag>
              )}
            />
          </FormGroup>
          <FormGroup
            label="Price Discounted"
            labelFor="f-price_discounted"
            helperText={errors["price_discounted"]}
            intent={"danger"}
          >
            <InputGroup
              id="f-price_discounted"
              name="price_discounted"
              readOnly={true}
              value={currency(extras["price_discounted"], CURRENCY_OPTIONS).format()}
              onChange={handleChange}
              intent={errors["price_discounted"] ? "danger" : "none"}
              rightElement={(
                <Tag minimal={true}>{currency(extras["discount_price"] * -1, CURRENCY_OPTIONS).format()}</Tag>
              )}
            />
          </FormGroup>
          <State
            initialValue={{
              isOpen: false,
              query: ""
            }}
          >
            {([state, setState]) => <>
              <FormGroup
                label="Category"
                labelFor="f-category_id"
                helperText={errors["category_id"]}
                intent={"danger"}
              >
                <FetchAndSelect
                  allowCreateItem={true}
                  loaded={true}
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
                      query
                    })
                  }}
                  onPreFetch={(q, query) => {
                    return {
                      ...query,
                      "name": q ? {
                        $iLike: `%${q}%`
                      } : undefined,
                      $select: ["id", "name"]
                    }
                  }}
                  onFetched={(items) => {
                    return items.map((item) => {
                      return {
                        label: item["name"],
                        value: `${item["id"]}`,
                      }
                    })
                  }}
                />
              </FormGroup>
              <CategoryDialogAdd
                isOpen={state.isOpen}
                initialValue={{
                  name: state.query
                }}
                onClose={() => {
                  setState(s => ({ ...s, isOpen: false }));
                }}
                onSubmitted={() => {
                  toaster.show({
                    intent: "success",
                    message: "Category created"
                  });
                }}
              />
            </>}
          </State>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button
              minimal={true}
              onClick={() => onClose()}
              text="Close"
            />
            <Button
              loading={isSubmitting}
              type="submit"
              intent="primary"
              text="Simpan"
            />
          </div>
        </div>
      </form>
    </Dialog>
  )
}