import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CRM Software API",
      version: "1.0.0",
      description:
        "📘 Interactive API documentation for the CRM System — includes Auth, Users, Customers, Leads, Tasks, Sales, and Notifications.",
    },
    servers: [
      { url: "http://localhost:5000/api", description: "Local Server" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64ff1d2e8b95a12345cde678" },
            name: { type: "string", example: "Raju Sharma" },
            email: { type: "string", example: "raju@example.com" },
            role: {
              type: "string",
              enum: ["admin", "sales"],
              example: "sales",
            },
          },
        },
        Customer: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64ff1d2e8b95a12345cde678" },
            name: { type: "string", example: "Tech Solutions Ltd." },
            email: { type: "string", example: "info@techsolutions.com" },
            phone: { type: "string", example: "+91-9876543210" },
            company: { type: "string", example: "Tech Solutions Ltd." },
            address: { type: "string", example: "Bangalore, India" },
            assignedRep: { $ref: "#/components/schemas/User" },
            notes: { type: "string", example: "Follow-up on demo request" },
          },
        },
        Lead: {
          type: "object",
          properties: {
            _id: { type: "string", example: "6501ac3f2a7e5a00123ef456" },
            name: { type: "string", example: "Rahul Verma" },
            contactInfo: {
              type: "object",
              properties: {
                email: { type: "string", example: "rahul@gmail.com" },
                phone: { type: "string", example: "+91-9012345678" },
              },
            },
            source: { type: "string", example: "Referral" },
            status: { type: "string", example: "Qualified" },
            priority: { type: "string", example: "High" },
            assignedRep: { $ref: "#/components/schemas/User" },
            notes: { type: "string", example: "Interested in annual plan" },
          },
        },
        Task: {
          type: "object",
          properties: {
            _id: { type: "string", example: "6501ac3f2a7e5a00123ef789" },
            title: { type: "string", example: "Follow up with customer" },
            description: {
              type: "string",
              example: "Call the customer to confirm payment.",
            },
            dueDate: { type: "string", format: "date", example: "2025-11-10" },
            status: { type: "string", example: "In Progress" },
            priority: { type: "string", example: "Medium" },
            assignedTo: { $ref: "#/components/schemas/User" },
          },
        },
        Sale: {
          type: "object",
          properties: {
            _id: { type: "string", example: "6501ac3f2a7e5a00123ef999" },
            customerId: { $ref: "#/components/schemas/Customer" },
            amount: { type: "number", example: 50000 },
            status: { type: "string", example: "Closed" },
            date: { type: "string", format: "date", example: "2025-11-03" },
            assignedRep: { $ref: "#/components/schemas/User" },
          },
        },
        Notification: {
          type: "object",
          properties: {
            _id: { type: "string", example: "6501ac3f2a7e5a00123efa11" },
            message: {
              type: "string",
              example: "New task assigned: Follow-up with Rahul",
            },
            userId: { $ref: "#/components/schemas/User" },
            taskId: { $ref: "#/components/schemas/Task" },
            seen: { type: "boolean", example: false },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2025-11-04T12:30:00Z",
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
export { swaggerUi };
