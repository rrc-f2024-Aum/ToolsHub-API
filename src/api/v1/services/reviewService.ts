import { db } from "../../../config/firebaseConfig";
import { Review, CreateReview, UpdateReview } from "../models/reviewModel";
import { NotFoundError, ValidationError } from "../errors/errors";

const COLLECTION_NAME = "reviews";

const formatReviewData = (doc: FirebaseFirestore.DocumentSnapshot): Review => {
    const data = doc.data()!;

    return {
        id: doc.id,
        toolId: data.toolId,
        rentalId: data.rentalId,
        customerId: data.customerId,
        rating: data.rating,
        comment: data.comment,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
    };
}

// create review 
export const createCustomerReview = async(
    rentalId: string,
    customerId: string,
    data: CreateReview
): Promise<string> => {

    const rentalDoc = await db.collection("rentals").doc(rentalId).get();
    if (!rentalDoc.exists) {
        throw new NotFoundError(`Rental with ID ${rentalId} not found`);
    }

    const rental = rentalDoc.data();
    if (rental?.customerId !== customerId) {
        throw new ValidationError("You can only review your own rentals");
    }

    if (rental?.status !== "Completed") {
        throw new ValidationError("You can only review completed rentals");
    }

    const existingReview = await db.collection(COLLECTION_NAME)
        .where("rentalId", "==", rentalId).get();

    if (!existingReview.empty) {
        throw new ValidationError("A review already exists for this rental");
    }

    const now = new Date().toISOString();
    const reviewData = {
        toolId: data.toolId,
        rentalId: rentalId,
        customerId: customerId,
        rating: data.rating,
        comment: data.comment,
        createdAt: now,
        updatedAt: now
    }

    const docRef = await db.collection(COLLECTION_NAME).add(reviewData);
    return docRef.id;
}

// display review by tool id
export const getReviewByTool = async(
    toolId: string
): Promise<Review[]> => {

    const snapshot = await db.collection(COLLECTION_NAME)
        .where("toolId", "==", toolId)
        .orderBy("createdAt", "desc").get();

    const reviews: Review[] = [];
    snapshot.forEach(doc => {
        reviews.push(formatReviewData(doc));
    });
    return reviews;
}

// update review 
export const updateReview = async(
    reviewId: string,
    customerId: string,
    data: UpdateReview
): Promise<void> => {

    const doc = await db.collection(COLLECTION_NAME)
        .doc(reviewId).get();

    if (!doc.exists) {
        throw new ValidationError("You can only update your reviews");
    }

    const review = doc.data()!;
    if (review.customerId !== customerId) {
        throw new ValidationError("You can only update your own reviews");
    }

    const updateData: any = { updatedAt: new Date().toISOString() };
    if (data.rating !== undefined) updateData.rating = data.rating;
    if (data.comment !== undefined) updateData.comment = data.comment;

    await db.collection(COLLECTION_NAME).doc(reviewId).update(updateData);
}

// delete review
export const deleteReview = async (
    reviewId: string
): Promise<void> => {

    const doc = await db.collection(COLLECTION_NAME)
        .doc(reviewId).get();

    if (!doc.exists) {
        throw new NotFoundError (`Review with ID ${reviewId} not found`);
    }

    await db.collection(COLLECTION_NAME).doc(reviewId).delete();
}