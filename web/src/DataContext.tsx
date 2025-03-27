import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { GPTResponse, FullDataType, Conflict } from "./types/types";

// Define the shape of the data

type RedConflicts = {
  id: number;
  fields: string[];
};

//updateContact<K extends keyof Contact>(id: number, field: K, value: Contact[K])
interface TableDataContextType {
  initialGPTPasses: GPTResponse[];
  setInitialGPTPasses: (data: GPTResponse[]) => void; // Function to update the data
  tableEntries: FullDataType[];
  updateEntry: (id: number, value: FullDataType) => void;
  addEntry: (entry: FullDataType) => void;
  removePass: (id: number) => GPTResponse[];
  removeEntry: (id: number) => void;
  redConflicts: RedConflicts[];
  setRedConflict: (id: number, fields: string[]) => void;
  removeRedConflict: (id: number) => void;
  allConflicts: Conflict[];
  addConflict: (conflicts: Conflict) => void;
  removeConflict: (id: number) => void;
  updateConflict: (id: number, fields: Conflict) => void;
}

// Define the default value of the context
const defaultValue: TableDataContextType = {
  initialGPTPasses: [],
  setInitialGPTPasses: () => {},
  updateEntry: () => {},
  removeEntry: () => {},
  addEntry: () => {},
  removePass: () => [],
  tableEntries: [],
  redConflicts: [],
  setRedConflict: () => {},
  removeRedConflict: () => {},
  allConflicts: [],
  addConflict: () => {},
  removeConflict: () => {},
  updateConflict: () => {},
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
  const [tableEntries, setTableEntries] = useState<FullDataType[]>([]);
  const [redConflicts, setRedConflicts] = useState<RedConflicts[]>([]);
  const [allConflicts, setAllConflicts] = useState<Conflict[]>(
    [] as Conflict[]
  );

  useEffect(() => {
    console.log("addconflicts", allConflicts);
  }, [allConflicts]);

  function addConflict(conflicts: Conflict) {
    setAllConflicts((prev) => {
      const newConflicts = [...prev];
      newConflicts.push(conflicts);
      return newConflicts;
    });
  }

  function removeConflict(id: number) {
    console.log("id", id);
    setAllConflicts((prev) => {
      const newConflicts = [...prev];
      newConflicts.splice(id, 1);
      return newConflicts;
    });
  }

  function updateConflict(id: number, fields: Conflict) {
    setAllConflicts((prev) => {
      const updatedConflicts = [...prev];
      updatedConflicts[id] = fields;
      return updatedConflicts;
    });
  }

  function updateEntry(id: number, value: FullDataType) {
    setTableEntries((prev) => {
      const updatedEntries = [...prev];
      updatedEntries[id] = value;
      return updatedEntries;
    });
  }

  function addEntry(entry: FullDataType) {
    setTableEntries((prev) => {
      const newEntry: FullDataType = {
        ...entry,
      };

      return [...prev, newEntry];
    });
    console.log("tableEntries", tableEntries);
  }

  function removePass(id: number) {
    const updatedPasses: GPTResponse[] = [];
    for (let i = 0; i < initialGPTPasses.length; i++) {
      if (i !== id) {
        updatedPasses.push(initialGPTPasses[i]);
      }
    }
    return updatedPasses;
  }

  function removeEntry(id: number) {
    const newEntries = tableEntries.filter(
      (entry) => tableEntries[id] !== entry
    );
    setTableEntries(newEntries);
  }

  function setRedConflict(id: number, fields: string[]) {
    if (!redConflicts.find((conflict) => conflict.id === id)) {
      setRedConflicts((prev) => {
        const newConflict: RedConflicts = {
          id: id,
          fields: [...fields],
        };
        return [...prev, newConflict];
      });
    } else {
      setRedConflicts((prev) => {
        const newConflicts = prev.map((conflict) => {
          if (conflict.id === id) {
            return {
              id: id,
              fields: [...fields],
            };
          }
          return conflict;
        });
        return newConflicts.filter((conflict) => conflict.fields.length > 0);
      });
    }
  }

  function removeRedConflict(id: number) {
    setRedConflicts((prev) => {
      const newConflicts = prev.filter((conflict) => conflict.id !== id);
      console.log("newConflicts", newConflicts);
      return newConflicts;
    });
  }

  return (
    <TableDataContext.Provider
      value={{
        initialGPTPasses,
        setInitialGPTPasses,
        tableEntries,
        addEntry,
        removePass,
        updateEntry,
        redConflicts,
        setRedConflict,
        removeRedConflict,
        removeEntry,
        allConflicts,
        addConflict,
        removeConflict,
        updateConflict,
      }}
    >
      {children}
    </TableDataContext.Provider>
  );
};

// Custom hook to use the context
export const useForm = () => useContext(TableDataContext);
