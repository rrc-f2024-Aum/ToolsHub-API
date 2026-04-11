# Project Planning and Proposal Document

## ToolsHub API - Centralized Tool Rental Shop Management System

**Course**: Back-end Development Capstone  
**Project Title**: ToolHub API - Tool Rental Management Platform  
**Student Name**: Aum Mistry  
**Date**: March 29, 2026

---

## 1. Project Concept

### Purpose

ToolHub API is a RESTful back-end service that powers a centralized tool rental shop. The API enables three different user types to perform their specific roles:

- **Customers** can browse available tools, check pricing and availability, and leave reviews after completing a rental.

- **Staff** manage the entire rental contract lifecycle including creating contracts, editing and extending contracts (when no future bookings exist), canceling contracts, processing returns, and applying late fees.

- **Admin** controls inventory (add, remove, edit tools), views weekly, monthly, and annual earning reports, and manages staff accounts.

The system automates critical business logic including availability checking, late fee calculation, and provides a clean separation of concerns between roles.

### Why I Chose This Theme

- **Real-world relevance** - Tool rental solves actual problems such as expensive tools, limited storage space, and occasional use needs.

- **Natural role separation** - Three different roles with clear, non-overlapping responsibilities.

- **Business logic** - Availability checking, date calculations, late fees, and inventory management.

- **Perfect for auth demonstration** - Role-based access control is essential.

- **Scalable concept** - Same architecture works for any rental domain including party supplies, cameras, or sports equipment.

---

## 2. Planned Functionality

### Core Resources

The API includes four main resources plus the Users resource required for authentication.

**Users** - Authentication and role management with fields for email, name, role (customer, staff, or admin), phone, and address.

**Tools** - Shop inventory with fields for name, description, category, hourlyRate, depositAmount, quantity, and status.

**Rentals** - Rental contracts with fields for toolId, customerId, startDate, endDate, totalAmount, lateFee, and status.

**Reviews** - Customer feedback with fields for toolId, rentalId, rating (1 to 5), and comment.

### Role-Based Permissions

**Customer Permissions**

Customers can:
- View list of tools
- See pricing for each tool
- Check if a tool is available
- Leave a review after completing a rental
- View reviews for a tool

Customers cannot:
- Add, remove, or edit tools
- Create, edit, extend, or cancel rental contracts
- View earning reports
- Manage staff accounts

**Staff Permissions**

Staff can:
- View list of tools
- See pricing for each tool
- Check if a tool is available
- Create contracts for customers
- Edit contracts
- Extend contracts (only if no future booking exists)
- Cancel contracts
- View all contracts
- View customer contract history
- Accept tool returns
- Apply late fees on overdue returns
- Leave reviews
- View reviews for a tool

Staff cannot:
- Add, remove, or edit tools
- View earning reports
- Manage staff accounts
- Delete reviews

**Admin Permissions**

Admin can do everything that Staff can do, plus:

- Add new tools to inventory
- Remove tools from inventory
- Edit tool details (price, description, quantity)
- View weekly, monthly and annual earning reports
- Manage staff accounts (add or remove staff)
- View all registered customers
- Delete inappropriate reviews

### Key Business Rules

**No Online Reservations**

Customers browse tools online to check availability and pricing. Rental contracts are created in-store by staff only. Customers cannot create or reserve anything online, only view.

**Contract Extensions**

Staff can extend a contract only if the tool is not already booked for future dates. The system checks availability before allowing extension.

**Late Fees**

Late fees are applied by staff when processing a return. Calculation is hours overdue multiplied by the hourly rate. Customers receive email notifications 30 minutes before rental ends and when rental becomes overdue.

**Tool Availability Status**

Tools can have three statuses: Available (can be rented), Rented (currently in a contract), or Maintenance (not available, admin only).

**Reviews**

Customers can only leave reviews after they have rented and returned a tool. Reviews are tied to a specific rental contract.

### Planned Endpoints

**Tools Endpoints**

These endpoints handle tool browsing and inventory management.

- GET /tools - List all tools
- GET /tools/:id - Get tool details
- GET /tools/categories - List all categories

The following endpoints are for Admin only:
- POST /tools - Add new tool
- PUT /tools/:id - Update tool
- DELETE /tools/:id - Delete tool

**Rentals Endpoints**

These endpoints handle rental contract management for Staff and Admin.

- GET /rentals - View all rentals
- GET /rentals/:id - View any rental by id
- POST /rentals - Create contract for customer
- PUT /rentals/:id - Edit or extend contract
- POST /rentals/:id/return - Process tool return
- DELETE /rentals/:id - Cancel contract
- GET /rentals/active - View active rentals
- GET /rentals/overdue - View overdue rentals

**Reviews Endpoints**

These endpoints handle customer reviews.

