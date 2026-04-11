import { Rental, CreateRental } from "../models/rentalModel";
import * as toolService from "./toolService";
import * as firestoreRepository from "../repositories/firestoreRepository";
import { ConflictError, NotFoundError } from "../errors/errors";

const COLLECTION_NAME = "rentals";

// Helper function to format Firestore data
const formatRentalData = (doc: FirebaseFirestore.DocumentSnapshot): Rental => {
    const data = doc.data()!;

    const formatDate = (dateValue: any): string => {
        if (dateValue && typeof dateValue === 'object' && '_seconds' in dateValue) {
            return new Date(dateValue._seconds * 1000).toISOString();
        }
        return dateValue ? new Date(dateValue).toISOString() : new Date().toISOString();
    }

    return {
        id: doc.id,
        toolId: data.toolId,
        customerId: data.customerId,
        quantity: data.quantity,
        startDate: formatDate(data.startDate),
        endDate: formatDate(data.endDate),
        totalAmount: data.totalAmount,
        status: data.status ?? 'Active',
        lateFee: data.lateFee ?? 0,
        reminderSent: data.reminderSent ?? false,
        createdAt: formatDate(data.createdAt),
        returnedAt: data.returnedAt ? formatDate(data.returnedAt) : undefined
    } as Rental;
}

// Helper function to calculate total amount for a rental
const calculateTotalAmount = (
    hourlyRate: number, 
    quantity: number, 
    startDate: string, 
    endDate: string
): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return hourlyRate * quantity * hours;
};

// Create rental
export const createRental = async (rentalData: CreateRental): Promise<string> => {
    try {
        // Check if tool exists and is available
        const tool = await toolService.getToolById(rentalData.toolId);
        if (!tool) {
            throw new NotFoundError(`Tool with ID ${rentalData.toolId} not found`);
        }
        
        if (tool.status !== "Available") {
            throw new ConflictError(`Tool ${rentalData.toolId} is not available for rental`);
        }
        
        // Calculate total amount
        const totalAmount = calculateTotalAmount(
            tool.hourlyRate,
            rentalData.quantity,
            rentalData.startDate,
            rentalData.endDate
        );
        
        const now = new Date().toISOString();
        const rentalDataWithTime: Omit<Rental, 'id'> = {
            toolId: rentalData.toolId,
            customerId: rentalData.customerId,
            quantity: rentalData.quantity,
            startDate: rentalData.startDate,
            endDate: rentalData.endDate,
            totalAmount,
            status: 'Active',
            lateFee: 0,
            reminderSent: false,
            createdAt: now
        };
        
        const id = await firestoreRepository.createDocument<Rental>(
            COLLECTION_NAME,
            rentalDataWithTime
        );
        
        // Update tool status if all units are rented
        if (tool.quantity === rentalData.quantity) {
            await toolService.updateTool(rentalData.toolId, { status: "Rented" });
        }
        
        return id;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to create rental: ${errorMessage}`);
    }
}

// Get all rentals
export const getAllRentals = async (): Promise<Rental[]> => {
    try {
        const snapshot = await firestoreRepository.getDocuments(COLLECTION_NAME);

        const rentals: Rental[] = [];
        snapshot.forEach((doc) => {
            rentals.push(formatRentalData(doc));
        });

        return rentals;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to fetch rentals: ${errorMessage}`);
    }
}

// Get rental by ID
export const getRentalById = async (id: string): Promise<Rental | null> => {
    try {
        const doc = await firestoreRepository.getDocumentById(COLLECTION_NAME, id);

        if (!doc) {
            return null;
        }

        return formatRentalData(doc);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to fetch rental ${id}: ${errorMessage}`);
    }
}

// Get rentals by customer ID
export const getRentalsByCustomer = async (customerId: string): Promise<Rental[]> => {
    try {
        const snapshot = await firestoreRepository.findByField(COLLECTION_NAME, "customerId", customerId);

        const rentals: Rental[] = [];
        snapshot.forEach((doc) => {
            rentals.push(formatRentalData(doc));
        });

        return rentals;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to fetch rentals for customer ${customerId}: ${errorMessage}`);
    }
}

