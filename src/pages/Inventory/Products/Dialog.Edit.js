import { Button, Classes, Dialog, FormGroup, InputGroup } from "@blueprintjs/core";
import { FetchAndSelect, useClient } from "components";
import { toaster } from "components/toaster";
import { Formik } from "formik";
import * as Yup from "yup";
import _get from "lodash.get";

const Schema = Yup.object().shape({
  "name": Yup.string().required(),
  "code": Yup.string().required(),
  "price": Yup.number().required(),
  "quantity": Yup.number().required(),
  "category_id": Yup.number().required(),
});

export const DialogEdit = ({
  data,
  isOpen,
  onClose = () => { },
  onSubmitted = () => { }
}) => {
  const client = useClient();
  return (
    <Dialog
      enforceFocus={false}
      isOpen={isOpen}
      onClose={() => { onClose() }}
      title="Edit Product"
    >
      <Formik
        validationSchema={Schema}
        initialValues={{
          "name": _get(data, "name"),
          "code": _get(data, "code"),
          "price": _get(data, "price"),
          "quantity": _get(data, "quantity"),
          "category_id": _get(data, "category.id"),
        }}
        onSubmit={async (values, { setSubmitting }) => {
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
        }}
      >
        {({ values, errors, isSubmitting, setFieldValue, handleSubmit, handleChange }) =>
          <form onSubmit={handleSubmit}>
            <div className={Classes.DIALOG_BODY}>
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
                label="Category"
                labelFor="f-category_id"
                helperText={errors["category_id"]}
                intent={"danger"}
              >
                <FetchAndSelect
                  loaded={true}
                  service={client["categories"]}
                  id="f-category_id"
                  name="category_id"
                  value={values["category_id"]}
                  intent={errors["category_id"] ? "danger" : "none"}
                  onChange={async ({ value }) => {
                    await setFieldValue("category_id", value);
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
        }
      </Formik>
    </Dialog>
  )
}