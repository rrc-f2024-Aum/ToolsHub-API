import app from "./app";
import { Server } from "http";
import { startScheduledTasks } from "./api/v1/services/schedulerService";

const PORT: string | number = process.env.PORT || 3000;

startScheduledTasks();

const server: Server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export { server };