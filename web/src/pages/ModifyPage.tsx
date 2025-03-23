import "../App.css";
import SearchBar from "../components/search-bar";
import { useEffect, useState } from "react";
import { FullDataType } from "../types/types";
import PaperGallery from "../components/paper-gallery";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

export default function ModifyPage() {
  const [papers, setPapers] = useState<FullDataType[]>([]);
  const navigate = useNavigate();

  //const [paperAreaHeight, setPaperAreaHeight] = useState<number>();

  const fetchPapers = async (search: string) => {
    const token = localStorage.getItem("jwtToken");

    const apiReq = search
      ? "http://localhost:3000/api/adminRequest/papers/full"
      : `http://localhost:3000/api/adminRequest/papers/filter?${search}`;

    try {
      const response = await fetch(
        "http://localhost:3000/api/adminRequest/papers/full",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const result = await response.json();
        setPapers(result as FullDataType[]);
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
    <div className="flex flex-col items-center bg">
      <div className="bg-[#F4F4F4] w-[70%]">
        <div>
          <div className="py-[4%] text-[#343434] text-4xl">
            Modify Paper Data
          </div>
          <SearchBar className="pb-4" onSearch={handleSearch} />
          <div className="w-full h-8 bg-[#D4D4D4] drop-shadow-md"></div>
        </div>
        <div className="">
          <div className="max-h-screen">
            <PaperGallery papers={papers} />
          </div>
        </div>
      </div>
      <Button
        className="bg-usask-green text-white rounded-md absolute bottom-10 right-10"
        size="lg"
        onClick={() => navigate("/upload")}
      >
        Upload Papers
      </Button>
    </div>
  );
}
