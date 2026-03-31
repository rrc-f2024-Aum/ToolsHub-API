export const successResponse = (
    data: any, message: string,  count?: number
)=> ({
    message,
    count,
    data
});

export const errorResponse = (message: string, code: string) => ({
    success: false,
    error: {
        message,
        code,
    },
    timestamp: new Date().toISOString(),
});