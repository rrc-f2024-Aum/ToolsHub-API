export interface Review {
    id: string,
    toolId: string,
    rentalId: string,
    customerId: string,
    rating: number,
    comment: string,
    createdAt: string,
    updatedAt: string
}

export interface CreateReview {
    toolId: string,
    rentalId: string,
    rating: number,
    comment: string
}

export interface UpdateReview {
    rating?: number,
    comment?: string
}