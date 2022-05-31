import { Classes } from "@blueprintjs/core";
import { Box } from "components";
import { useTranslation } from "react-i18next";

export const Header = () => {
  const { t } = useTranslation("categories-page");
  return (
    <Box sx={{ ml: 3, mb: 4 }}>
      <Box as="h2" className={`${Classes.HEADING}`}>
        {t("title")}
      </Box>
    </Box>
  );
};
