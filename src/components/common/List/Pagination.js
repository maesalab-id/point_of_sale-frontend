import { Button, ButtonGroup } from "@blueprintjs/core";
import { Flex } from "components";
import { useMemo } from "react";

export const Pagination = (props) => {
  const {
    sx = {},
    loading,
    disabled,
    total,
    limit,
    page,
    onClick = () => {},
  } = props;

  const opt = useMemo(() => {
    var current = page,
      last = Math.ceil(total / limit),
      delta = 2,
      left = current - delta,
      right = current + delta + 1,
      pages = [],
      pageWithDots = [],
      l;

    for (let i = 1; i <= last; i++) {
      if (i === 1 || i === last || (i >= left && i < right)) {
        pages.push(i);
      }
    }

    for (let i of pages) {
      if (l) {
        if (i - l === 2) {
          pageWithDots.push(l + 1);
        } else if (i - l !== 1) {
          pageWithDots.push("...");
        }
      }
      pageWithDots.push(i);
      l = i;
    }

    return {
      current,
      pages,
      pageWithDots,
    };
  }, [total, page, limit]);

  return (
    <Flex sx={{ ...sx, justifyContent: "center" }}>
      {opt.current > 1 && (
        <Button
          disabled={disabled}
          loading={loading}
          minimal={true}
          icon="chevron-left"
          text="Previous"
          onClick={() => {
            onClick(opt.current - 1);
          }}
        />
      )}
      <ButtonGroup>
        {opt.pageWithDots.map((page, idx) => {
          if (page === "...")
            return (
              <Button
                icon="more"
                minimal={true}
                key={`${page}${idx}`}
                style={{
                  pointerEvents: "none",
                  paddingLeft: 16,
                  paddingRight: 16,
                }}
              />
            );
          return (
            <Button
              disabled={disabled}
              loading={loading}
              key={page}
              text={page}
              active={opt.current === page}
              onClick={() => {
                onClick(page);
              }}
            />
          );
        })}
      </ButtonGroup>
      {opt.current < opt.pages.length && (
        <Button
          disabled={disabled}
          loading={loading}
          minimal={true}
          text="Next"
          rightIcon="chevron-right"
          onClick={() => {
            onClick(opt.current + 1);
          }}
        />
      )}
    </Flex>
  );
};
