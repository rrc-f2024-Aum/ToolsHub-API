import { Tool, CreateToolDTO } from "../models/toolModel";

// Health Check
export const getHealthStatus = () => {
    return {
        status: "OK",
        uptime: process.uptime(),
        timeStamp: new Date().toISOString(),
        version: "1.0.0"
    }
}

// creating in-memory storage for milestone 1, will update it to firebase in milestone 2
let tools: Tool[] = [];
let nextId = 1;

// GET - all tools
export const getAllTools = async(): Promise<Tool[]> => {
    return tools;
}

// GET - a tool by id
export const getToolById = async(
    id: string
): Promise<Tool | null> => {
    const tool = tools.find(t => t.id === id);
    return tool || null;
}

// POST - create a new tool
export const createTool = async (
    data: CreateToolDTO
): Promise<Tool> => {

    const newTool: Tool = {
        id: String(nextId++),
        name: data.name,
        description: data.description,
        category: data.category,
        dailyRate: data.dailyRate,
        depositAmount: data.depositAmount,
        quantity: data.quantity,
        status: data.status || "Available",
        createdAt: new Date().toISOString()
    };
    tools.push(newTool);
    return newTool;
}

// PUT - update a tool details by id
export const updateTool = async (
    id: string,
    data: Partial<CreateToolDTO>
): Promise<Tool | null> => {

    const index = tools.findIndex(t => t.id === id);
    if (index === -1) 
        return null;

    tools[index] = {
        ...tools[index],
        ...data
    };
    return tools[index];
}

// DELETE - Delete a tool by id
export const deleteTool = async(
    id: string
): Promise<boolean> => {
    
    const index = tools.findIndex(t => t.id === id);
    if (index === -1)
        return false;

    tools.splice(index, 1);
    return true;
}

// GET - tools by category
export const getToolsByCategory = async(
    category: Tool["category"]
): Promise<Tool[]> => {

    return tools.filter(tool => tool.category === category)
}