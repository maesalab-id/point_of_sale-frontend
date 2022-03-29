import { Classes, NavbarDivider, NavbarGroup, NavbarHeading } from "@blueprintjs/core";
import { forwardRef } from "react";
import { Container } from "./Container";
import { Box } from "./Grid";

export const Navbar = forwardRef(({ children, fluid, sx, ...props }, ref) => {
  return (
    <Box
      ref={ref}
      className={Classes.NAVBAR}
      sx={{
        px: 0,
        ...sx
      }}
      {...props}
    >
      <Container
        fluid={fluid}
        sx={{
          px: 2,
          height: 50
        }}
      >
        {children}
      </Container>
    </Box>
  )
});

Navbar.Group = NavbarGroup;
Navbar.Heading = NavbarHeading;
Navbar.Divider = NavbarDivider;