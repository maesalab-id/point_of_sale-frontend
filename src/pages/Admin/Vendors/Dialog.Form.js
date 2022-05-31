import { Classes, FormGroup, InputGroup, TextArea } from "@blueprintjs/core";
import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";
import _get from "lodash.get";
import { InputMask } from "components";

export const DialogForm = () => {
  const { handleChange, values, errors } = useFormikContext();
  const { t } = useTranslation("vendors-page");
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
      <FormGroup
        label={t("dialog_form.phone_number.label")}
        labelFor="f-phone_number"
        helperText={errors["phone_number"]}
        intent={"danger"}
      >
        <InputMask
          mask={[
            { mask: "+{62} 000-000-0000" },
            { mask: "+{62} 000-0000-0000" },
          ]}
          value={_get(values, "phone_number")}
          onChange={handleChange}
        >
          {({ ref }) => (
            <InputGroup
              inputRef={ref}
              id="f-phone_number"
              name="phone_number"
              intent={errors["phone_number"] ? "danger" : "none"}
            />
          )}
        </InputMask>
      </FormGroup>
      <FormGroup
        label={t("dialog_form.address.label")}
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
  );
};
