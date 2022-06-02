import { useMemo } from "react";
import { Alignment, Button, MenuItem } from "@blueprintjs/core";
import { Select as BPSelect } from "@blueprintjs/select";
import _debounce from "lodash/debounce";
import _get from "lodash.get";

export const Select = ({
  id,
  intent,
  minimal,
  label,
  fill,
  placeholder,
  small,

  clearable = false,
  alignText = Alignment.LEFT,
  disabled,
  filterable,
  allowCreateItem,
  createItemTitle = () => {},
  options,
  optionRenderer,
  onCreateNew = () => {},
  onQueryChange = () => {},
  onChange,
  onClick,
  onOpening,
  value,
  loading,
  multiple,
  removeItem,
}) => {
  const items = useMemo(() => {
    if (!clearable) return options;
    return [
      {
        intent: "warning",
        label: "Clear Selection",
        value: "",
      },
      ...options,
    ];
  }, [options, clearable]);

  const activeItem = useMemo(() => {
    // eslint-disable-next-line eqeqeq
    return items.find((item) => item.value == value);
  }, [value, items]);

  const createNewItemRenderer = (query, active) => {
    const title = createItemTitle(query);
    return (
      <MenuItem
        active={active}
        icon="add"
        text={title || `Add "${query}"`}
        onClick={(e) => {
          onCreateNew(query);
        }}
      />
    );
  };

  const itemRenderer = (item, { handleClick, modifiers }) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }
    return (
      <MenuItem
        key={item.value}
        active={modifiers.active}
        disabled={modifiers.disabled || _get(item, "disabled")}
        onClick={handleClick}
        text={item.label}
        label={item.info}
        intent={item.intent}
      />
    );
  };

  const itemPredicate = (query, item) => {
    const normalizeLabel = item.label.toLowerCase();
    const normalizeQuery = query.toLowerCase();
    let normalizeInfo = "";
    if (item.info) normalizeInfo = item.info.toLowerCase();
    return (
      `${item.value} ${normalizeLabel} ${normalizeInfo}`.indexOf(
        normalizeQuery
      ) >= 0
    );
  };

  return (
    <BPSelect
      disabled={disabled}
      filterable={filterable}
      items={items}
      activeItem={activeItem}
      itemRenderer={optionRenderer || itemRenderer}
      itemPredicate={itemPredicate}
      onItemSelect={onChange}
      createNewItemPosition="first"
      createNewItemRenderer={allowCreateItem ? createNewItemRenderer : null}
      createNewItemFromQuery={allowCreateItem ? () => null : null}
      onQueryChange={_debounce(onQueryChange, 250)}
      inputProps={{
        onKeyDown: (e) => {
          if (e.code === "Enter") {
            e.stopPropagation();
            onCreateNew(e.target.value);
          }
        },
      }}
      popoverProps={{
        onOpening: onOpening,
        minimal: true,
        fill: fill,
      }}
      tagInputProps={{
        onRemove: removeItem,
      }}
      noResults={
        <MenuItem disabled={true} text={loading ? "Loading..." : "No Item"} />
      }
      selectedItems={value}
    >
      <Button
        id={id}
        small={small}
        alignText={alignText}
        disabled={disabled}
        minimal={minimal}
        intent={intent}
        loading={loading}
        text={activeItem ? activeItem.label : label || placeholder || "Select"}
        rightIcon="caret-down"
        onClick={onClick}
        fill={fill}
      />
    </BPSelect>
  );
};