// Get active rentals
export const getActiveRentals = async (): Promise<Rental[]> => {
    try {
        const snapshot = await firestoreRepository.findByField(COLLECTION_NAME, "status", "Active");

        const rentals: Rental[] = [];
        snapshot.forEach((doc) => {
            rentals.push(formatRentalData(doc));
        });

        return rentals;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to fetch active rentals: ${errorMessage}`);
    }
}

// Get overdue rentals
export const getOverdueRentals = async (): Promise<Rental[]> => {
    try {
        const snapshot = await firestoreRepository.findByField(COLLECTION_NAME, "status", "Overdue");

        const rentals: Rental[] = [];
        snapshot.forEach((doc) => {
            rentals.push(formatRentalData(doc));
        });

        return rentals;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to fetch overdue rentals: ${errorMessage}`);
    }
}

// Update rental (edit or extend)
export const updateRental = async (
    id: string,
    rentalData: { endDate?: string; status?: string }
): Promise<void> => {
    try {
        const rental = await getRentalById(id);
        if (!rental) {
            throw new NotFoundError(`Rental with ID ${id} not found`);
        }
        
        const updateData: Partial<Rental> = {};

        if (rentalData.status){
            updateData.status = rentalData.status as "Active" | "Completed" | "Cancelled" | "Overdue";
        } 

        // If extending, recalculate total amount
        if (rentalData.endDate && rentalData.endDate !== rental.endDate) {
            updateData.endDate = rentalData.endDate;

            const tool = await toolService.getToolById(rental.toolId);
            if (tool) {
                const additionalHours = (new Date(rentalData.endDate).getTime() - new Date(rental.endDate).getTime()) / (1000 * 60 * 60);

                const additionalAmount = tool.hourlyRate * rental.quantity * additionalHours;
                
                updateData.totalAmount = rental.totalAmount + additionalAmount;
            }
        }
        
        if (Object.keys(updateData).length === 0) {
            return;
        }

        await firestoreRepository.updateDocument<Rental>(
            COLLECTION_NAME,
            id,
            updateData
        );
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to update rental ${id}: ${errorMessage}`);
    }
}

// Process tool return
export const returnRental = async (id: string): Promise<void> => {
    try {
        const rental = await getRentalById(id);
        if (!rental) {
            throw new NotFoundError(`Rental with ID ${id} not found`);
        }
        
        const now = new Date();
        const endDate = new Date(rental.endDate);
        let lateFee = 0;
        
        // Calculate late fee if overdue
        if (now > endDate) {
            const hoursOverdue = (now.getTime() - endDate.getTime()) / (1000 * 60 * 60);
            const tool = await toolService.getToolById(rental.toolId);
            if (tool) {
                lateFee = tool.hourlyRate * rental.quantity * hoursOverdue;
            }
        }
        
        await firestoreRepository.updateDocument<Rental>(
            COLLECTION_NAME,
            id,
            {
                status: "Completed",
                lateFee,
                returnedAt: now.toISOString()
            }
        );
        
        // Update tool status back to Available
        await toolService.updateTool(rental.toolId, { status: "Available" });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to return rental ${id}: ${errorMessage}`);
    }
}

// Cancel rental
export const cancelRental = async (id: string): Promise<void> => {
    try {
        const rental = await getRentalById(id);
        if (!rental) {
            throw new NotFoundError(`Rental with ID ${id} not found`);
        }
        
        if (rental.status !== "Active") {
            throw new ConflictError(`Rental with ID ${id} cannot be cancelled because it is ${rental.status}`);
        }
        
        await firestoreRepository.updateDocument<Rental>(
            COLLECTION_NAME,
            id,
            { status: "Cancelled" }
        );
        
        // Update tool status back to Available
        await toolService.updateTool(rental.toolId, { status: "Available" });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to cancel rental ${id}: ${errorMessage}`);
    }
}

// Check if a tool is available for new rental
export const checkAvailability = async (
    toolId: string, 
    startDate: string, 
    endDate: string
): Promise<boolean> => {
    try {
        const tool = await toolService.getToolById(toolId);
        if (!tool) return false;
        if (tool.status !== "Available") return false;
        
        // Check for overlapping active rentals
        const snapshot = await firestoreRepository.findByField(COLLECTION_NAME, "toolId", toolId);
        
        let hasOverlap = false;
        snapshot.forEach((doc) => {
            const rental = formatRentalData(doc);
            if (rental.status === "Active" &&
                new Date(rental.startDate) < new Date(endDate) &&
                new Date(rental.endDate) > new Date(startDate)) {
                hasOverlap = true;
            }
        });
        
        return !hasOverlap;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to check availability: ${errorMessage}`);
    }
}