- GET /tools/:id/reviews - Anyone can view reviews
- POST /rentals/:id/review - Customer leaves review after rental completion
- PUT /reviews/:id - Update own review
- DELETE /reviews/:id - Admin only, delete any review

**Admin Analytics Endpoints**

These endpoints are for Admin only.

- GET /admin/reports- list earnings report
- GET /admin/stats/popular-tools - Most rented tools
- GET /admin/users - List all registered users

### Data Validation with Joi

**Tool Validation Rules**

- name: required, 3 to 100 characters
- description: required, maximum 500 characters
- category: required, must be one of power_tools, hand_tools, gardening, painting, or other
- hourlyRate: required, minimum 0.01
- depositAmount: required, minimum $1
- quantity: required, must be an integer

**Rental Validation Rules**

- toolId: required
- customerId: required
- quantity: required, minimum 1
- startDate: required, cannot be in the past
- endDate: required, must be after startDate, maximum 30 days duration

**Review Validation Rules**

- rating: required, integer between 1 and 5
- comment: optional, maximum 500 characters

**User Validation Rules**

- email: required, must be valid email format
- name: required, 2 to 100 characters
- phone: optional, must follow international phone format
- address: optional, maximum 200 characters

### Error Handling Strategy

The API will use a global error handler middleware that catches all errors and returns consistent JSON responses. Custom error classes will be created for common scenarios including:

- NotFoundError - When a requested resource does not exist
- ValidationError - When request data fails Joi validation
- UnauthorizedError - When authentication token is missing or invalid
- ForbiddenError - When a user tries to access a resource without proper role permissions
- ConflictError - When attempting to rent a tool that is already rented

---

## 3. Course Content Alignment

### Directly Aligned with Course Requirements

**Node.js + TypeScript + Express** - Full TypeScript implementation with Express framework

**Firebase Firestore** - Collections for users, tools, rentals, and reviews

**Firebase Authentication** - Email and password authentication with token verification middleware

**Role-based Authorization** - Firebase custom claims for customer, staff, and admin roles

**Layered Architecture** - Routes layer, Controllers layer, Services layer, and Repository layer

**CRUD Operations** - Full CRUD for Tools, Rentals, and Reviews

**Joi Validation** - Request body validation for all POST and PUT endpoints

**Swagger and OpenAPI** - Complete API documentation with examples

**Helmet.js and CORS** - Security headers and CORS configuration

**dotenv** - Environment variables for Firebase configuration and email credentials

**GitHub** - Issues, milestones, and branch strategy with main, development, and feature branches

### Extras Outside Course Scope

**Node-cron**

This component automates overdue rental detection and late fee assessment without manual intervention. A cron job running every 15 minutes will scan for overdue rentals, calculate late fees based on hourly rates, and trigger email notifications

**Nodemailer**

This component provides professional user experience with email confirmations and reminders. The system will send rental confirmation emails, 30-minute return reminder, and overdue notifications with late fee amounts.

---

## 4. Technology Stack Summary

The following technologies are required and will be used:

- Node.js with TypeScript and Express
- Firebase Firestore and Authentication
- Swagger and OpenAPI for documentation
- Joi for validation
- dotenv, helmet.js, and CORS
- Node-cron for scheduled tasks
- Nodemailer for email notifications
- GitHub for version control

---

## 5. GitHub Project Management Plan

### Branch Strategy

The project follows Git Workflow with these branches:

- **main** - Production-ready code for final submissions only
- **development** - Integration branch for completed features
- **feature** - Will create separate feature branch for each features.

### Milestone Task Breakdown

**Pre-Milestone (March 29th, 2026)**

- Research project themes
- Write proposal document
- Create GitHub repository

**Milestone 1 (April 5th, 2026)**

- Initialize Node.js with TypeScript and Express project
- Build Tools CRUD with Joi validation for admin only
- Build basic Rentals CRUD
- Configure Swagger documentation
- Research node-cron and nodemailer and document findings

**Milestone 2 (April 11th, 2026)**

- Configure Firebase Admin SDK
- Implement authentication middleware
- Create repository layer for Firestore
- Implement availability checking logic
- Complete Rentals resource with create, edit, extend, return, and cancel
- Set up node-cron job skeleton
- Complete cron job with overdue detection and fee calculation
- Prepare sprint demo

**Milestone 3 (April 19th, 2026)**

- Integrate nodemailer for basic emails
- Add role-based middleware for customer, staff, and admin
- Add email queue system
- Build Reviews resource
- Build Admin reports for weekly, monthly, and annual earnings
- Add advanced filtering for categories and price ranges
- Complete all Swagger documentation
- Final code cleanup and refactoring

**Final Project Demonstration (April 24th, 2026)**

---

## 6. References and Resources

Node-cron Documentation - https://www.npmjs.com/package/node-cron

Nodemailer Documentation - https://nodemailer.com/about/

Swagger and OpenAPI - https://swagger.io/specification/
