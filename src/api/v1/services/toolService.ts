import { Tool, CreateToolDTO } from "../models/toolModel";
import * as firestoreRepository from "../repositories/firestoreRepository";

const COLLECTION_NAME = "tools";

// Health check
export const getHealthStatus = () => {
    return {
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0"
    }
}

// Helper function to format Firestore data
const formatToolData = (doc: FirebaseFirestore.DocumentSnapshot): Tool => {
    const data = doc.data()!;

    const formatDate = (dateValue: any): string => {
        if (dateValue && typeof dateValue === 'object' && '_seconds' in dateValue) {
            return new Date(dateValue._seconds * 1000).toISOString();
        }
        return dateValue ? new Date(dateValue).toISOString() : new Date().toISOString();
    }

    return {
        id: doc.id,
        name: data.name,
        description: data.description,
        category: data.category,
        hourlyRate: data.hourlyRate,
        depositAmount: data.depositAmount,
        quantity: data.quantity,
        status: data.status ?? 'Available',
        createdAt: formatDate(data.createdAt)
    } as Tool;
}

// Create tool
export const createTool = async (toolData: CreateToolDTO): Promise<string> => {
    try {
        const snapshot = await firestoreRepository.getDocuments(COLLECTION_NAME);

        let nextId = "tool_000001";
        if (!snapshot.empty) {
            const ids: number[] = [];
            snapshot.forEach(doc => {
                const match = doc.id.match(/tool_(\d+)/);
                if (match) {
                    ids.push(parseInt(match[1], 10));
                }
            });

            if (ids.length > 0) {
                const maxId = Math.max(...ids);
                const nextNumber = maxId + 1;
                nextId = `tool_${nextNumber.toString().padStart(6, "0")}`;
            }
        }

        const now = new Date().toISOString();
        const toolDataWithTime = {
            ...toolData,
            status: toolData.status ?? 'Available',
            createdAt: now
        };

        const toolId = await firestoreRepository.createDocument<Tool>(
            COLLECTION_NAME,
            toolDataWithTime,
            nextId
        );

        return toolId;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to create tool: ${errorMessage}`);
    }
}

// Get all tools
export const getAllTools = async (): Promise<Tool[]> => {
    try {
        const snapshot = await firestoreRepository.getDocuments(COLLECTION_NAME);

        const tools: Tool[] = [];
        snapshot.forEach((doc) => {
            tools.push(formatToolData(doc));
        });

        return tools;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to fetch tools: ${errorMessage}`);
    }
}

// Get tool by ID
export const getToolById = async (id: string): Promise<Tool | null> => {
    try {
        const doc = await firestoreRepository.getDocumentById(COLLECTION_NAME, id);

        if (!doc) {
            return null;
        }

        return formatToolData(doc);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to fetch tool ${id}: ${errorMessage}`);
    }
}

// Update tool by ID
export const updateTool = async (
    id: string,
    toolData: Partial<CreateToolDTO>
): Promise<void> => {
    try {
        await firestoreRepository.updateDocument<CreateToolDTO>(
            COLLECTION_NAME,
            id,
            toolData
        );
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to update tool ${id}: ${errorMessage}`);
    }
}

// Delete tool by ID
export const deleteTool = async (id: string): Promise<void> => {
    try {
        await firestoreRepository.deleteDocument(COLLECTION_NAME, id);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to delete tool ${id}: ${errorMessage}`);
    }
}

// Get tools by category
export const getToolsByCategory = async (category: Tool["category"]): Promise<Tool[]> => {
    try {
        const snapshot = await firestoreRepository.findByField(COLLECTION_NAME, "category", category);

        const tools: Tool[] = [];
        snapshot.forEach((doc) => {
            tools.push(formatToolData(doc));
        });

        return tools;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to fetch tools by category ${category}: ${errorMessage}`);
    }
}