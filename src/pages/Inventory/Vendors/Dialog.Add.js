import { Button, Classes, Dialog, FormGroup, InputGroup, TextArea } from "@blueprintjs/core";
import { useClient } from "components";
import { toaster } from "components/toaster";
import { Formik } from "formik";
import * as Yup from "yup";

const Schema = Yup.object().shape({
  "name": Yup.string().required(),
  "address": Yup.string().required(),
  "phone_number": Yup.string().required(),
});

const initialValues = {
  "name": "",
  "address": "",
  "phone_number": "",
}

export const DialogAdd = ({
  initialValue = initialValues,
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
      title="Add new Vendor"
    >
      <Formik
        validationSchema={Schema}
        initialValues={{
          ...initialValues,
          ...initialValue
        }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const res = await client["vendors"].create(values);
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
        {({ values, errors, isSubmitting, handleSubmit, handleChange }) =>
          <form onSubmit={handleSubmit}>
            <div className={Classes.DIALOG_BODY}>
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
                label="Phone Number"
                labelFor="f-phone_number"
                helperText={errors["phone_number"]}
                intent={"danger"}
              >
                <InputGroup
                  id="f-phone_number"
                  name="phone_number"
                  value={values["phone_number"]}
                  onChange={handleChange}
                  intent={errors["phone_number"] ? "danger" : "none"}
                />
              </FormGroup>
              <FormGroup
                label="Address"
                labelFor="f-address"
                helperText={errors["address"]}
                intent={"danger"}
              >
                <TextArea
                  fill={true}
                  growVertically={true}
                  id="f-address"
                  name="address"
                  value={values["address"]}
                  onChange={handleChange}
                  intent={errors["address"] ? "danger" : "none"}
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