import { Company } from "../../companies/model/company.model";

export interface Equipment {
    id?: number;
    name: string;
    description: string;
    type: string;
    grade: number;
    quantity: number;
    company?: Company; 
}