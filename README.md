# Backend — Online Auction System

See the [root README](../README.md) for full setup instructions.

### Available Scripts

- `npm run dev` — Start with nodemon (development)
- `npm start` — Start with node (production)

### API Routes

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/signup` | No | Create account |
| POST | `/api/signin` | No | Sign in |
| GET | `/api/products` | No | List products |
| GET | `/api/product/:slug` | No | Product detail |
| POST | `/api/add-product` | JWT | Create auction |
| POST | `/api/product/placeBid` | JWT | Place bid |
| POST | `/api/end-auction/:id` | JWT | End auction (owner/admin) |
| POST | `/api/checkout/initiate` | JWT | Start checkout |
| POST | `/api/checkout/complete` | JWT | Complete checkout |
| GET | `/api/admin/dashboard/metrics` | JWT+Admin | Dashboard stats |
| GET | `/api/admin/users` | JWT+Admin | User management |
| GET | `/api/admin/auctions` | JWT+Admin | Auction monitoring |
