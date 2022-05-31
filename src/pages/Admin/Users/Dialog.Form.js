import {
  Checkbox,
  Classes,
  FormGroup,
  InputGroup,
  Radio,
  RadioGroup,
} from "@blueprintjs/core";
import { Box, Flex } from "components";
import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";

export const DialogForm = () => {
  const { values, errors, handleChange } = useFormikContext();
  const { t } = useTranslation("users-page");
  return (
    <div className={Classes.DIALOG_BODY}>
      <FormGroup
        label={t("dialog_form.type.label")}
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
      <h6 className={Classes.HEADING}>{t("dialog_form.title")}</h6>
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
        label={t("dialog_form.username.label")}
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
      <Flex
        sx={{
          mx: -2,
          "> div": {
            width: "50%",
            px: 2,
            flexGrow: 1,
          },
        }}
      >
        <Box>
          <FormGroup
            label={t("dialog_form.password.label")}
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
            label={t("dialog_form.confirm_password.label")}
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
          label={t("dialog_form.show_password.label")}
          id="f-show_password"
          name="show_password"
          type="password"
          value={values["show_password"]}
          onChange={handleChange}
          intent={errors["show_password"] ? "danger" : "none"}
        />
      </FormGroup>
    </div>
  );
};
