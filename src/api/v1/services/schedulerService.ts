import cron from "node-cron";
import { db } from "../../../config/firebaseConfig";
import * as toolService from "./toolService";

const RENTAL_COLLECTION = "rentals";

// calculate late fee for an overdue rental
const calculateLateFee = (
    hourlyRate: number,
    quantity: number,
    endDate: string,
    currentDate: string
): number => {

    const start = new Date(currentDate);
    const end = new Date(endDate);

    const hoursOverdue = (start.getTime() - end.getTime())/
    (1000 * 60 * 60);

    return hourlyRate * quantity * hoursOverdue;
} 

// finds all active overdue rentals and applies late fee
const updateOverdueRentals = async(): Promise<void> => {
    const now = new Date();

    try {
        const snapshot = await db
        .collection(RENTAL_COLLECTION).where("status", "==", "Active")
        .where("endDate", "<", now.toISOString()).get();

        if (snapshot.empty) {
            console.log(`[${now.toISOString()}] No overdue rentals found`);
            return;
        }

        let updatedCount = 0;

        for (const doc of snapshot.docs) {
            const rental = doc.data();

            const tool = await toolService.getToolById(rental.toolId);
            
            if (!tool) {
                console.log(`[${now.toISOString()}] Tool ${rental.toolId} not found for rental ${doc.id}`);

                continue;
            }

            const lateFee = calculateLateFee(tool.hourlyRate, rental.quantity, rental.endDate, now.toISOString());

            await doc.ref.update({
                status: "Overdue",
                lateFee: lateFee,
                overdueSince: now.toISOString()
            });

            updatedCount++;
            
            console.log(`[${now.toISOString()}] Updated rental ${doc.id} - Late fee: $${lateFee.toFixed(2)}`);
        }
            console.log(`[${now.toISOString()}] Processed ${updatedCount} overdue rentals`);
        
    
    } catch (error) {
        console.error(`[${now.toISOString()}] Error updating overdue rentals:`, error);
    }
}

export const startScheduledTasks = (): void => {

    cron.schedule("*/15 * * * *", async() => {
        await updateOverdueRentals();
    });

    console.log("Scheduled tasks started!")
}