import { Button, ButtonGroup } from "@blueprintjs/core"
import { Flex } from "components"
import { useMemo } from "react"

export const Pagination = ({ sx = {}, loading, disabled, total, skip, limit, onClick = () => { } }) => {
  const opt = useMemo(() => {
    if (total === null
      || skip === null
      || limit === null)
      return null;
    const count = Math.floor(total / limit) + 1;
    const active = Math.floor(skip / limit) + 1;

    // https://gist.github.com/kottenator/9d936eb3e4e3c3e02598
    const pages = [];
    const delta = 2;
    const left = active - delta;
    const right = active + delta + 1;
    const pagesWithDots = [];
    let l;

    for (let i = 1; i <= count; i++) {
      if (i === 1 || i === count || (i >= left && i < right)) {
        pages.push(i);
      }
    }

    for (let i of pages) {
      if (l) {
        if (i - l === 2) {
          pagesWithDots.push(l + 1);
        } else if (i - l !== 1) {
          pagesWithDots.push('...');
        }
      }
      pagesWithDots.push(i);
      l = i;
    }

    return { count, active, pages, pagesWithDots };
  }, [total, limit, skip]);


  if (opt === null || opt.count < 2) return null;
  const calcPage = (page) => {
    const skip = (page - 1) * limit;
    return { page, skip };
  }

  return (
    <Flex sx={{ ...sx, justifyContent: "center" }}>
      {opt.active > 1 &&
        <Button
          disabled={disabled}
          loading={loading}
          minimal={true}
          icon="chevron-left"
          text="Previous"
          onClick={() => {
            onClick(calcPage(opt.active - 1));
          }}
        />}
      <ButtonGroup>
        {opt.pagesWithDots.map((page, idx) => {
          if (page === '...') return (
            <Button
              icon="more"
              minimal={true}
              key={`${page}${idx}`}
              style={{
                pointerEvents: "none",
                paddingLeft: 16,
                paddingRight: 16
              }}
            />
          )
          return (<Button
            disabled={disabled}
            loading={loading}
            key={page}
            text={page}
            active={opt.active === page}
            onClick={() => {
              onClick(calcPage(page));
            }}
          />)
        })}
      </ButtonGroup>
      {opt.active < opt.count &&
        <Button
          disabled={disabled}
          loading={loading}
          minimal={true}
          text="Next"
          rightIcon="chevron-right"
          onClick={() => {
            onClick(calcPage(opt.active + 1));
          }}
        />}
    </Flex>
  )
}