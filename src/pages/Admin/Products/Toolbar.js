import { Button, ControlGroup, InputGroup } from "@blueprintjs/core";
import { Box, FetchAndSelect, Flex, useClient } from "components";
import { useListContext } from "components/common/List";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DialogAdd } from "./Dialog.Add";

export const Toolbar = () => {
  const { t } = useTranslation("products-page");
  const client = useClient();

  const [dialogOpen, setDialogOpen] = useState(null);
  const {
    setFilters,
    filter,
    refetch,
    displayedFilter = {},
  } = useListContext();

  const { values, handleChange, setFieldValue } = useFormik({
    initialValues: filter,
  });

  useEffect(() => {
    if (filter !== values) setFilters(values, displayedFilter);
  }, [values]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Flex>
      <Flex sx={{ flexGrow: 1 }}>
        <Box sx={{ mr: 2 }}>
          <ControlGroup>
            <InputGroup
              name="name"
              leftIcon="search"
              placeholder={t("toolbar.filter.search.placeholder")}
              value={filter["name"] || ""}
              onChange={handleChange}
            />
          </ControlGroup>
        </Box>
        <Box sx={{ mr: 2 }}>
          <FetchAndSelect
            service={client["categories"]}
            placeholder={t("toolbar.filter.category.placeholder")}
            name="category_id"
            value={filter["category_id"]}
            clearable={true}
            onChange={async ({ value }) => {
              setFieldValue("category_id", value);
            }}
            onPreFetch={(q, query) => {
              return {
                ...query,
                name: q
                  ? {
                      $iLike: `%${q}%`,
                    }
                  : undefined,
                $select: ["id", "name"],
              };
            }}
            onFetched={(items) => {
              return items.map((item) => {
                return {
                  label: item["name"],
                  value: `${item["id"]}`,
                };
              });
            }}
          />
        </Box>
      </Flex>
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
