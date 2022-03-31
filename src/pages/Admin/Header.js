import { Button, Menu, MenuDivider, MenuItem } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import { Box, Navbar } from "components";
import { useClient } from "components/client";

export const Header = () => {
  const { account, role, logout } = useClient();
  return (
    <Navbar>
      <Navbar.Group>
        <Box sx={{ width: 180 - 18 }}>
          <Navbar.Heading style={{ margin: 0 }}>Point of Sale</Navbar.Heading>
        </Box>
        <Navbar.Divider />
        {/* <Box sx={{ mr: 2 }}>
          <InputGroup
            placeholder="Cari"
            rightElement={<Button outlined={true} icon="slash" />}
          />
        </Box>
        <Button minimal={true} text="Contact Center" /> */}
      </Navbar.Group>
      <Navbar.Group>
      </Navbar.Group>
      <Navbar.Group align="right">
        <Box sx={{ ml: 2 }}>
          <Popover2
            placement="bottom-end"
            content={(
              <Menu>
                <MenuItem text={
                  <span>Signed as <Box as="span" sx={{ fontWeight: "bold" }}>{account && role}</Box></span>
                } />
                <MenuDivider />
                <MenuItem
                  intent="danger"
                  icon="log-out"
                  text="Logout"
                  onClick={() => {
                    logout();
                  }}
                />
              </Menu>
            )}
          >
            <Button minimal={true} icon="user" text={<span>Signed as <Box as="span" sx={{ fontWeight: "bold" }}>{account && role}</Box></span>} />
          </Popover2>
        </Box>
      </Navbar.Group>
    </Navbar>
  )
}