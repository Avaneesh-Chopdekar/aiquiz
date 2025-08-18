import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from '@heroui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store';

export default function NavBar() {
  const { pathname } = useLocation();
  const menuItems = [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'Login',
      href: '/login',
    },
    {
      label: 'Signup',
      href: '/signup',
    },
  ];

  const { logout, status } = useAuthStore();
  return (
    <Navbar isBordered disableAnimation>
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <p className="font-bold text-inherit">AI Quiz</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarBrand>
          <p className="font-bold text-inherit">AI Quiz</p>
        </NavbarBrand>

        {menuItems.map((item, index) => (
          <NavbarItem
            key={`${item}-${index}`}
            isActive={pathname === item.href}
          >
            <Link
              aria-current={pathname === item.href ? 'page' : undefined}
              color={'foreground'}
              as={RouterLink}
              to={item.href}
            >
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {status === 'authenticated' ? (
        <NavbarContent justify="end">
          <NavbarItem>
            <Button
              as={RouterLink}
              onPress={async () => await logout()}
              variant="flat"
            >
              Logout
            </Button>
          </NavbarItem>
        </NavbarContent>
      ) : (
        <NavbarContent justify="end">
          <NavbarItem className="hidden lg:flex">
            <Link as={RouterLink} to="/login">
              Login
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Button as={RouterLink} to="/signup" variant="flat">
              Sign Up
            </Button>
          </NavbarItem>
        </NavbarContent>
      )}

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={'foreground'}
              as={RouterLink}
              to={item.href}
              size="lg"
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
