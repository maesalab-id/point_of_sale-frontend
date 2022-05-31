import {
  Button,
  Classes,
  Dialog,
  FormGroup,
  InputGroup,
} from "@blueprintjs/core";
import { Formik } from "formik";
import { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import * as Yup from "yup";

export const DialogRemove = ({
  isOpen,
  onClose = () => {},
  onSubmit = () => {},
  title = "Remove items",
  data,
}) => {
  const { t } = useTranslation("common");
  const Schema = useMemo(
    () =>
      Yup.object().shape({
        "last-word": Yup.string()
          .oneOf(
            ["CONFIRM"],
            t("dialog_remove.form.confirm.error_message.unmatched")
          )
          .required(t("dialog_remove.form.confirm.error_message.required")),
      }),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );
  return (
    <Dialog
      isOpen={isOpen}
      onClose={() => onClose()}
      title={title}
    >
      <Formik
        validationSchema={Schema}
        initialValues={{
          "last-word": "",
        }}
        onSubmit={onSubmit}
      >
        {({ values, errors, isSubmitting, handleSubmit, handleChange }) => (
          <form onSubmit={handleSubmit}>
            <div className={Classes.DIALOG_BODY}>
              <h5 className={Classes.HEADING}>
                {t("dialog_remove.description_1", {
                  length: data.length,
                })}
              </h5>
              <p>
                {t("dialog_remove.description_2", {
                  length: data.length,
                })}
              </p>
              <FormGroup
                label={<Trans>{t("dialog_remove.form.confirm.label")}</Trans>}
                labelFor={"last-word"}
                intent={errors["last-word"] ? "danger" : "none"}
                helperText={errors["last-word"]}
              >
                <InputGroup
                  name="last-word"
                  onChange={handleChange}
                  value={values["last-word"]}
                  placeholder="type here"
                  intent={errors["last-word"] ? "danger" : "none"}
                />
              </FormGroup>
            </div>
            <div className={Classes.DIALOG_FOOTER}>
              <Button
                fill={true}
                text={t("dialog_remove.form.submit_button")}
                intent="danger"
                type="submit"
                loading={isSubmitting}
                disabled={Object.entries(errors).length > 0}
              />
            </div>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};
