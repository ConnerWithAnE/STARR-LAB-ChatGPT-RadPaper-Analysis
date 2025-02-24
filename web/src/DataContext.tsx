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

type RedConflicts = {
  id: number;
  fields: string[];
};

//updateContact<K extends keyof Contact>(id: number, field: K, value: Contact[K])
interface TableDataContextType {
  initialGPTPasses: GPTResponse[];
  setInitialGPTPasses: (data: GPTResponse[]) => void; // Function to update the data
  tableEntries: UpdateData[];
  updateEntry: <K extends keyof UpdateData>(
    id: number,
    key: string,
    value: UpdateData[K]
  ) => void;
  updateEntry2: (id: number, value: UpdateData) => void;
  addEntry: (entry: UpdateData) => void;
  removePass: (id: number) => GPTResponse[];
  retrieveEntry: (id: number) => UpdateData | undefined;
  redConflicts: RedConflicts[];
  setRedConflict: (id: number, fields: string[]) => void;
  removeRedConflict: (id: number, field: string) => void;
}

// Define the default value of the context
const defaultValue: TableDataContextType = {
  initialGPTPasses: [],
  setInitialGPTPasses: () => {},
  updateEntry: () => {},
  updateEntry2: () => {},
  addEntry: () => {},
  removePass: () => [],
  tableEntries: [],
  retrieveEntry: () => undefined,
  redConflicts: [],
  setRedConflict: () => {},
  removeRedConflict: () => {},
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
  const [redConflicts, setRedConflicts] = useState<RedConflicts[]>([]);

  useEffect(() => {
    console.log("Updated contacts:", tableEntries);
  }, [tableEntries]);

  useEffect(() => {
    console.log("Updated GPTPasses:", initialGPTPasses);
  }, [initialGPTPasses]);

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

  function removePass(indexROWID: number) {
    // Get array index from ROWID
    const arr_ind: number = tableEntries.findIndex(
      (item) => item.ROWID === indexROWID
    );
    const updatedPasses: GPTResponse[] = [];
    for (let i = 0; i < initialGPTPasses.length; i++) {
      if (i !== arr_ind) {
        updatedPasses.push(initialGPTPasses[i]);
      }
    }
    return updatedPasses;
  }

  function retrieveEntry(id: number) {
    return tableEntries.find((entry) => entry.ROWID === id);
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

  function removeRedConflict(id: number, field: string) {
    setRedConflicts((prev) => {
      const newConflicts = prev.map((conflict) => {
        if (conflict.id === id) {
          return {
            id: id,
            fields: conflict.fields.filter((f) => f !== field),
          };
        }
        return conflict;
      });
      return newConflicts.filter((conflict) => conflict.fields.length > 0);
    });
  }

  return (
    <TableDataContext.Provider
      value={{
        initialGPTPasses,
        setInitialGPTPasses,
        tableEntries,
        updateEntry,
        addEntry,
        removePass,
        retrieveEntry,
        updateEntry2,
        redConflicts,
        setRedConflict,
        removeRedConflict,
      }}
    >
      {children}
    </TableDataContext.Provider>
  );
};

// Custom hook to use the context
export const useForm = () => useContext(TableDataContext);
