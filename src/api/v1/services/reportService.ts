import { db } from "../../../config/firebaseConfig";

interface EarningsReport {
    totalEarnings: number;
    totalRentals: number;
    totalLateFees: number;
    period: string;
}

export const getWeeklyEarnings = async (): Promise<EarningsReport> => {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    return getEarningsForPeriod(startOfWeek, new Date(), "weekly");
};

export const getMonthlyEarnings = async (): Promise<EarningsReport> => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    return getEarningsForPeriod(startOfMonth, new Date(), "monthly");
};

export const getAnnualEarnings = async (): Promise<EarningsReport> => {
    const startOfYear = new Date();
    startOfYear.setMonth(0, 1);
    startOfYear.setHours(0, 0, 0, 0);
    
    return getEarningsForPeriod(startOfYear, new Date(), "annual");
};

const getEarningsForPeriod = async (
    startDate: Date,
    endDate: Date,
    period: string
): Promise<EarningsReport> => {
    const snapshot = await db
        .collection("rentals")
        .where("status", "in", ["Completed", "Overdue"])
        .where("createdAt", ">=", startDate.toISOString())
        .where("createdAt", "<=", endDate.toISOString())
        .get();
    
    let totalEarnings = 0;
    let totalLateFees = 0;
    let totalRentals = 0;
    
    snapshot.forEach(doc => {
        const rental = doc.data();
        totalEarnings += rental.totalAmount || 0;
        totalLateFees += rental.lateFee || 0;
        totalRentals++;
    });
    
    return {
        totalEarnings,
        totalRentals,
        totalLateFees,
        period
    };
};

export const getPopularTools = async (limit: number = 10): Promise<any[]> => {
    const snapshot = await db.collection("rentals").get();
    
    const toolRentalCount: Map<string, number> = new Map();
    
    snapshot.forEach(doc => {
        const rental = doc.data();
        const toolId = rental.toolId;
        const count = toolRentalCount.get(toolId) || 0;
        toolRentalCount.set(toolId, count + 1);
    });
    
    const popularTools = Array.from(toolRentalCount.entries())
        .map(([toolId, rentalCount]) => ({ toolId, rentalCount }))
        .sort((a, b) => b.rentalCount - a.rentalCount)
        .slice(0, limit);
     
    for (const tool of popularTools) {
        const toolDoc = await db.collection("tools").doc(tool.toolId).get();
        if (toolDoc.exists) {
            const toolData = toolDoc.data();
            (tool as any).name = toolData?.name;
            (tool as any).category = toolData?.category;
        }
    }
    
    return popularTools;
};