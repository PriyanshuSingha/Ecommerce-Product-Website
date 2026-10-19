# NovaMarket API Documentation

This document details the RESTful endpoints available in the backend. 
Base URL: `http://localhost:5000/api`

## Authentication Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login and receive a JWT | No |
| GET | `/api/auth/profile` | Get the logged in user's profile | Yes |

## Product Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/products` | Get all products | No |
| GET | `/api/products/:id` | Get a specific product by ID | No |
| POST | `/api/products` | Create a new product | Yes (Admin) |
| PUT | `/api/products/:id` | Update a product | Yes (Admin) |
| DELETE | `/api/products/:id` | Delete a product | Yes (Admin) |
| POST | `/api/products/:id/coupon` | Validate/apply a coupon to a product | No |

## Cart Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/cart` | Get current user's cart | Yes |
| POST | `/api/cart` | Add an item to cart | Yes |
| PUT | `/api/cart/:productId` | Update item quantity | Yes |
| DELETE | `/api/cart/:productId` | Remove item from cart | Yes |
| DELETE | `/api/cart` | Clear entire cart | Yes |

## Wishlist Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/wishlist` | Get current user's wishlist | Yes |
| POST | `/api/wishlist` | Add product to wishlist | Yes |
| DELETE | `/api/wishlist/:productId` | Remove product from wishlist | Yes |

## Order Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/orders` | Place a new order | Yes |
| GET | `/api/orders` | Get current user's orders | Yes |
| GET | `/api/orders/admin` | Get all orders | Yes (Admin) |
| GET | `/api/orders/:id` | Get specific order | Yes |
| PUT | `/api/orders/:id/status` | Update order status | Yes (Admin) |

## ImageKit Integration
Images are handled on the frontend via ImageKit. The frontend components directly use ImageKit URLs for image rendering. When creating/editing a product, the image URL should point to ImageKit.

## Coupons
Each product can have an optional nested `coupon` object with a code, type (percentage), and value. Applying a coupon returns the validated discount breakdown.
