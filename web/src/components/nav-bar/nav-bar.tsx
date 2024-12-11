import {  Navbar,   
    NavbarBrand,   
    NavbarContent,   
    NavbarItem,   
    NavbarMenuToggle,  
    NavbarMenu,  
    NavbarMenuItem } from "@nextui-org/react";
import { Button, Link } from "@nextui-org/react";

  export default function Nav() {
    return (
      <Navbar position="static" isBordered className="bg-[#D4D4D4]">
        <NavbarBrand>
          <p className="font-bold text-inherit text-slate-900">STARR Lab Rad-Effects Database</p>
        </NavbarBrand>
        <NavbarContent justify="end">
          {/* TODO: add which nsid is logged in */}
          <NavbarItem>
            <Button className="bg-usask-green" variant="flat">
              <span className="text-slate-50">Log out</span>
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    );
  }