import {
  Button,
  FormGroup,
  InputGroup,
  Menu,
  MenuItem,
  Position,
} from "@blueprintjs/core";
import { Box, useClient, useI18n } from "components";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Formik } from "formik";
import * as Yup from "yup";
import _get from "lodash.get";
import { toaster } from "components/toaster";
import { VENDOR_INFORMATION } from "components/constants";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Popover2 } from "@blueprintjs/popover2";

const Login = () => {
  const client = useClient();
  const navigate = useNavigate();
  const { t } = useTranslation("login-page");

  const { setLang, currentLang, availableLang } = useI18n();

  const Schema = useMemo(
    () =>
      Yup.object().shape({
        username: Yup.string().required(t("form.username.error-message")),
        password: Yup.string().required(t("form.username.error-message")),
      }),
    [t]
  );

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        bg: "gray.1",
      }}
    >
      <Helmet>
        <title>Login ke POS - {VENDOR_INFORMATION.NAME}</title>
      </Helmet>
      <Box
        sx={{
          width: 275,
          mx: "auto",
          pt: 4,
        }}
      >
        <Box sx={{ textAlign: "center", py: 3 }}>
          <Box
            as="img"
            src="logo192.png"
            sx={{
              width: 75,
            }}
          />
          <Box
            as="h1"
            sx={{
              mt: 3,
              mb: 1,
              fontSize: 4,
              fontWeight: "lighter",
            }}
          >
            Points of Sale
          </Box>
          <Box
            as="h3"
            sx={{
              mb: 3,
              fontWeight: "lighter",
            }}
          >
            {VENDOR_INFORMATION.NAME}
          </Box>
        </Box>
        <Box
          sx={{
            borderRadius: 4,
            border: "1px solid white",
            borderColor: "gray.3",
            py: 4,
            bg: "white",
          }}
        >
          <Box sx={{ px: 3 }}>
            <Formik
              validationSchema={Schema}
              validateOnChange={false}
              initialValues={{
                username: undefined,
                password: undefined,
                hidePassword: true,
              }}
              onSubmit={async (values, { setSubmitting }) => {
                const toast = toaster.show({
                  intent: "none",
                  message: "Logging in",
                });

                try {
                  await client.authenticate({
                    strategy: "local",
                    username: values["username"],
                    password: values["password"],
                  });
                  toaster.dismiss(toast);
                  toaster.show({
                    intent: "success",
                    message: "Succesfully login",
                  });
                  navigate("/");
                } catch (err) {
                  toaster.dismiss(toast);
                  toaster.show({
                    intent: "danger",
                    message: err.message,
                  });
                }
                setSubmitting(false);
              }}
            >
              {({
                values,
                errors,
                isSubmitting,
                setFieldValue,
                handleChange,
                handleSubmit,
              }) => {
                return (
                  <form onSubmit={handleSubmit}>
                    <FormGroup
                      label={t("form.username.label")}
                      labelFor="f-username"
                      helperText={_get(errors, "username")}
                      intent={_get(errors, "username") ? "danger" : "none"}
                    >
                      <InputGroup
                        id="f-username"
                        name="username"
                        autoComplete="username"
                        value={values["username"] || ""}
                        onChange={handleChange}
                        intent={_get(errors, "username") ? "danger" : "none"}
                      />
                    </FormGroup>
                    <FormGroup
                      label={t("form.password.label")}
                      labelFor="f-password"
                      helperText={_get(errors, "password")}
                      intent={_get(errors, "password") ? "danger" : "none"}
                    >
                      <InputGroup
                        id="f-password"
                        name="password"
                        value={values["password"] || ""}
                        autoComplete="current-password"
                        onChange={handleChange}
                        type={values["hidePassword"] ? "password" : "text"}
                        intent={_get(errors, "password") ? "danger" : "none"}
                        rightElement={
                          <Button
                            minimal={true}
                            icon={
                              values["hidePassword"] ? "eye-off" : "eye-open"
                            }
                            onClick={() => {
                              setFieldValue(
                                "hidePassword",
                                !values["hidePassword"]
                              );
                            }}
                          />
                        }
                      />
                    </FormGroup>
                    <Box sx={{ textAlign: "right" }}>
                      <Button
                        type="submit"
                        intent="primary"
                        text={t("form.submit-button")}
                        loading={isSubmitting}
                      />
                    </Box>
                  </form>
                );
              }}
            </Formik>
          </Box>
        </Box>
        <Box sx={{ textAlign: "center", py: 3 }}>
          <Popover2
            position={Position.BOTTOM}
            content={
              <Menu>
                {availableLang.map(({ label, value }) => (
                  <MenuItem
                    key={value}
                    text={label}
                    label={value}
                    icon={currentLang === value ? "small-tick" : "blank"}
                    selected={currentLang === value}
                    onClick={() => setLang(value)}
                  />
                ))}
              </Menu>
            }
            renderTarget={({ isOpen, ref, ...popoverProps }) => (
              <Button
                {...popoverProps}
                elementRef={ref}
                minimal={true}
                active={isOpen}
                text={`Lang: ${_get(
                  availableLang.find(({ value }) => value === currentLang),
                  "label"
                )}`}
              />
            )}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
