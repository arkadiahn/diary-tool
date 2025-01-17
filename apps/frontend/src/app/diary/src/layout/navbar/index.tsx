import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  NavbarProps,
} from "@heroui/react";
import { siteConfig } from "../../constants/siteConfig";
import { Link } from "@heroui/react";
import Image from "next/image";

const menuItems = [
    {
        name: "Home",
        path: "/"
    },
    {
        name: "My Entries",
        path: "/entries"
    }
];

export default function NavbarComponent(props: NavbarProps) {
  return (
    <Navbar
      {...props}
      classNames={{
        base: "py-4 backdrop-filter-none bg-transparent",
        wrapper: "px-0 w-full justify-center bg-transparent",
        item: "hidden md:flex",
      }}
      height="54px"
    >
      <NavbarContent
        className="gap-4 rounded-full border-small border-default-200/20 bg-background/60 px-4 shadow-medium backdrop-blur-md backdrop-saturate-150 dark:bg-default-100/50"
        justify="center"
      >
        {/* Toggle */}
        <NavbarMenuToggle className="ml-2 text-default-400 md:hidden" />

        {/* Logo */}
        <NavbarBrand className="mr-2 w-[40vw] md:w-auto md:max-w-fit">
          <Image
            src="/diaryLogo.png"
            alt={`${siteConfig.name} Logo`}
            width={50}
            height={50}
            className="w-9"
          />
          <span className="ml-2 font-bold">{siteConfig.name}</span>
        </NavbarBrand>

        {/* Items */}
        {menuItems.map((item, index) => (
            <NavbarItem key={`${item.name}-${index}`}>
                <Link className="text-default-500" href={item.path} size="sm">
                    {item.name}
                </Link>
            </NavbarItem>
        ))}
        <NavbarItem className="ml-2 !flex">
          <Button radius="full" color="primary" variant="flat">
            Login
          </Button>
        </NavbarItem>
      </NavbarContent>

      {/* Menu */}
      <NavbarMenu
        className="top-[calc(var(--navbar-height)/2)] mx-auto mt-16 max-h-[40vh] max-w-[80vw] rounded-large border-small border-default-200/20 bg-background/60 py-6 shadow-medium backdrop-blur-md backdrop-saturate-150 dark:bg-default-100/50"
        motionProps={{
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -20 },
          transition: {
            ease: "easeInOut",
            duration: 0.2,
          },
        }}
      >
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link className="w-full text-default-500" href={item.path} size="md">
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
