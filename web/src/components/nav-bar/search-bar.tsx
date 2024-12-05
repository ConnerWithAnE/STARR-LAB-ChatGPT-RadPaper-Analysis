import { ChangeEvent, useState } from "react";
import { HiSearch } from "react-icons/hi";
import "../../App.css";

type SearchBarProps = {
    className?: string;
};

export default function SearchBar({ className }: SearchBarProps) {
    const [query, setQuery] = useState<string>("");

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handleSearch = () => {
        console.log(`Searching for: ${query}`);
        // Need to implement search function
    };

    const handleKeyPress = (e: any) => {
        if (e.code === "Enter") {
            handleSearch();
        }
    };

    return (
        <div
            className={`${className} flex items-center justify-center gap-2 mx-[15%]`}
        >
            <input
                type="search"
                placeholder="Search"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                className="py-1 rounded-lg bg-[#D9D9D9] placeholder-[#909090] h-8 pl-3 w-full"
            />
            <button
                onClick={handleSearch}
                className="bg-usask-green rounded-lg h-8 p-1"
            >
                <HiSearch size={24} color="#CDCDCD" />
            </button>
        </div>
    );
}
