import { Box, Flex } from "components"
import Helmet from "react-helmet"
import { Router } from "./Router"
import { Sidebar } from "./Sidebar"

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
  return (
    <>
      <Helmet>
        <title>Cashier Point Of Sale</title>
      </Helmet>
      <Box sx={{
        position: "fixed",
        inset: 0,
        bg: "gray.2"
      }}>
        <Sidebar list={navList}/>
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
    </>
  )
}