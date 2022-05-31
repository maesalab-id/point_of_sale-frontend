import { Classes, FormGroup, InputGroup } from "@blueprintjs/core";
import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";

export const DialogForm = () => {
  const { values, errors, handleChange } = useFormikContext();
  const { t } = useTranslation("categories-page");
  return (
    <div className={Classes.DIALOG_BODY}>
      <FormGroup
        label={t("dialog_form.name.label")}
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
    </div>
  );
};
