import { Equipment } from "../../administration/model/equipment.model";
import { Company } from "./company.model";

export interface Appointment {
    id?: number;
    pickupTime: Date;
    duration: number;
    status: Status;
    type: Type;
    company: Company;
    // There is no user so i can't use this: administrators: User[];
}

export enum Status {
    ON_HOLD = 0,
    IN_PROGRESS = 1,
    DONE = 2,
    CANCELED = 3
}

export enum Type {
    PREDEFINED = 0,
    EXCEPTIONAL = 1
}