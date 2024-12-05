import "../App.css";
import { Card } from "@nextui-org/react";
import SearchBar from "../components/nav-bar/search-bar";

export default function ModifyPage() {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="bg-[#F4F4F4] w-[70%]">
                <div className="py-[4%] text-4xl">Modify Paper Data</div>
                <SearchBar className="pb-4" />
                <div className="w-full h-8 bg-[#D4D4D4] drop-shadow-md"></div>
            </div>
        </div>
    );
}
