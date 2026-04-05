import { Router } from "express";
import * as rentalController from "../controllers/rentalController";

const router = Router();

// GET - all rentals
router.get("/", rentalController.displayAllRentals);

// GET - by customer Id
router.get("/customer/:customerId", rentalController.displayRentalsByCustomer);

// GET - by rental Id
router.get("/:id", rentalController.displayRentalByIf);

// POST - create new rental
router.post("/", rentalController.generateRental);

// DELETE - rental by Id
router.post("/:id/cancel", rentalController.cancelRental);

export default router;