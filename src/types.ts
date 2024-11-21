// TODO: Add proper values to data types

export type GetQuery = {
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
    testing_type: Testing,
    data_type: number
}

export type RadData = {
    paper_name: string,
    author: string,
    part_no: string,
    type: string,
    manufacturer: string,
    testing_type: string,
    data_type: number
}

// Type of testing done
export type TestLocation = "Terrestrial" | "Flight";

// Type to ensure testing types are consistent
export type Testing = "SEE" | "TID" | "DD" | "OTHER";

