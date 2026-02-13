# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Django REST API for personal budget management with passwordless email-based authentication. The application provides endpoints for managing budget items, credit cards, incomes, loans, payment methods, and subscriptions.

## Technology Stack

- **Framework**: Django 5.1.4 with Django REST Framework
- **Authentication**: JWT tokens with passwordless email-based login
- **Database**: SQLite3 (default) with PostgreSQL support
- **Configuration**: python-decouple for environment variables

## Development Commands

### Basic Django Operations
```bash
python manage.py runserver          # Start development server
python manage.py makemigrations     # Create new migrations
python manage.py migrate            # Apply database migrations
python manage.py createsuperuser    # Create Django admin user
```

### Testing
```bash
python manage.py test finance.tests users.tests    # Run all tests (71 tests, 99% coverage)
coverage run --source=finance,users manage.py test finance.tests users.tests && coverage report    # Run with coverage
coverage html                      # Generate HTML coverage report
```

**Test Coverage**: 99% coverage across all finance and user functionality
**Test Count**: 71 comprehensive tests covering:
- Model validation and relationships
- API endpoints and CRUD operations
- User authentication flow
- Permission and data isolation
- Edge cases and error handling

### Virtual Environment
The project uses `.venv/` directory for Python virtual environment.

## Architecture

### Core Design Patterns

**UserRestrictedViewSet**: All API endpoints extend this base class which automatically filters data by authenticated user, ensuring users can only access their own financial data.

**Passwordless Authentication Flow**:
1. `POST /api/auth/send-code/` - Send 6-digit code to email
2. `POST /api/auth/verify-code/` - Verify code and receive JWT tokens
3. Auto-registers users if they don't exist

### Database Models

All models have foreign keys to Django's User model:

- **BudgetItem**: Budget categories with amounts and income percentages
- **CreditCard**: Credit card information with limits and payment details
- **Income**: Income sources and amounts
- **Loan**: Loan details with payment information
- **PaymentMethod**: Payment methods (cards, bank accounts, etc.)
- **Subscription**: Recurring subscriptions linked to payment methods

### API Structure

```
/api/budget-items/       # Budget item CRUD
/api/credit-cards/       # Credit card management
/api/incomes/           # Income tracking
/api/loans/             # Loan management
/api/payment-methods/   # Payment method management
/api/subscriptions/     # Subscription management
/api/auth/send-code/    # Send login code
/api/auth/verify-code/  # Verify login code
```

## Configuration

- **Environment Variables**: Defined in `.env` file (SECRET_KEY, DEBUG, database settings)
- **Database**: SQLite3 by default, PostgreSQL configuration available via environment variables
- **Authentication Codes**: Stored in Django cache with 5-minute timeout

## Current Limitations

- No requirements.txt file exists - dependencies need to be managed manually
- Minimal test coverage - only placeholder tests exist
- API-only application - no frontend interface
- No deployment configuration