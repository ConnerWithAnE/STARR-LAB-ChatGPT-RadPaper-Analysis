import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { GPTResponse } from "./types/types";
import { UpdateData } from "./types/types";

// Define the shape of the data

//updateContact<K extends keyof Contact>(id: number, field: K, value: Contact[K])
interface TableDataContextType {
  initialGPTPasses: GPTResponse[]; // Adjust the type of `data` based on your use case
  setInitialGPTPasses: (data: GPTResponse[]) => void; // Function to update the data
  tableEntries: UpdateData[]; // Adjust the type of `data` based on your use case
  updateEntry: <K extends keyof UpdateData>(
    id: number,
    key: string,
    value: UpdateData[K]
  ) => void;
  updateEntry2: (id: number, value: UpdateData) => void;
  addEntry: (entry: UpdateData) => void;
  removeEntry: (id: number) => void;
  retrieveEntry: (id: number) => UpdateData | undefined;
}

// Define the default value of the context
const defaultValue: TableDataContextType = {
  initialGPTPasses: [],
  setInitialGPTPasses: () => {},
  updateEntry: () => {},
  updateEntry2: () => {},
  addEntry: () => {},
  removeEntry: () => {},
  tableEntries: [],
  retrieveEntry: () => undefined,
};

// Create the context
const TableDataContext = createContext<TableDataContextType>(defaultValue);

// Create the provider component
export const TableDataFormProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [initialGPTPasses, setInitialGPTPasses] = useState<GPTResponse[]>([]);
  const [tableEntries, setTableEntries] = useState<UpdateData[]>([]);

  useEffect(() => {
    console.log("Updated contacts:", tableEntries);
  }, [tableEntries]);

  function updateEntry<K extends keyof UpdateData>(
    id: number,
    key: string,
    value: UpdateData[K]
  ) {
    setTableEntries((prev) =>
      prev.map((entry) =>
        entry.ROWID === id ? { ...entry, [key]: value } : entry
      )
    );
  }

  function updateEntry2(id: number, value: UpdateData) {
    setTableEntries((prev) =>
      prev.map((entry) => (entry.ROWID === id ? { ...value } : entry))
    );
  }

  function addEntry(entry: UpdateData) {
    console.log("entry", entry);
    setTableEntries((prev) => {
      const newEntry: UpdateData = {
        ...entry,
      };

      return [...prev, newEntry];
    });
    console.log("tableEntries", tableEntries);
  }

  function removeEntry(id: number) {
    setTableEntries((prev) => prev.filter((entry) => entry.ROWID !== id));
  }

  function retrieveEntry(id: number) {
    return tableEntries.find((entry) => entry.ROWID === id);
  }

  return (
    <TableDataContext.Provider
      value={{
        initialGPTPasses,
        setInitialGPTPasses,
        tableEntries,
        updateEntry,
        addEntry,
        removeEntry,
        retrieveEntry,
        updateEntry2,
      }}
    >
      {children}
    </TableDataContext.Provider>
  );
};

// Custom hook to use the context
export const useForm = () => useContext(TableDataContext);
