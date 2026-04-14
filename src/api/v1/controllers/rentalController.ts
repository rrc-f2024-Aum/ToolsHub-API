import { Request, Response, NextFunction  } from "express";
import * as rentalService from "../services/rentalService";
import { successResponse, errorResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { Rental } from "../models/rentalModel";

// helper function
const validateId = (req: Request, res: Response, 
    resourceName: string = "rental"
): string | null => {
    const { id } = req.params;

    if (Array.isArray(id)) {
        res.status(HTTP_STATUS.BAD_REQUEST).json(
            errorResponse(`Invalid ${resourceName} ID format.`, "INVALID_ID")
        );
        return null;
    }

    if (!id) {
        res.status(HTTP_STATUS.BAD_REQUEST).json(
            errorResponse(`${resourceName} ID is required`, "MISSING_ID")
        );
        return null;
    }

    return id;
}

// helper function
const validateRentalExists = async(id: string, res: Response
): Promise<Rental | null> =>{

    const rental = await rentalService.getRentalById(id);

    if(!rental) {
        res.status(HTTP_STATUS.NOT_FOUND).json(
            errorResponse("No rental found", "RENTAL_NOT_FOUND")
        );
        return null;
    }

    return rental;
}

// helper function
const validateRentalData = (data: any, res: Response): boolean => {

    const requiredFields = ["toolId", "customerId", "quantity",
        "startDate", "endDate"];
    
    const missingFields = requiredFields.filter(field => !data[field]);

    if (missingFields.length > 0) {
        res.status(HTTP_STATUS.BAD_REQUEST).json(
            errorResponse(`Missing required fields: ${missingFields.join(", ")}`,
        "MISSING_FIELDS")
        );
        return false;
    }

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    if(isNaN(startDate.getTime()) || isNaN(endDate.getTime())){
        res.status(HTTP_STATUS.BAD_REQUEST).json(
            errorResponse("Invalid date format", "INVALID_DATE")
        );
        return false;
    }

    if (startDate >= endDate) {
        res.status(HTTP_STATUS.BAD_REQUEST).json(
            errorResponse("Start date must be before end date", "INVALID_DATE_RANGE")
        );
        return false;
    }
    return true;
}

// display all rentals
export const displayAllRentals = async(
    req: Request, res: Response, next: NextFunction
): Promise<void> => {
    try {
        const rentals = await rentalService.getAllRentals();
        res.status(HTTP_STATUS.OK).json(
            successResponse(
                rentals,
                "Rentals retrieved successfully",
                rentals.length
            )
        )
    } catch (error) {
        next(error);
    }
}

// display rental by id
export const displayRentalById = async(
    req: Request, res: Response, next: NextFunction
): Promise<void> => {
    
    try {
        const id = validateId(req, res);
        if (!id) return;

        const rental = await validateRentalExists(id, res);
        if(!rental) return;

        res.status(HTTP_STATUS.OK).json(
            successResponse( rental, "Rental retrieved successfully")
        );
    } catch (error) {
        next (error);
    }
}

// generate new rental
export const generateRental = async (
    req: Request, res: Response, next: NextFunction
): Promise<void> => {

    try {
        const rentalData = req.body;

        if(!validateRentalData(rentalData, res))
            return;

        const rentalId = await rentalService.createRental(rentalData);

        if(!rentalId) {
            res.status(HTTP_STATUS.BAD_REQUEST).json(
                errorResponse("Tool not available or not found",
                    "TOOL_NOT_AVAILABLE"
                )
            );

            return;
        }

        const newRental = await rentalService.getRentalById(rentalId);

        res.status(HTTP_STATUS.CREATED).json(
            successResponse(newRental, "Rental created successfully")
        );
    } catch (error) {
        next (error);
    }
}

// cancel rental by id
export const cancelRental = async (
    req: Request, res: Response, next: NextFunction
): Promise<void> => {

    try {
        const id = validateId(req, res);
        if (!id) return;

        const rental = await validateRentalExists(id, res);
        if (!rental) return;

        if (rental.status !== "Active") {
            res.status(HTTP_STATUS.BAD_REQUEST).json(
                errorResponse(
                    `Cannot cancel rental with status: ${rental.status}`,
                    "INVALID_RENTAL_STATUS"
                )
            );
            return;
        }

        const cancelledRental = await rentalService.cancelRental(id);

        res.status(HTTP_STATUS.OK).json(
            successResponse(cancelledRental, "Rental cancelled successfully")
        );
    } catch (error) {
        next(error)
    }
}

// get rentals by customer ID
export const displayRentalsByCustomer = async(
    req: Request, res: Response, next: NextFunction
): Promise<void> =>  {

    try {
        const { customerId } = req.params;

        if (Array.isArray(customerId)) {
            res.status(HTTP_STATUS.BAD_REQUEST).json(
                errorResponse("Invalid customer ID format", "INVALID_CUSTOMER_ID")
            );
            return;
        }
        if (!customerId) {
            res.status (HTTP_STATUS.BAD_REQUEST).json(
                errorResponse("Customer ID is required", "MISSING_CUSTOMER_ID")
            );
            return;
        }

        const rentals = await rentalService.getRentalsByCustomer(customerId);

        res.status(HTTP_STATUS.OK).json(
            successResponse(rentals, 
                "Rental retrieved successfully",
                rentals.length
            )
        );
    } catch (error) {
        next (error);
    }
}

// get rentals by tool ID
export const displayRentalsByTool = async(
    req: Request, res: Response, next: NextFunction
): Promise<void> => {
    try {
        const { toolId } = req.params;

        if (Array.isArray(toolId)) {
            res.status(HTTP_STATUS.BAD_REQUEST).json(
                errorResponse("Invalid tool ID format", "INVALID_TOOL_ID")
            );
            return;
        }

        const rentals = await rentalService.getRentalsByTool(toolId);
        res.status(HTTP_STATUS.OK).json(
            successResponse(rentals, "Rentals retrieved successfully", rentals.length)
        );

    } catch (error) {
        next(error);
    }
}

// display active rentals
export const displayActiveRentals = async(
    req: Request, res: Response, next: NextFunction
): Promise<void> =>  {
    try {
        const rentals = await rentalService.getActiveRentals();
        res.status(HTTP_STATUS.OK).json(
            successResponse(rentals, "Active rentals retrieved successfully",
                rentals.length
            )
        );

    } catch (error) {
        next(error);
    }

}

// display overdue rentals
export const displayOverdueRentals = async(
    req: Request, res: Response, next: NextFunction
): Promise<void> => {
    try {
        const rentals = await rentalService.getOverdueRentals();
        res.status(HTTP_STATUS.OK).json(
            successResponse(rentals, "Overdue rentals retrieved successfully",
                rentals.length
            )
        );
    
    } catch (error) {
        next(error);
    }
}

// rental return
export const returnRental = async(
    req: Request, res: Response, next: NextFunction
): Promise<void> => {
    try {
        const id = validateId(req, res);
        if (!id) return;

        const rental = await validateRentalExists(id, res);
        if (!rental) return;

        if (rental.status !== "Active") {
            res.status(HTTP_STATUS.BAD_REQUEST).json(
                errorResponse(`Cannot return rental with status: ${rental.status}`,
                    "INVALID_RENTAL_STATUS"
                )
            );
            return;
        }
        
        await rentalService.returnRental(id);
        res.status(HTTP_STATUS.OK).json(successResponse(null, "Rental returned successfully"));

    } catch (error) {
        next(error);
    }
}

// update rental details
export const updateRentalDetails = async(
    req: Request, res: Response, next: NextFunction
): Promise<void> => {
    try {
        const id = validateId(req, res);
        if (!id) return;

        const rental = await validateRentalExists(id, res);
        if (!rental) return;

        const { endDate, status } = req.body;
        await rentalService.updateRental(id, { endDate, status });

        const updatedRental = await rentalService.getRentalById(id);
        res.status(HTTP_STATUS.OK).json(
            successResponse(updatedRental, 
                "Rental updated successfully"
            )
        );

    } catch (error) {
        next(error);
    }
}