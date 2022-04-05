import { Button, Classes, Dialog, FormGroup, InputGroup, Tag } from "@blueprintjs/core";
import { useClient } from "components";
import { toaster } from "components/toaster";
import { Formik } from "formik";
import * as Yup from "yup";
import _get from "lodash.get";
import moment from "moment";
import { DateRangeInput } from "@blueprintjs/datetime";

const Schema = Yup.object().shape({
  "name": Yup.string().required(),
  "value": Yup.number().required(),
  "start": Yup.date().required(),
  "end": Yup.date().required(),
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
      title="Edit voucher information"
    >
      <Formik
        validationSchema={Schema}
        initialValues={{
          "name": _get(data, "name"),
          "value": _get(data, "value"),
          "start": moment(_get(data, "start"), "YYYY-MM-DD").startOf("day").toDate(),
          "end": moment(_get(data, "end"), "YYYY-MM-DD").endOf("day").toDate(),
        }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const res = await client["vouchers"].patch(data["id"], values);
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
                label="Discount Value"
                labelFor="f-value"
                helperText={errors["value"]}
                intent={"danger"}
              >
                <InputGroup
                  id="f-value"
                  name="value"
                  value={values["value"]}
                  onChange={handleChange}
                  intent={errors["value"] ? "danger" : "none"}
                  rightElement={(
                    <Tag minimal={true}>%</Tag>
                  )}
                />
              </FormGroup>
              <FormGroup
                label="Active date range"
                labelFor="f-start_end"
                helperText={errors["start"] || errors["end"]}
                intent={"danger"}
              >
                <DateRangeInput
                  id="f-start_end"
                  name="start_end"
                  maxDate={moment().add(10, "year").toDate()}
                  startInputProps={{
                    leftElement: (<Tag minimal={true}>From</Tag>),
                    intent: errors["start"] ? "danger" : "none"
                  }}
                  endInputProps={{
                    leftElement: (<Tag minimal={true}>To</Tag>),
                    intent: errors["end"] ? "danger" : "none"
                  }}
                  formatDate={date => moment(date).format("DD/MM/YYYY")}
                  onChange={async (value) => {
                    let start = moment(value[0]).toDate();
                    let end = moment(value[1]).toDate();
                    await setFieldValue("start", start);
                    await setFieldValue("end", end);
                  }}
                  parseDate={str => new Date(str)}
                  value={[values["start"], values["end"]]}
                  intent={errors["start"] || errors["end"] ? "danger" : "none"}
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