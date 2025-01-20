import React, { createContext, useContext, useState, ReactNode } from "react";
import { GPTResponse } from "./types/types";
import { TableData } from "./types/types";

// Define the shape of the data
interface DataContextType {
  data: GPTResponse[]; // Adjust the type of `data` based on your use case
  setData: (data: GPTResponse[]) => void; // Function to update the data
  tableData: TableData[];
  setTableData: (data: TableData[]) => void;
}

// Define the default value of the context
const defaultValue: DataContextType = {
  data: [],
  setData: () => {},
  tableData: [],
  setTableData: () => {},
};

// Create the context
const DataContext = createContext<DataContextType>(defaultValue);

// Create the provider component
export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<GPTResponse[]>([]); // State to hold the shared data
  const [tableData, setTableData] = useState<TableData[]>([]);

  return (
    <DataContext.Provider value={{ data, setData, tableData, setTableData }}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use the context
export const useData = () => useContext(DataContext);
