import {
  Button,
  Classes,
  Icon,
  Menu,
  MenuDivider,
  MenuItem,
  Position,
  Text,
} from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import { Box, Flex, useI18n } from "components";
import { toaster } from "components/toaster";
import { NavLink, useNavigate } from "react-router-dom";

export const Sidebar = (props) => {
  const { list } = props;
  const navigate = useNavigate();

  const { setLang, currentLang, availableLang } = useI18n();

  return (
    <Flex
      sx={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        backgroundColor: "white",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Box
        className={`${Classes.MENU}`}
        sx={{
          maxWidth: "40px",
        }}
      >
        {list.map(({ icon, text, path }) => (
          <li key={path}>
            <NavLink
              className={(navData) =>
                `${Classes.MENU_ITEM} ${navData.isActive ? Classes.ACTIVE : ""}`
              }
              to={path}
            >
              <Icon className={`${Classes.MENU_ITEM_ICON}`} icon={icon} />
              <Text className={`${Classes.FILL}`} ellipsize={true}>
                {text}
              </Text>
            </NavLink>
          </li>
        ))}
        <MenuDivider />
        <Popover2
          position={Position.RIGHT}
          content={
            <Menu>
              <MenuDivider title="Language" />
              {availableLang.map(({ label, value }) => (
                <MenuItem
                  key={value}
                  text={label}
                  label={value}
                  icon={currentLang === value ? "small-tick" : "blank"}
                  selected={currentLang === value}
                  onClick={() => {
                    setLang(value);
                    // navigate(0);
                  }}
                />
              ))}
            </Menu>
          }
          renderTarget={({ isOpen, ref, ...popoverProps }) => (
            <Button
              {...popoverProps}
              elementRef={ref}
              minimal={true}
              active={isOpen}
              icon="cog"
              // text={`Lang: ${_get(
              //   availableLang.find(({ value }) => value === currentLang),
              //   "label"
              // )}`}
            />
          )}
        />
        <Popover2
          position={Position.RIGHT}
          content={
            <Menu>
              <MenuDivider title="Are you sure?" />
              <MenuItem
                text={"Sure"}
                intent="danger"
                icon="log-out"
                onClick={() => {
                  toaster.show({
                    intent: "success",
                    message: "Successfully Logout",
                  });
                  navigate("login");
                }}
              />
              <MenuItem text={"Cancel"} icon="blank" />
            </Menu>
          }
          renderTarget={({ isOpen, ref, ...popoverProps }) => (
            <Button
              {...popoverProps}
              elementRef={ref}
              minimal={true}
              active={isOpen}
              icon="log-out"
              title="Logout"
              intent="danger"
            />
          )}
        />
      </Box>
    </Flex>
  );
};
