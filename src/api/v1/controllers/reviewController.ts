import { Request, Response, NextFunction } from "express";
import * as reviewService from "../services/reviewService";
import { successResponse, errorResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";

const validateId = (
    param: string | string[],
    paramName: string
): string | null => {
    if (Array.isArray(param)) {
        return null;
    }

    if (!param) {
        return null;
    }

    return param;
}

// create review
export const generateReview = async(
    req: Request, res: Response, next: NextFunction
): Promise<void> => {

    try {
        const { rentalId } = req.params;
        const customerId = res.locals.uid;
        const reviewData = req.body;

        const validRentalId = validateId(rentalId, "rentalId");
        if (!validRentalId) {
            res.status(HTTP_STATUS.BAD_REQUEST).json(
                errorResponse("Invalid rental ID", "INVALID_RENTAL_ID")
            );
            return;
        }

        const reviewId = await reviewService.createCustomerReview(validRentalId,
            customerId, reviewData);

        const newReview = await reviewService.getReviewByTool(reviewData.toolId);

        res.status(HTTP_STATUS.CREATED).json(
            successResponse({ reviewId, review: newReview[0]},
                "Review created successfully"
            )
        );
    
    } catch (error) {
        next(error);
    } 
}

// get reviews by tool id
export const displayReviewsByTool = async(
    req: Request, res: Response, next: NextFunction
): Promise<void> => {

    try {
        const { toolId } = req.params;

        const validToolId = validateId(toolId, "toolId");
        if (!validToolId) {
            res.status(HTTP_STATUS.BAD_REQUEST).json(
                errorResponse("Invalid tool ID", "INVALID_TOOL_ID")
            );
            return;
        }

        const reviews = await reviewService.getReviewByTool(validToolId);

        res.status(HTTP_STATUS.OK).json(
            successResponse(reviews, "Reviews retrieved successfully",
                reviews.length
            )
        );

    } catch (error) {
        next(error);
    }
}

// update review
export const updateReviewDetails = async(
    req: Request, res: Response, next: NextFunction
): Promise<void> => {

    try {
        const { reviewId } = req.params;
        const customerId = res.locals.uid;
        const updateData = req.body;

        const validReviewId = validateId(reviewId, "reviewId");
        if (!validReviewId) {
            res.status(HTTP_STATUS.BAD_REQUEST).json(
                errorResponse("Invalid review ID", "INVALID_REVIEW_ID")
            );
            return;
        }

        await reviewService.updateReview(validReviewId, customerId, updateData);

        res.status(HTTP_STATUS.OK).json(
            successResponse(null, "Review updated successfully")
        );
    
    } catch (error) {
        next(error);
    }
}

// delete review
export const deleteReview = async(
    req: Request, res: Response, next: NextFunction
): Promise<void> => {
    try {
        const { reviewId } = req.params;

        const validReviewId = validateId(reviewId, "reviewId");
        if (!validReviewId) {
            res.status(HTTP_STATUS.BAD_REQUEST).json(
                errorResponse("Invalid review ID", "INVALID_REVIEW_ID")
            );
            return;
        }

        await reviewService.deleteReview(validReviewId);

        res.status(HTTP_STATUS.OK).json(
            successResponse(null, "Review deleted successfully")
        );
    
    } catch (error) {
        next(error);
    }
}
