import { Header as AppshellHeader } from "components/common/Appshell";
import { useTranslation } from "react-i18next";

export const Header = () => {
  const { t } = useTranslation("vouchers-page");
  return <AppshellHeader title={t("title")} />;
};
