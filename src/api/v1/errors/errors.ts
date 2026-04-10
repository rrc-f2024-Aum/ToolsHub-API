import { HTTP_STATUS } from "../../../constants/httpConstants";

export class AppError extends Error {
    constructor(
        public message: string,
        public code: string,
        public statusCode: number
    ) {
        super(message);
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundError extends AppError {
    constructor(
        message: string,
        code: string = "NOT_FOUND",
        statusCode: number = HTTP_STATUS.NOT_FOUND
    ) {
        super(message, code, statusCode);
    }
}

export class ValidationError extends AppError {
    constructor(
        message: string,
        code: string = "VALIDATION_ERROR",
        statusCode: number = HTTP_STATUS.BAD_REQUEST
    ) {
        super(message, code, statusCode);
    }
}

export class ConflictError extends AppError {
    constructor(
        message: string,
        code: string = "CONFLICT_ERROR",
        statusCode: number = HTTP_STATUS.CONFLICT
    ) {
        super(message, code, statusCode);
    }
}

export class AuthenticationError extends AppError {
    constructor(
        message: string,
        code: string = "AUTHENTICATION_ERROR",
        statusCode: number = HTTP_STATUS.UNAUTHORIZED
    ) {
        super(message, code, statusCode);
    }
}

export class AuthorizationError extends AppError {
    constructor(
        message: string,
        code: string = "AUTHORIZATION_ERROR",
        statusCode: number = HTTP_STATUS.FORBIDDEN
    ) {
        super(message, code, statusCode);
    }
}