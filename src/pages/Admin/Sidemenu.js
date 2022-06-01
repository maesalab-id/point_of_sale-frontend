import { Sidemenu as BaseSidemenu } from "components/common/Appshell";
import { useMemo } from "react";

export const Sidemenu = () => {
  const items = useMemo(() => {
    return [
      {
        text: "Customers",
        icon: "blank",
        path: "customers",
      },
      {
        text: "Vouchers",
        icon: "blank",
        path: "vouchers",
      },
      {
        text: "Vendors",
        icon: "blank",
        path: "vendors",
      },
      {
        text: "Products",
        icon: "blank",
        path: "products",
      },
      {
        text: "Categories",
        icon: "blank",
        path: "categories",
      },
      {
        text: "Orders",
        icon: "blank",
        path: "orders",
      },
      {
        text: "Receipts",
        icon: "blank",
        path: "receipts",
      },
      {
        text: "Users",
        icon: "blank",
        path: "users",
      },
    ];
  }, []);
  return <BaseSidemenu items={items} />;
};
