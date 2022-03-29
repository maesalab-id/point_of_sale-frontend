import { Classes, Icon, Menu, MenuDivider, Text } from "@blueprintjs/core";
import { Box } from "components";
import { NavLink } from "react-router-dom";

export const Sidemenu = () => {
  return (
    <Box
      sx={{
        position: "sticky",
        top: 50,
        maxHeight: "calc(100vh - 50px)",
        [`.${Classes.MENU}`]: {
          bg: "transparent",
          p: 0
        },
        ".scrollarea": {
          height: "100%",
        }
      }}
    >
      <Box sx={{
        py: 4,
      }}>
        <Menu>
          <MenuDivider title="Main Menu" />
          {[{
            text: "Products",
            icon: "blank",
            path: "products"
          },{
            text: "Categories",
            icon: "blank",
            path: "categories"
          }, {
            text: "Orders",
            icon: "blank",
            path: "orders"
          }, {
            text: "Receipts",
            icon: "blank",
            path: "receipts"
          }, {
            text: "Users",
            icon: "blank",
            path: "users"
          }].map(({ path, icon, text }) => {
            return (
              <li key={path}>
                <NavLink
                  className={(navData) => `${Classes.MENU_ITEM} ${navData.isActive ? Classes.ACTIVE : ""}`}
                  to={path}>
                  <Icon className={`${Classes.MENU_ITEM_ICON}`} icon={icon} />
                  <Text className={`${Classes.FILL}`} ellipsize={true}>
                    {text}
                  </Text>
                </NavLink>
              </li>
            )
          })}
        </Menu>
      </Box>
    </Box>
  )
}
