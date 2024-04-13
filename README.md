# webservices-nestjs

This project is a demonstration of using NestJS to build web services, specifically focusing on handling Stripe webhooks and creating charges. It showcases the power and flexibility of NestJS for building scalable and maintainable backend services.

## Features

- **Stripe Webhooks**: Handling Stripe webhook events to process payments and refunds.
- **Charge Creation**: API endpoint to create charges with Stripe.
- **Request Validation**: Ensuring the integrity of incoming requests using Stripe signatures.
- **Unit Testing**: Basic setup for unit testing controllers and services.

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Stripe account for API keys

### Installation

- Clone the repository

- Install dependencies:

```bash
npm install
```

### Running the Application

- Start the application:

```bash
export STRIPE_SECRET_KEY=sk_test_...
export STRIPE_WEBHOOK_SECRET=whsec_...\
npm run build
npm run start
```

1. The application will be available at `http://localhost:3000`.

## Endpoints

- **Payment Form**: `GET /` - A simple payment form to test the charge creation.
- **Create Charge**: `POST /api/create_charge` - Creates a charge with the provided token, amount, and currency.
- **Handle Webhook**: `POST /api/webhook` - Handles incoming Stripe webhook events for payment intents and refunds.
