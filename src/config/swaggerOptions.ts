import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "ToolsHub API - Tool Rental Management Platform",
            version: "1.0.0",
            description: "API documentation for the ToolsHub application with CRUD operations for tools and rentals.",
        },
        servers: [
            {
                url: "http://localhost:3000/api/v1",
                description: "Local server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },

        schemas: {
            Tool: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    description: { type: "string" },
                    category: { type: "string", enum: ["Power_tools", "Hand_tools", "Gardening", "Painting", "Other"] },
                    hourlyRate: { type: "number" },
                    depositAmount: { type: "number" },
                    quantity: { type: "integer" },
                    status: { type: "string", enum: ["Available", "Rented", "Maintenance"] },
                    createdAt: { type: "string", format: "date-time" }
                }
            },
            CreateToolDTO: {
                type: "object",
                    required: ["name", "description", "category", "hourlyRate", "depositAmount", "quantity"],
                properties: {
                    name: { type: "string", minLength: 3, maxLength: 100 },
                    description: { type: "string", maxLength: 500 },
                    category: { type: "string", enum: ["Power_tools", "Hand_tools", "Gardening", "Painting", "Other"] },
                    hourlyRate: { type: "number", minimum: 0.01 },
                    depositAmount: { type: "number", minimum: 1 },
                    quantity: { type: "integer", minimum: 1 },
                    status: { type: "string", enum: ["Available", "Rented", "Maintenance"] }
                }
            },
            Rental: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    toolId: { type: "string" },
                    customerId: { type: "string" },
                    quantity: { type: "integer" },
                    startDate: { type: "string", format: "date-time" },
                    endDate: { type: "string", format: "date-time" },
                    totalAmount: { type: "number" },
                    status: { type: "string", enum: ["Active", "Completed", "Cancelled", "Overdue"] },
                    lateFee: { type: "number" },
                    reminderSent: { type: "boolean" },
                    createdAt: { type: "string", format: "date-time" },
                    returnedAt: { type: "string", format: "date-time" }
                }
            },
            CreateRental: {
                    type: "object",
                    required: ["toolId", "customerId", "quantity", "startDate", "endDate"],
                    properties: {
                        toolId: { type: "string" },
                        customerId: { type: "string" },
                        quantity: { type: "integer", minimum: 1 },
                        startDate: { type: "string", format: "date-time" },
                        endDate: { type: "string", format: "date-time" }
                    }
                },
                ErrorResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: false },
                        error: {
                            type: "object",
                            properties: {
                                message: { type: "string" },
                                code: { type: "string" }
                            }
                        },
                        timestamp: { type: "string", format: "date-time" }
                    }
                }
            }

        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./src/api/v1/routes/*.ts", "./src/api/v1/validations/*.ts"], // Paths to API docs
};

export const generateSwaggerSpec = (): object => {
    return swaggerJsdoc(swaggerOptions);
};