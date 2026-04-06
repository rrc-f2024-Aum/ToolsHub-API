// Rental model representing a rental contract.
export interface Rental {
    id: string,
    toolId: string,
    customerId: string,
    quantity: number,
    startDate: string,
    endDate: string,
    totalAmount: number,
    status: "Active" | "Complete" | "Cancelled",
    createdAt: string
}

export interface CreateRental {
    toolId: string,
    customerId: string,
    quantity: number,
    startDate: string,
    endDate: string
}