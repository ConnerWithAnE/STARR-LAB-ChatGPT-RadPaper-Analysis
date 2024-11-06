export type getQuery = {
    tableName: TableNames,
    id?: number,
    paper_name?: string,
    author?: string[] | string,
    part_no?: string[] | string,
    type?: string,
    manufacturer?: string[] | string,
    testing_type?: Testing[] | Testing,
}

export type RadData = {
    paper_name: string,
    author: string,
    part_no: string,
    type: string,
    manufacturer: string,
    testing_type: string
}

// Type to ensure testing types are consistent
export type Testing = "SEE" | "TID" | "OTHER";

// Type to ensure table names are consistent;
export type TableNames = "RadiationData";