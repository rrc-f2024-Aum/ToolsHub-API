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
export const getAllRentals = async(): Promise<Rental[]> => {
    return rentals;
};

// GET - a rental by ID
export const getRentalById = async(
    id: string
): Promise<Rental | null> => {
    
    const rental = rentals.find(r => r.id === id);
    return rental || null;
}

// POST - create a new rental
export const createRental = async (
    data: CreateRental
): Promise<Rental | null> => {
    
    // get tool to check availability and get hourly rate 
    const tool = await getToolById(data.toolId);
    if (!tool)
        return null;

    if(tool.status !== "Available")
        return null;

    const startDate = new Date(data.startDate).toISOString();
    const endDate = new Date(data.endDate).toISOString();

    const totalAmount = calculateTotalAmount(
        tool.hourlyRate,
        data.quantity,
        startDate,
        endDate
    );

    const newRental: Rental = {
        id: String(nextId++),
        ...data,
        totalAmount,
        status: "Active",
        createdAt: new Date().toISOString(),
    }

    rentals.push(newRental);

    // updates tool status if all units are rented.
    if(tool.quantity === data.quantity) {
        await updateTool(data.toolId, { status: "Rented"});
    }

    return newRental;
}

// POST - Cancel a rental
export const cancelRental = async (
    id: string
): Promise<Rental | null> => {

    const index = rentals.findIndex(r => r.id === id);
    if (index === -1)
        return null;

    const rental = rentals[index];
    if (rental.status !== "Active")
        return null;

    rentals[index] = {
        ...rental,
        status: "Cancelled"
    };

    await updateTool(rental.toolId, { status: "Available"});

    return rentals[index];
}

// GET - rental by customer ID 
export const getRentalByCustomer = async(
    customerId: string
): Promise<Rental[]> => {

    return rentals.filter(r => r.customerId === customerId);
}