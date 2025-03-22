import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Nav() {
  const [nsid, setNSID] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setNSID(localStorage.getItem("nsid") ?? "");
  }, []);

  return (
    <Navbar position="static" isBordered className="bg-[#D4D4D4]">
      <NavbarBrand>
        <p
          className="font-bold text-inherit text-slate-900"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/modify")}
        >
          STARR Lab Rad-Effects Database
        </p>
      </NavbarBrand>
      <NavbarContent justify="end" className="text-[#343434]">
        {nsid ? (
          <span>Logged in as: {nsid}</span>
        ) : (
          <span>Currently not logged in</span>
        )}
        <NavbarItem>
          <Button className="bg-usask-green" variant="flat">
            <span className="text-slate-50">Log out</span>
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
