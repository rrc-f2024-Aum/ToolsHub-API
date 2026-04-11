// Rental model representing a rental contract.
export interface Rental {
    id: string,
    toolId: string,
    customerId: string,
    quantity: number,
    startDate: string,
    endDate: string,
    totalAmount: number,
    status: "Active" | "Completed" | "Cancelled" | "Overdue",
    lateFee: number,
    reminderSent: boolean,
    createdAt: string,
    returnedAt?: string
}

export interface CreateRental {
    toolId: string,
    customerId: string,
    quantity: number,
    startDate: string,
    endDate: string
}