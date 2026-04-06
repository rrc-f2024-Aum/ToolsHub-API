# New Component Research: node-cron + nodemailer

## Project: ToolsHub API
**Student:** Aum Mistry
**Date:** April 5, 2026

---

## Components I Will Implement

I will add both components to my project:
1. **node-cron** - Automatic overdue rental checking.
2. **nodemailer** - Email notifications for customers.

---

## Component 1: node-cron (Scheduled Tasks)

### What it does
Runs code automatically at scheduled times. I will use it to check for overdue rentals and trigger email notifications.

### Schedule
I will run the check **every 15 minutes** (`*/15 * * * *`). This catches overdue rentals within 15 minutes of their end time.

### What it will do
- Find all active rentals where endDate is past current time.
- Calculate late fees (days overdue x hourlyRate x quantity).
- Update rental status to "overdue".
- Trigger nodemailer to send overdue notification emails.

--- 

## Component 2: nodemailer (Email Notifications)

### What it does
Sends real emails from my API. I will use it to notify customers about their rentals.

### What emails I will send

**Rental Confirmation** 
- WHEN: After staff creates rental.
- PURPOSE: Customer knows rental is confirmed with start/end time.

**30-Minute Reminder** 
- WHEN: 30 minutes before end time.
- PURPOSE: Reminds customer rental is ending soon.

**Overdue Notification** 
- WHEN: when rental becomes overdue.
- PURPOSE: Tell customer about late fee charges.

---

## Implementation Target

My plan is to implement node-cron first in Milestone 2 and then add nodemailer in Milestone 3.