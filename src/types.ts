// TODO: Add proper values to data types

export type GetQuery = {
    tableName: TableNames,
    id?: number,
    paper_name?: string,
    author?: string[] | string,
    part_no?: string[] | string,
    type?: string,
    manufacturer?: string[] | string,
    testing_type?: Testing[] | Testing,
}

export type InsertData = {
    paper_name: string,
    year: number,
    author: string[],
    part_no: string,
    type: string,
    manufacturer: string,
    testing_location: TestLocation,

}

export type RadData = {
    paper_name: string,
    author: string,
    part_no: string,
    type: string,
    manufacturer: string,
    testing_type: string
}

// Type of testing done
export type TestLocation = "Terrestrial" | "Flight";

// Type to ensure testing types are consistent
export type Testing = "SEE" | "TID" | "DD" | "OTHER";

// Type to ensure table names are consistent;
export type TableNames = "RadiationData";