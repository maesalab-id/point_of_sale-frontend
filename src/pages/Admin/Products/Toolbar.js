import { Button, ControlGroup, InputGroup } from "@blueprintjs/core";
import { Box, FetchAndSelect, Flex, useClient, useList } from "components";
import { toaster } from "components/toaster";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { filterField } from ".";
import { DialogAdd } from "./Dialog.Add";

export const Toolbar = () => {
  const { t } = useTranslation("products-page");
  const client = useClient();
  const [dialogOpen, setDialogOpen] = useState(null);
  const { filter, setFilter } = useList();
  return (
    <Flex>
      <Flex sx={{ flexGrow: 1 }}>
        <Box sx={{ mr: 2 }}>
          <ControlGroup>
            <InputGroup
              leftIcon="search"
              placeholder={t("toolbar.filter.search.placeholder")}
              value={filter["name"] || ""}
              onChange={(e) => {
                setFilter((f) => ({ ...f, name: e.target.value }));
              }}
            />
          </ControlGroup>
        </Box>
        <Box sx={{ mr: 2 }}>
          <FetchAndSelect
            service={client["categories"]}
            placeholder={t("toolbar.filter.category.placeholder")}
            id="f-category_id"
            name="category_id"
            value={filter["category_id"]}
            onChange={async ({ value }) => {
              setFilter((f) => ({ ...f, category_id: value }));
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
        <Box>
          {filterField.map((f) => !!filter[f]).indexOf(true) !== -1 && (
            <Button
              title={t("toolbar.filter.clear_button")}
              minimal={true}
              intent="warning"
              icon="filter-remove"
              onClick={() => {
                const ff = {};
                filterField.forEach((f) => (ff[f] = undefined));
                setFilter((filter) => ({
                  ...filter,
                  ...ff,
                }));
              }}
            />
          )}
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
          onSubmitted={() => {
            setFilter((f) => ({ ...f, type: undefined }));
            toaster.show({
              intent: "success",
              message: "Product has been created",
            });
          }}
        />
      </Box>
    </Flex>
  );
};
