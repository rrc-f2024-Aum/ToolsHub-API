import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as toolService from "../services/toolService";
import { successResponse, errorResponse } from "../models/responseModel";
import { Tool } from "../models/toolModel";

export const checkHealth = (req: Request, res: Response): void => {
    const healthData = toolService.getHealthStatus();
    res.json(healthData);
}

// helper function to validate id
const validateId = (req: Request, res: Response): string | null => {
    const { id } = req.params;

    if(Array.isArray(id)) {
        res.status(HTTP_STATUS.BAD_REQUEST).json(
            errorResponse("Invalid tool ID format", "INVALID_ID")
        );
        return null;
    }

    if (!id) {
        res.status(HTTP_STATUS.BAD_REQUEST).json(
            errorResponse("Tool ID is required", "MISSING_ID")
        )
        return null;
    }
    return id;
}

// helper function to validate if tool exists
const validateToolExists = async(
    id: string, res: Response
): Promise<Tool | null> => {
    const tool = await toolService.getToolById(id);

    if(!tool) {
        res.status(HTTP_STATUS.NOT_FOUND).json(
            errorResponse("No tool not found", "TOOL_NOT_FOUND")
        );
        return null;
    }

    return tool;
}
// display all tools
export const displayAllTools = async(
    req: Request, res: Response, next: NextFunction
): Promise<void> => {

    try {
        const tools = await toolService.getAllTools();
        res.status(HTTP_STATUS.OK).json(
            successResponse(
                tools, "Tools retrieved successfully", tools.length
            )
        );
    } catch (error) {
        next(error);
    }   
}

// display tool by id
export const displayToolById = async(
    req: Request, res: Response, next: NextFunction
): Promise<void> => {
    try {
        const id = validateId(req, res);
        if (!id) return;

        const tool = await validateToolExists(id, res);
        if(!tool) return;

        res.status(HTTP_STATUS.OK).json(
            successResponse(tool, "Tool retrieved successfully")
        );
    } catch (error) {
        next(error);
    }
}

// generateTool
export const generateTool = async(
    req: Request, res: Response, next: NextFunction
): Promise<void> => {
    try {
        const toolData = req.body;

        if (!toolData.name || !toolData.category || !toolData.hourlyRate) {
            res.status(HTTP_STATUS.BAD_REQUEST).json(
                errorResponse(
                    "Missing required fields: name, category, hourlyRate",
                    "MISSING_FIELDS"
                )
            );
            return;
        }

        const newTool = await toolService.createTool(toolData);

        res.status(HTTP_STATUS.CREATED).json(
            successResponse( newTool, "Tool created successfully")
        )
    } catch (error) {
        next(error);
    }
}

// updateToolDetails by id
export const updateToolDetails = async(
    req: Request, res: Response, next: NextFunction
): Promise<void> => {
    try {
        const id = validateId(req, res);
        if (!id) return;

        const existingTool = await validateToolExists(id, res);
        if(!existingTool) return;

        const updateData = req.body;
        const updatedTool = await toolService.updateTool(id, updateData);

        res.status(HTTP_STATUS.OK).json(
            successResponse(updatedTool, "Tool updated successfully")
        );
    } catch (error) {
        next (error);
    }
}

// removeTool by id
export const removeTool = async(
    req: Request, res: Response, next: NextFunction
): Promise<void> => {
    try {

        const id = validateId(req, res);
        if(!id) return;

        const existingTool = await validateToolExists(id, res);
        if(!existingTool) return;

        await toolService.deleteTool(id);

        res.status(HTTP_STATUS.OK).json(
            successResponse(null, "Tool deleted successfully")
        );
    } catch (error) {
        next(error)
    }
}

// display tool by category
export const displayToolByCategory = async(
    req: Request, res: Response, next: NextFunction
): Promise<void> => {
    try {
        const { category } = req.params;

        if (!category) {
            res.status(HTTP_STATUS.BAD_REQUEST).json(
                errorResponse("Category is required", "MISSING_CATEGORY")
            );
            return;
        }

        const tools = await toolService.getToolsByCategory(category as Tool["category"]);

        if (tools.length === 0) {
            res.status(HTTP_STATUS.NOT_FOUND).json(
                errorResponse(`No tools found in category: ${category}`, "CATEGORY_NOT_FOUND")
            );
            return;
        }

        res.status(HTTP_STATUS.OK).json(
                successResponse(
                    tools,
                    `Tools in ${category} category retrieved successfully`,
                    tools.length
                )
            );

    } catch (error) {
        next (error);
    }
}