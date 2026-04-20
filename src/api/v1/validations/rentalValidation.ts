import Joi from "joi";

const statuses = ["Active", "Completed", "Cancelled", "Overdue"] as const;

/**
 * @openapi
 * components:
 *   schemas:
 *     Rental:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         toolId:
 *           type: string
 *         customerId:
 *           type: string
 *         quantity:
 *           type: integer
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         totalAmount:
 *           type: number
 *         status:
 *           type: string
 *           enum: [Active, Completed, Cancelled, Overdue]
 *         lateFee:
 *           type: number
 *     
 *     CreateRentalDTO:
 *       type: object
 *       required:
 *         - toolId
 *         - customerId
 *         - quantity
 *         - startDate
 *         - endDate
 *       properties:
 *         toolId:
 *           type: string
 *         customerId:
 *           type: string
 *         quantity:
 *           type: integer
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *     
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         error:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *             code:
 *               type: string
 */
export const rentalSchemas = {

    // POST - create new rental
    create: {
        body: Joi.object({
            toolId: Joi.string().required().messages({
                "any.required": "Tool ID is required",
                "string.empty": "Tool ID cannot be empty"
            }),
            // customerId: Joi.string().required().messages({
            //     "any.required": "Customer ID is required",
            //     "string.empty": "Customer ID cannot be empty"

            quantity: Joi.number().integer().min(1).required().messages({
                "any.required": "Quantity is required",
                "number.min": "Quantity must be at least 1",
                "number.integer": "Quantity must be a whole number",
                "number.base": "Quantity must be a number"
            }),
            startDate: Joi.date().iso().required().messages({
                "any.required": "Start date is required",
                "date.iso": "Start date must be a valid ISO date format",
                "date.base": "Start date must be a valid date"
            }),
            endDate: Joi.date().iso().greater(Joi.ref("startDate")).required().messages({
                "any.required": "End date is required",
                "date.iso": "End date must be a valid ISO date format",
                "date.greater": "End date must be after start date",
                "date.base": "End date must be a valid date"
            })
        })
    },

    // GET - rental by id
    getById: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Rental ID is required",
                "string.empty": "Rental ID cannot be empty"
            })
        })
    },

    // GET - rental by customer id
    getByCustomer: {
        params: Joi.object({
            customerId: Joi.string().required().messages({
                "any.required": "Customer ID is required",
                "string.empty": "Customer ID cannot be empty"
            })
        })
    },

    // GET - rental by tool
    getByTool: {
        params: Joi.object({
            toolId: Joi.string().required().messages({
                "any.required": "Tool ID is required",
                "string.empty": "Tool ID cannot be empty"
            })
        })
    },

    // PUT - update rental
    update: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Rental ID is required",
                "string.empty": "Rental ID cannot be empty",
            })
        }),
        body: Joi.object({
            endDate: Joi.date().iso().optional().messages({
                "date.iso": "End date must be a valid ISO date format",
                "date.base": "End date must be a valid date"
            }),
            status: Joi.string().valid(...statuses).optional().messages({
                "any.only": "Status must be one of: Active, Completed, Cancelled, Overdue"
            }),
        }).min(1).messages({
            "object.min": "At least one field must be provided for update"
        })
    },

    // POST - Extend rental
    extend: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Rental ID is required",
                "string.empty": "Rental ID cannot be empty"
            })
        }),
        body: Joi.object({
            newEndDate: Joi.date().iso().required().messages({
                "any.required": "New end date is required",
                "date.iso": "New end date must be a valid ISO date format",
                "date.base": "New end date must be a valid date"
            })
        })
    },

    // POST - Delete rental
    delete: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Rental ID is required",
                "string.empty": "Rental ID cannot be empty",
            }),
        }),
    },

    // POST - Cancel rental
    cancel: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Rental ID is required",
                "string.empty": "Rental ID cannot be empty"
            })
        })
    },

    // GET - all rentals
    list: {
        query: Joi.object({
            page: Joi.number().integer().min(1).default(1),
            limit: Joi.number().integer().min(1).max(100).default(10),
            status: Joi.string().valid(...statuses).optional(),
            customerId: Joi.string().optional(),
            sortBy: Joi.string().valid("startDate", "endDate", "createdAt", "totalAmount").default("startDate"),
            sortOrder: Joi.string().valid("asc", "desc").default("desc")
        })
    }

}