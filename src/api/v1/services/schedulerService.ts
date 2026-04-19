import cron from "node-cron";
import { db, auth } from "../../../config/firebaseConfig";
import * as toolService from "./toolService";
import { sendReminderEmail } from "./emailService";

const RENTAL_COLLECTION = "rentals";

// calculate late fee for an overdue rental
const calculateLateFee = (
    hourlyRate: number,
    quantity: number,
    endDate: string,
    currentDate: string
): number => {

    const now = new Date(currentDate);
    const end = new Date(endDate);

    const hoursOverdue = (now.getTime() - end.getTime())/
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

const sendDueReminders = async (): Promise<void> => {
    const now = new Date();
    const reminderWindow = 30 * 60 * 1000; // 30mins
    const upperBound = reminderWindow + (15 * 60 * 1000); // 45mins

    try {
        const snapshot = await db
            .collection(RENTAL_COLLECTION)
            .where("status", "==", "Active")
            .where("reminderSent", "==", false)
            .get();
            
        if (snapshot.empty) {
            console.log(`[${now.toISOString()}] No rentals needing reminders`);
            return;
        } 

        let reminderCount = 0;

        for (const doc of snapshot.docs) {
            const rental = doc.data();
            const endDate = new Date(rental.endDate);
            const timeUntilEnd = endDate.getTime() - now.getTime();
            
            if (timeUntilEnd > 0 && timeUntilEnd <= upperBound) {
                const tool = await toolService.getToolById(rental.toolId);
                
                if (!tool) {
                    console.log(`[${now.toISOString()}] Tool ${rental.toolId} not found for rental ${doc.id}`);
                    continue;
                }
                
                try {
                    const userRecord = await auth.getUser(rental.customerId);
                    const customerEmail = userRecord.email;
                    const customerName = userRecord.displayName || "Customer";

                    if (customerEmail) {
                        await sendReminderEmail(
                            customerEmail,
                            customerName,
                            tool.name,
                            rental.endDate
                        );
                        
                        await doc.ref.update({ reminderSent: true });
                        reminderCount++;
                        
                        console.log(`[${now.toISOString()}] Reminder sent for rental ${doc.id} to ${customerEmail}`);
                    } else {
                        console.log(`[${now.toISOString()}] No email found for customer ${rental.customerId}`);
                    }
                } catch (authError) {
                    console.error(`[${now.toISOString()}] Failed to fetch user ${rental.customerId}:`, authError);
                }
            }
        }
        
        console.log(`[${now.toISOString()}] Sent ${reminderCount} reminder emails`);
        
    } catch (error) {
        console.error(`[${now.toISOString()}] Error sending reminders:`, error);
    }
};

export const startScheduledTasks = (): void => {

    // runs every 15min for overdue detection
    cron.schedule("*/15 * * * *", async() => {
        await updateOverdueRentals();
    });

    // run every 15min for reminder emails
    cron.schedule("*/15 * * * *", async() => {
        await sendDueReminders();
    })

    console.log("Scheduled tasks started!");
}

