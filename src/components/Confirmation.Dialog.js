import { Button, Classes, Dialog, FormGroup, InputGroup } from "@blueprintjs/core"
import { useClient } from "components";
import { Formik } from "formik"
import { useMemo } from "react";
import * as Yup from "yup";

const DialogHapus = ({
  isOpen,
  onClose = () => { },
  onSubmitted = () => { },
  data
}) => {
  const client = useClient();
  const Schema = useMemo(() => (Yup.object().shape({
    'last-word': Yup.string()
      .oneOf(["CONFIRM"], 'Not match')
      .required('Field is required')
  })), []);
  return (
    <Dialog
      isOpen={isOpen}
      onClose={() => onClose()}
      title="Hapus data"
    >
      <Formik
        validationSchema={Schema}
        initialValues={{
          "last-word": "",
        }}
        onSubmit={async (values, { setErrors, setSubmitting }) => {
          try {
            const res = await client["users"].remove(data);
            onClose();
            onSubmitted(res);
          } catch (err) {
            console.error(err);
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }}
      >
        {({ values, errors, isSubmitting, handleSubmit, handleChange }) =>
          <form onSubmit={handleSubmit}>
            <div className={Classes.DIALOG_BODY}>
              <h5 className={Classes.HEADING}>Anda akan menghapus `{data.length}` data yang dipilih.</h5>
              <p>Data yang terhapus tidak dapat dikembalikan. Anda yakin?</p>
              <FormGroup
                label={(<>Please type <strong>CONFIRM</strong> to confirm</>)}
                labelFor={'last-word'}
                intent={errors['last-word'] ? 'danger' : 'none'}
                helperText={errors['last-word']}>
                <InputGroup
                  name="last-word"
                  onChange={handleChange}
                  value={values['last-word']}
                  placeholder="type here"
                  intent={errors['last-word'] ? 'danger' : 'none'} />
              </FormGroup>
            </div>
            <div className={Classes.DIALOG_FOOTER}>
              <Button
                fill={true}
                text="Saya mengerti dan menghapus data ini."
                intent="danger"
                type="submit"
                loading={isSubmitting}
                disabled={Object.entries(errors).length > 0} />
            </div>
          </form>
        }
      </Formik>
    </Dialog>
  )
}

export default DialogHapus;