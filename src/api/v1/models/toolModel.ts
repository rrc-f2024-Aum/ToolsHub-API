// This model represents tools in the rental shop.
export interface Tool {
    id: string,
    name: string,
    description: string,
    category: "Power_tools" | "Hand_tools" | "Gardening" | "Painting" | "Other",
    dailyRate: number,
    depositAmount: number,
    quantity: number,
    status: "Available" | "Rented" | "Maintenance",
    createdAt: string
}

// For creating new tool
export interface CreateToolDTO {
    name: string,
    description: string,
    category: "Power_tools" | "Hand_tools" | "Gardening" | "Painting" | "Other",
    dailyRate: number,
    depositAmount: number,
    quantity: number,
    status?: "Available" | "Rented" | "Maintenance",
}