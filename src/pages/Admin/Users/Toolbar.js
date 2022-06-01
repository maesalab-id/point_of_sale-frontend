import { Button, ControlGroup, InputGroup } from "@blueprintjs/core";
import { Box, Flex, useList } from "components";
import { useListContext } from "components/common/List";
import { toaster } from "components/toaster";
import { Formik, useFormik } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DialogAdd } from "./Dialog.Add";

export const Toolbar = () => {
  const { t } = useTranslation("users-page");
  const [dialogOpen, setDialogOpen] = useState(null);
  const list = useListContext();
  const { setFilters, filter, refetch, displayedFilter = {} } = list;

  const { values, handleChange } = useFormik({
    initialValues: filter,
  });

  useEffect(() => {
    if (filter !== values) setFilters(values, displayedFilter);
  }, [values]);

  return (
    <Flex>
      <Box sx={{ flexGrow: 1 }}>
        <ControlGroup>
          <InputGroup
            name="username"
            leftIcon="search"
            placeholder={t("toolbar.filter.search.placeholder")}
            value={values["username"] || ""}
            onChange={handleChange}
          />
        </ControlGroup>
      </Box>
      <Box>
        <Button
          intent="primary"
          text={t("toolbar.add_button")}
          onClick={() => {
            setDialogOpen("add");
          }}
        />
        <DialogAdd
          isOpen={dialogOpen === "add"}
          onClose={() => {
            setDialogOpen(null);
          }}
          onSubmitted={() => {
            setFilters({});
            refetch();
            toaster.show({
              intent: "success",
              message: "User created",
            });
          }}
        />
      </Box>
    </Flex>
  );
};
