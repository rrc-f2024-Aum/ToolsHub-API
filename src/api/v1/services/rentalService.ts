import { Rental, CreateRental } from "../models/rentalModel";
import { getToolById, updateTool } from "./toolService";

let rentals: Rental[] = [];
let nextId = 1;

// calculates total rental charges.
export const calculateTotalAmount = (
    hourlyRate: number,
    quantity: number,
    startDate: string,
    endDate: string
): number => {
    
    const start = new Date(startDate);
    const end = new Date(endDate);

    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return hourlyRate * quantity * hours;
}

// GET - all rentals

// GET - a rental by ID

// POST - create a new rental

// POST - Cancel a rental

// GET - rental by customer ID 