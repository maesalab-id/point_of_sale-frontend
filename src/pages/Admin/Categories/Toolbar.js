import { Button, ControlGroup, InputGroup } from "@blueprintjs/core";
import { Box, Flex } from "components";
import { useListContext } from "components/common/List";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DialogAdd } from "./Dialog.Add";

export const Toolbar = () => {
  const { t } = useTranslation("categories-page");
  const [dialogOpen, setDialogOpen] = useState(null);
  const {
    setFilters,
    filter,
    refetch,
    displayedFilter = {},
  } = useListContext();

  const { values, handleChange } = useFormik({
    initialValues: filter,
  });

  useEffect(() => {
    if (filter !== values) setFilters(values, displayedFilter);
  }, [values]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Flex>
      <Box sx={{ flexGrow: 1 }}>
        <ControlGroup>
          <InputGroup
            name="name"
            leftIcon="search"
            placeholder={t("toolbar.filter.search.placeholder")}
            value={values["name"] || ""}
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
          onSubmitted={async () => {
            await setFilters({});
            await refetch();
          }}
        />
      </Box>
    </Flex>
  );
};
