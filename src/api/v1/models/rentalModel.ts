// Rental model representing a rental contract.
export interface Rental {
    id: string,
    toolId: string,
    customerId: string,
    quantity: number,
    startDate: Date,
    endDate: Date,
    totalAmount: number,
    status: "Active" | "Complete" | "Cancelled",
    createdAt: Date
}

export interface CreateRental {
    toolId: string,
    customerId: string,
    quantity: number,
    startDate: Date,
    endDate: Date
}