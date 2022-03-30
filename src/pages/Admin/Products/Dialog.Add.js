import { Button, Classes, Dialog, FormGroup, InputGroup } from "@blueprintjs/core";
import { FetchAndSelect, State, useClient } from "components";
import { toaster } from "components/toaster";
import { Formik } from "formik";
import * as Yup from "yup";
import { DialogAdd as CategoryDialogAdd } from "../Categories/Dialog.Add";

const Schema = Yup.object().shape({
  "name": Yup.string().required(),
  "code": Yup.string().required(),
  "price": Yup.number().required(),
  "quantity": Yup.number().required(),
  "category_id": Yup.number().required(),
});


const initialValues = {
  "name": "",
  "code": "",
  "price": 0,
  "quantity": 0,
  "category_id": undefined,
}

export const DialogAdd = ({
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
      title="Add new Product"
    >
      <Formik
        validationSchema={Schema}
        initialValues={initialValues}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const res = await client["items"].create(values);
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
        }
      </Formik>
    </Dialog>
  )
}