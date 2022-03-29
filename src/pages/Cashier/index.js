import { Classes, Icon, MenuDivider, MenuItem, Text } from "@blueprintjs/core"
import { Box, Flex } from "components"
import { toaster } from "components/toaster"
import { NavLink, useNavigate } from "react-router-dom"
import { Router } from "./Router"

const navList = [{
  text: "Home",
  icon: "home",
  path: "/"
}, {
  text: "Transactions",
  icon: "projects",
  path: "transactions"
}]

export const Cashier = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{
      position: "fixed",
      inset: 0,
      bg: "gray.2"
    }}>
      <Flex sx={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        backgroundColor: "white",
        flexDirection: "column",
        justifyContent: "center",
      }}>
        <Box className={`${Classes.MENU}`} sx={{
          maxWidth: "40px"
        }}>
          {navList.map(({ icon, text, path }) => (
            <li key={path}>
              <NavLink
                className={(navData) => `${Classes.MENU_ITEM} ${navData.isActive ? Classes.ACTIVE : ""}`}
                to={path}>
                <Icon className={`${Classes.MENU_ITEM_ICON}`} icon={icon} />
                <Text className={`${Classes.FILL}`} ellipsize={true}>
                  {text}
                </Text>
              </NavLink>
            </li>))}
          <MenuDivider />
          <MenuItem
            icon="log-out"
            title="Logout"
            text="Logout"
            intent="danger"
            onClick={() => {
              toaster.show({
                intent: "success",
                message: "Successfully Logout"
              });
              navigate("login");
            }}
          />
        </Box>
      </Flex>
      <Box sx={{
        marginLeft: "40px",
        py: 3,
        height: "100%"
      }}>
        <Flex sx={{
          alignItems: "center",
          height: "100%"
        }}>
          <Box sx={{
            width: "860px",
            margin: "0 auto",
            overflow: "hidden",
            backgroundColor: "white",
            borderRadius: 16,
          }}>
            <Router />
          </Box>
        </Flex>
      </Box>
    </Box>
  )
}