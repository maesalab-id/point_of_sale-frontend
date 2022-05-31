import { Button, ControlGroup, InputGroup } from "@blueprintjs/core";
import { Box, Flex, useList } from "components";
import { toaster } from "components/toaster";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DialogAdd } from "./Dialog.Add";

export const Toolbar = () => {
  const { t } = useTranslation("users-page");
  const [dialogOpen, setDialogOpen] = useState(null);
  const { filter, setFilter } = useList();
  return (
    <Flex>
      <Box sx={{ flexGrow: 1 }}>
        <ControlGroup>
          <InputGroup
            leftIcon="search"
            placeholder={t("toolbar.filter.search.placeholder")}
            value={filter["username"] || ""}
            onChange={(e) => {
              setFilter((f) => ({ ...f, username: e.target.value }));
            }}
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
            setFilter((f) => ({ ...f, type: undefined }));
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
