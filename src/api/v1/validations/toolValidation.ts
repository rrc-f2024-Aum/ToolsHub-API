import Joi from "joi";

const categories = ["Power_tools", "Hand_tools", "Gardening", "Painting", "Other"] as const;
const statuses = ["Available", "Rented", "Maintenance"] as const;

export const toolSchemas = {
    
    // POST - Create new tool
    create: {
        body: Joi.object({
            name: Joi.string().min(3).max(100).required().messages({
                "any.required": "Name is required",
                "string.empty": "Name cannot be empty",
                "string.min": "Name must be at least 3 characters",
                "string.max": "Name cannot exceed 100 characters"
            }),
            description: Joi.string().max(500).required().messages({
                "any.required": "Description is required",
                "string.empty": "Description cannot be empty",
                "string.max": "Description cannot exceed 500 characters"
            }),
            category: Joi.string().valid(...categories).required().messages({
                "any.required": "Category is required",
                "any.only": "Category must be one of: Power_tools, Hand_tools, Gardening, Painting, Other"
            }),
            hourlyRate: Joi.number().min(0.01).required().messages({
                "any.required": "Hourly rate is required",
                "number.min": "Hourly rate must be at least 0.01",
                "number.base": "Hourly rate must be a number"
            }),
            depositAmount: Joi.number().min(1).required().messages({
                "any.required": "Deposit amount is required",
                "number.min": "Deposit amount must be at least 1",
                "number.base": "Deposit amount must be a number"
            }),
            quantity: Joi.number().integer().min(1).required().messages({
                "any.required": "Quantity is required",
                "number.min": "Quantity must be at least 1",
                "number.integer": "Quantity must be a whole number",
            }),
            status: Joi.string().valid(...statuses).default("Available").messages({
                "any.only": "Status must be one of: Available, Rented, Maintenance",
            }),
        }),
    },

    // GET - Get single tool
    getById: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Tool ID is required",
                "string.empty": "Tool ID cannot be empty",
            }),
        })
    },

    // GET - Get tools by category
    getByCategory: {
        params: Joi.object({
            category: Joi.string().valid(...categories).required().messages({
                "any.required": "Category is required",
                "any.only": "Invalid category",
            })
        })
    },

    // PUT - Update tool
    update: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Tool ID is required",
                "string.empty": "Tool ID cannot be empty",
            })
        }),
        body: Joi.object({
            name: Joi.string().min(3).max(100).optional().messages({
                "string.min": "Name must be at least 3 characters",
                "string.max": "Name cannot exceed 100 characters"
            }),
            description: Joi.string().max(500).optional().messages({
                "string.max": "Description cannot exceed 500 characters"
            }),
            category: Joi.string().valid(...categories).optional().messages({
                "any.only": "Category must be one of: Power_tools, Hand_tools, Gardening, Painting, Other"
            }),
            hourlyRate: Joi.number().min(0.01).optional().messages({
                "number.min": "Hourly rate must be at least 0.01"
            }),
            depositAmount: Joi.number().min(1).optional().messages({
                "number.min": "Deposit amount must be at least 1"
            }),
            quantity: Joi.number().integer().min(1).optional().messages({
                "number.min": "Quantity must be at least 1"
            }),
            status: Joi.string().valid(...statuses).optional().messages({
                "any.only": "Status must be one of: Available, Rented, Maintenance"
            }),
        }).min(1).messages({
            "object.min": "At least one field must be provided for update"
        }),
    },

    // DELETE - Delete tool
    delete: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Tool ID is required",
                "string.empty": "Tool ID cannot be empty"
            }),
        }),
    },
};