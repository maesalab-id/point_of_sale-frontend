import { Sidemenu as BaseSidemenu } from "components/common/Appshell";
import { useMemo } from "react";

export const Sidemenu = () => {
  const items = useMemo(() => {
    return [{
      text: "Vendor",
      icon: "blank",
      path: "vendors"
    }, {
      text: "Orders",
      icon: "blank",
      path: "orders"
    }, {
      text: "Products",
      icon: "blank",
      path: "products"
    }, {
      text: "Categories",
      icon: "blank",
      path: "categories"
    }];
  }, []);
  return <BaseSidemenu items={items} />;
};
