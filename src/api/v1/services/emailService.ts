import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter;
let testAccountUrl: string;
let isReady = false;

//Initialize Ethereal test account
const initEmail = async () => {
    
    // Creates a fake test account automatically
    const testAccount = await nodemailer.createTestAccount();
    
    transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user, 
            pass: testAccount.pass 
        }
    });
    
    testAccountUrl = testAccount.web;
    isReady = true;
    console.log("Ethereal test email ready!");
    console.log("Preview emails at:", testAccountUrl);
};

// Simple function to send any email
export const sendEmail = async (
    to: string,
    subject: string,
    html: string
): Promise<void> => {
    if (!isReady) {
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const info = await transporter.sendMail({
        from: '"ToolHub" <test@ethereal.email>',
        to,
        subject,
        html
    });

    console.log("Email preview URL:", nodemailer.getTestMessageUrl(info));
};

// Initialize when server starts
initEmail().catch(console.error);

// Rental confirmation email
export const sendRentalConfirmation = async (
    customerEmail: string,
    customerName: string,
    toolName: string,
    startDate: string,
    endDate: string,
    totalAmount: number
): Promise<void> => {
    const html = `
        <h2>Rental Confirmation</h2>
        <p>Hi ${customerName},</p>
        <p>Your rental is confirmed!</p>
        <p><strong>Tool:</strong> ${toolName}</p>
        <p><strong>Start:</strong> ${new Date(startDate).toLocaleString()}</p>
        <p><strong>End:</strong> ${new Date(endDate).toLocaleString()}</p>
        <p><strong>Total:</strong> $${totalAmount.toFixed(2)}</p>
        <p>Thanks for using ToolHub!</p>
    `;
    
    await sendEmail(customerEmail, "ToolHub - Rental Confirmation", html);
};

// Overdue notification email
export const sendOverdueNotification = async (
    customerEmail: string,
    customerName: string,
    toolName: string,
    endDate: string,
    lateFee: number
): Promise<void> => {
    const html = `
        <h2 style="color: red;">Overdue Rental</h2>
        <p>Hi ${customerName},</p>
        <p>Your rental is overdue!</p>
        <p><strong>Tool:</strong> ${toolName}</p>
        <p><strong>Due Date:</strong> ${new Date(endDate).toLocaleString()}</p>
        <p><strong>Late Fee:</strong> $${lateFee.toFixed(2)}</p>
        <p>Please return the tool ASAP.</p>
    `;
    
    await sendEmail(customerEmail, "ToolHub - Overdue Rental Notice", html);
};

// Reminder email - 30mins before end time
export const sendReminderEmail = async (
    customerEmail: string,
    customerName: string,
    toolName: string,
    endDate: string
): Promise<void> => {
    const html = `
        <h2 style="color: #f39c12;">Rental Return Reminder</h2>
        <p>Hi ${customerName},</p>
        <p>Your rental of <strong>${toolName}</strong> is due in <strong>30 minutes</strong>!</p>
        <p><strong>Due Time:</strong> ${new Date(endDate).toLocaleString()}</p>
        <p>Please return the tool on time to avoid late fees.</p>
        <hr />
        <p>Thanks for using ToolHub!</p>
  `;

    await sendEmail(customerEmail, "ToolHub - Rental Due in 30 Minutes", html);
};