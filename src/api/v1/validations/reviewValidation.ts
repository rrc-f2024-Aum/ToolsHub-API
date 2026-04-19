import Joi from "joi";

export const reviewSchemas = {

    //post - create review
    create: {
        params: Joi.object({
            rentalId: Joi.string().required().messages({
                "any.required": "Rental ID is required",
                "string.empty": "Rental ID cannot be empty"
            })
        }),
        body: Joi.object({
            rating: Joi.number().integer().min(1).max(5).required().messages({
                "any.required": "Rating is required",
                "number.min": "Rating must be at least 1",
                "number.max": "Rating cannot exceed 5",
                "number.integer": "Rating must be a whole number",
                "number.base": "Rating must be a number"
            }),
            comment: Joi.string().min(1).max(500).required().messages({
                "any.required": "Comment is required",
                "string.empty": "Comment cannot be empty",
                "string.min": "Comment must be at least 1 character",
                "string.max": "Comment cannot exceed 500 characters"
            })
        })
    },

    // get by tool id
    getByTool: {
        params: Joi.object({
            toolId: Joi.string().required().messages({
                "any.required": "Tool ID is required",
                "string.empty": "Tool ID cannot be empty"
            })
        })
    },

    // put - Update a review
    update: {
        params: Joi.object({
            reviewId: Joi.string().required().messages({
                "any.required": "Review ID is required",
                "string.empty": "Review ID cannot be empty"
            })
        }),
        body: Joi.object({
            rating: Joi.number().integer().min(1).max(5).optional().messages({
                "number.min": "Rating must be at least 1",
                "number.max": "Rating cannot exceed 5",
                "number.integer": "Rating must be a whole number"
            }),
            comment: Joi.string().min(1).max(500).optional().messages({
                "string.empty": "Comment cannot be empty",
                "string.min": "Comment must be at least 1 character",
                "string.max": "Comment cannot exceed 500 characters"
            })
        }).min(1).messages({
            "object.min": "At least one field must be provided for update"
        })
    },

    // delete - delete review
    delete: {
        params: Joi.object({
            reviewId: Joi.string().required().messages({
                "any.required": "Review ID is required",
                "string.empty": "Review ID cannot be empty"
            })
        })
    }
}