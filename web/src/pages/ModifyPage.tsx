import "../App.css";
import { Card } from "@nextui-org/react";
import SearchBar from "../components/nav-bar/search-bar";
import { useEffect, useState } from "react";
import { PaperData } from "../types/types";
import PaperSliver from "../components/paper-sliver";

// For testing only. All instances of 'TempPaperData' will be replaced with 'PaperData'
export type TempPaperData = {
    id: number;
    paper_name: string;
    author: string[];
};

export default function ModifyPage() {
    const [papers, setPapers] = useState<TempPaperData[]>([
        {
            id: 1,
            paper_name:
                "SEE In-Flight Data for two Static 32KB Memories on High Earth Orbit",
            author: [
                "S. Duzellier",
                "S. Bourdarie",
                "R. Velazco",
                "B. Nicolescu",
                "R. Ecoffet",
            ],
        },
    ]);

    const fetchPapers = async (search: string) => {
        const token = localStorage.getItem("jwtToken");

        try {
            const response = await fetch(
                "https://starr-lab-server.usask.ca/api/adminRequest/getFullPapers",
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
        <div className="flex flex-col items-center justify-center">
            <div className="bg-[#F4F4F4] w-[70%]">
                <div>
                    <div className="py-[4%] text-4xl">Modify Paper Data</div>
                    <SearchBar className="pb-4" onSearch={handleSearch} />
                    <div className="w-full h-8 bg-[#D4D4D4] drop-shadow-md"></div>
                </div>
                <div>
                    {papers.map((paper: TempPaperData, index: number) => (
                        <PaperSliver paper={paper} index={index} />
                    ))}
                </div>
            </div>
        </div>
    );
}
