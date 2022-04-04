import styled from "@emotion/styled/macro";
import { keyframes } from "@emotion/react";
import { Link } from "react-router-dom";
import React, { useState, useRef } from "react";
import { Box } from "@mui/system";
import { useLocation } from "react-router";
import ConnectWalletButton from "../ConnectWalletButton";

const NavLink = styled(Link)(({ active }) => ({
  color: active ? "#3498db" : "#6c757e",
  fontSize: 14,
  textDecoration: "none",
  fontWeight: 400,
  padding: "16px 24px",
  "&:hover": {
    color: "#3498db",
  },
}));

const WrapLink = styled("a")(({ active }) => ({
  color: active ? "#3498db" : "#6c757e",
  fontSize: 14,
  textDecoration: "none",
  fontWeight: 400,
  padding: "16px 24px",
  "&:hover": {
    color: "#3498db",
  },
}));

const NavLinkDropdown = styled(Link)(({ active }) => ({
  color: active ? "#3498db" : "#6c757e",
  fontSize: 14,
  textDecoration: "none",
  fontWeight: 400,
  padding: "16px 12.8px",
  position: "relative",
  "&:hover": {
    color: "#3498db",
    "&:after": {
      borderTop: "1px solid #3498db",
      borderLeft: "1px solid #3498db",
    },
  },
  "&:after": {
    content: '""',
    width: "4px",
    height: "4px",
    borderTop: "1px solid #6c757e",
    borderLeft: "1px solid #6c757e",
    marginLeft: 6,
    display: "inline-block",
    transform: "rotate(-135deg)",
    marginBottom: 3,
  },
}));

const fade = keyframes`
  0% {
    top: 30px;
  }
  100% {
    top: 17px;
  }
`;

const Menu = styled("ul")`
  position: absolute;
  top: 17px;
  left: 0;
  list-style-type: none;
  background: #ffffff;
  padding: 16px 0px;
  border-radius: 4px;
  border-top: 3px solid #3498db;
  animation: ${fade} 0.25s ease;
`;

const MenuItem = styled("li")({
  width: 200,
  background: "#ffffff",
  color: "#6c757e",
  fontSize: 12,
  padding: "6px 0",
});

const links = [
  {
    path: "/",
    title: "Home",
  },
  {
    path: "#",
    title: "Blockchain",
    children: [
      {
        path: "https://google.com",
        title: "Validators",
      },
      {
        path: "https://google.com",
        title: "Validators",
      },
      {
        path: "https://google.com",
        title: "Validators",
      },
      {
        path: "https://google.com",
        title: "Validators",
      },
    ],
  },
  {
    path: "#",
    title: "Validators",
    children: [
      {
        path: "/4",
        title: "asdas",
      },
      {
        path: "/4",
        title: "asdas",
      },
      {
        path: "/4",
        title: "asdas",
      },
      {
        path: "/4",
        title: "asdas",
      },
    ],
  },
  {
    path: "#",
    title: "Tokens",
    children: [
      {
        path: "/3",
        title: "asdas",
      },
    ],
  },
  {
    path: "/2",
    title: "Resources",
  },
  {
    path: "/1",
    title: "More",
  },
];

const NavDropdown = ({ item }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const show = () => {
    setOpen(true);
  };
  const hide = () => {
    setOpen(false);
  };

  return (
    <Box display="inline-block" position="relative" onMouseOver={show} onMouseLeave={hide}>
      <NavLinkDropdown to={item.path} ref={ref} active={item.children.map(i => i.path).includes(location.pathname)}>
        {item.title}
      </NavLinkDropdown>
      {open && (
        <Menu>
          {item.children.map(child => (
            <MenuItem onClick={hide}>
              {child.path.startsWith("https") ? (
                <WrapLink href={child.path} target="_blank">
                  {child.title}
                </WrapLink>
              ) : (
                <NavLink to={child.path}>{child.title}</NavLink>
              )}
            </MenuItem>
          ))}
        </Menu>
      )}
    </Box>
  );
};

const NavLinks = () => {
  const location = useLocation();
  return (
    <Box height={48} alignItems="center" display="flex">
      {links.map(item => {
        if (item.children) return <NavDropdown item={item} />;
        if (item.path.startsWith("https"))
          return (
            <WrapLink href={item.path} target="_blank" active={location.pathname === item.path}>
              {item.title}
            </WrapLink>
          );
        return (
          <NavLink to={item.path} active={location.pathname === item.path}>
            {item.title}
          </NavLink>
        );
      })}
      <ConnectWalletButton />
    </Box>
  );
};

export default NavLinks;
