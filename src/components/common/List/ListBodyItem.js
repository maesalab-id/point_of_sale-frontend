import {
  Button,
  Menu,
  MenuDivider,
  MenuItem,
  mergeRefs,
} from "@blueprintjs/core";
import { Popover2, Tooltip2 } from "@blueprintjs/popover2";
import { Box } from "components/Grid";
import _isNil from "lodash.isnil";
import _get from "lodash.get";
import { useRecordContext } from "./core/useRecordContext";
import { cloneElement, isValidElement, useMemo } from "react";

export const ListBodyItem = (props) => {
  const { actions: rawActions, fields: rawFields } = props;
  const { data } = useRecordContext();

  const fields = useMemo(() => {
    if (typeof rawFields === "function") return rawFields(data);
    return rawFields;
  }, [rawFields, data]);

  const actions = useMemo(() => {
    if (typeof rawActions === "function") return rawActions(data);
    return rawActions;
  }, [rawActions, data]);

  const hasActions = !_isNil(actions);

  return (
    <>
      {fields.map(({ label, props }) => (
        <Box key={label} sx={{ width: `${100 / 3}%` }}>
          <Box sx={{ color: "gray.5" }}>{label}</Box>
          <Box>{_get(data, props)}</Box>
        </Box>
      ))}
      {hasActions && (
        <Box className="action-button" sx={{ width: 30 }}>
          <Popover2
            content={
              <Menu>
                <MenuDivider title="Actions" />
                {actions.map((el, id) => {
                  if (isValidElement(el)) {
                    return cloneElement(el, { key: id, ...el.props });
                  }
                  return <MenuItem key={id} {...el} />;
                })}
              </Menu>
            }
            renderTarget={({
              isOpen: isPopoverOpen,
              ref: popoverRef,
              ...popoverProps
            }) => (
              <Tooltip2
                content={"Actions"}
                disabled={isPopoverOpen}
                renderTarget={({
                  isOpen: isTooltipOpen,
                  ref: tooltipRef,
                  ...tooltipProps
                }) => (
                  <Button
                    {...popoverProps}
                    {...tooltipProps}
                    active={isPopoverOpen}
                    elementRef={mergeRefs(popoverRef, tooltipRef)}
                    minimal={true}
                    icon="more"
                  />
                )}
              />
            )}
          />
        </Box>
      )}
    </>
  );
};

ListBodyItem.displayName = "ListBodyItem";
