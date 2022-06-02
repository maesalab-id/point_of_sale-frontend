import { Button, Menu, MenuDivider, MenuItem } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import { Box, Navbar, useI18n } from "components";
import { useClient } from "components/client";
import { useMemo } from "react";
import _get from "lodash.get";

export const Header = (props) => {
  const { title = "Point of Sale" } = props;
  const { account, role, logout } = useClient();
  const { setLang, currentLang } = useI18n();
  const language = useMemo(() => {
    return [
      { label: "Indonesia", value: "id" },
      { label: "English", value: "en" },
    ];
  }, []);
  return (
    <Navbar>
      <Navbar.Group>
        <Box sx={{ width: 180 - 18 }}>
          <Navbar.Heading style={{ margin: 0 }}>{title}</Navbar.Heading>
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
      <Navbar.Group></Navbar.Group>
      <Navbar.Group align="right">
        <Box sx={{ ml: 2 }}>
          <Popover2
            placement="bottom-end"
            content={
              <Menu>
                <MenuItem
                  text={
                    <span>
                      Signed as{" "}
                      <Box as="span" sx={{ fontWeight: "bold" }}>
                        {account && role}
                      </Box>
                    </span>
                  }
                />
                <MenuItem
                  text={
                    <span>
                      Lang:{" "}
                      {_get(
                        language.find(({ value }) => value === currentLang),
                        "label"
                      )}
                    </span>
                  }
                >
                  {language.map(({ label, value }) => (
                    <MenuItem
                      key={value}
                      text={label}
                      icon={currentLang === value ? "small-tick" : "blank"}
                      selected={currentLang === value}
                      onClick={() => setLang(value)}
                    />
                  ))}
                </MenuItem>
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
            }
          >
            <Button
              minimal={true}
              icon="user"
              text={
                <span>
                  Signed as{" "}
                  <Box as="span" sx={{ fontWeight: "bold" }}>
                    {account && role}
                  </Box>
                </span>
              }
            />
          </Popover2>
        </Box>
      </Navbar.Group>
    </Navbar>
  );
};
