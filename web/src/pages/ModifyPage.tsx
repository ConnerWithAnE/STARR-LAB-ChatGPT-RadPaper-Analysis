import "../App.css";
import { Card } from "@nextui-org/react";
import SearchBar from "../components/search-bar";
import { useEffect, useState } from "react";
import { PaperData } from "../types/types";
import PaperSliver from "../components/paper-sliver";
import PaperGallery from "../components/paper-gallery";

export default function ModifyPage() {
    const [papers, setPapers] = useState<PaperData[]>([]);

    const [paperAreaHeight, setPaperAreaHeight] = useState<number>();

    const fetchPapers = async (search: string) => {
        const token = localStorage.getItem("jwtToken");

        try {
            const response = await fetch(
                "http://localhost:3000/api/adminRequest/getFullPapers",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ search }),
                }
            );
            if (response.ok) {
                const result = await response.json();
                setPapers(result as PaperData[]);
            } else {
                console.error(`Failed to fetch papers: ${response.status}`);
            }
        } catch (error) {
            console.error(`Error fetching papers: ${error}`);
            throw error;
        }
    };

    // Fetch papers when the page first loads (with an empty search)
    useEffect(() => {
        fetchPapers("");
    }, []);

    // This is setup to only fetch papers when the search button is clicked,
    // we could make it auto update easily instead tho
    const handleSearch = (value: string) => {
        //console.log(`Search value: ${value}`);
        fetchPapers(value);
    };

    return (
        <div className="flex flex-col items-center h-full">
            <div className="bg-[#F4F4F4] w-[70%]">
                <div>
                    <div className="py-[4%] text-4xl">Modify Paper Data</div>
                    <SearchBar className="pb-4" onSearch={handleSearch} />
                    <div className="w-full h-8 bg-[#D4D4D4] drop-shadow-md"></div>
                </div>
                <div className="">
                    <div className="overflow-y-scroll max-h-screen">
                        <PaperGallery papers={papers} />
                    </div>
                </div>
            </div>
        </div>
    );
}
