import { Button, Checkbox, Classes, Dialog, FormGroup, InputGroup, Radio, RadioGroup } from "@blueprintjs/core";
import { Box, Flex, useClient } from "components";
import { toaster } from "components/toaster";
import { Formik } from "formik";
import * as Yup from "yup";

const Schema = Yup.object().shape({
  "name": Yup.string().required(),
  "username": Yup.string().required(),
  "password": Yup.string().required(),
  "confirm_password": Yup.string()
    .oneOf([Yup.ref("password"), null], "Password must match")
    .required(),
  "type": Yup.string().oneOf(["administrator", "cashier", "inventory"]),
  "show_password": Yup.boolean(),
})

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
      title="Tambah User Baru"
    >
      <Formik
        validationSchema={Schema}
        initialValues={{
          "name": "",
          "username": "",
          "password": "",
          "confirm_password": "",
          "show_password": false,
          "type": "administrator",
        }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const res = await client["users"].create(values);
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
                label="Type"
                labelFor="f-type"
                helperText={errors["type"]}
                intent={"danger"}
              >
                <RadioGroup
                  inline={true}
                  id="f-type"
                  name="type"
                  selectedValue={values["type"]}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  intent={errors["type"] ? "danger" : "none"}
                >
                  <Radio label="Admin" value={"administrator"} />
                  <Radio label="Cashier" value={"cashier"} />
                  <Radio label="Inventory" value={"inventory"} />
                </RadioGroup>
              </FormGroup>
              <h6 className={Classes.HEADING}>Informasi Pengguna</h6>
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
                label="Username"
                labelFor="f-username"
                helperText={errors["username"]}
                intent={"danger"}
              >
                <InputGroup
                  id="f-username"
                  name="username"
                  value={values["username"]}
                  onChange={handleChange}
                  intent={errors["username"] ? "danger" : "none"}
                />
              </FormGroup>
              <Flex sx={{
                mx: -2,
                "> div": {
                  width: "50%",
                  px: 2,
                  flexGrow: 1,
                }
              }}>
                <Box>
                  <FormGroup
                    label="Password"
                    labelFor="f-password"
                    helperText={errors["password"]}
                    intent={"danger"}
                  >
                    <InputGroup
                      id="f-password"
                      name="password"
                      type={values["show_password"] ? "text" : "password"}
                      value={values["password"]}
                      onChange={handleChange}
                      intent={errors["password"] ? "danger" : "none"}
                    />
                  </FormGroup>
                </Box>
                <Box>
                  <FormGroup
                    label="Confirm Password"
                    labelFor="f-confirm_password"
                    helperText={errors["confirm_password"]}
                    intent={"danger"}
                  >
                    <InputGroup
                      id="f-confirm_password"
                      name="confirm_password"
                      type={values["show_password"] ? "text" : "password"}
                      value={values["confirm_password"]}
                      onChange={handleChange}
                      intent={errors["confirm_password"] ? "danger" : "none"}
                    />
                  </FormGroup>
                </Box>
              </Flex>
              <FormGroup
                labelFor="f-show_password"
                helperText={errors["show_password"]}
                intent={"danger"}
              >
                <Checkbox
                  label="Tampilkan Password"
                  id="f-show_password"
                  name="show_password"
                  type="password"
                  value={values["show_password"]}
                  onChange={handleChange}
                  intent={errors["show_password"] ? "danger" : "none"}
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