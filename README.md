# Tonic Store

A full-stack e-commerce platform built with modern technologies.

## 🚀 Features

- User authentication and authorization
- Product management
- Shopping cart functionality
- Order processing
- Admin dashboard
- Responsive design

## 🛠 Tech Stack

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- React Query
- React Router

### Backend
- Node.js + TypeScript
- Express.js
- Prisma (ORM)
- PostgreSQL
- JWT Authentication

### Admin Panel
- React + TypeScript
- Vite
- Tailwind CSS
- React Query

### DevOps
- Docker
- Docker Compose
- CI/CD (GitHub Actions)

## 📦 Prerequisites

- Node.js (v18 or higher)
- Yarn
- Docker
- Docker Compose

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/your-username/tonic-store.git
cd tonic-store
```

2. Install dependencies:
```bash
# Install frontend dependencies
cd frontend
yarn install

# Install backend dependencies
cd ../backend
yarn install

# Install admin panel dependencies
cd ../admin
yarn install
```

3. Set up environment variables:
```bash
# Copy .env.example files and update with your values
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
cp admin/.env.example admin/.env
```

4. Start the development environment:
```bash
# Using Docker Compose
docker-compose up -d

# Or run services individually
# Backend
cd backend
yarn dev

# Frontend
cd frontend
yarn dev

# Admin Panel
cd admin
yarn dev
```

## 📁 Project Structure

```
tonic-store/
├── frontend/          # Frontend application
├── backend/           # Backend API
    ├── prisma-studio/    # Prisma Studio
├── admin/            # Admin dashboard
├── docker/           # Docker configuration
└── docker-compose.yml # Docker Compose configuration
```

## 🧪 Testing

```bash
# Run frontend tests
cd frontend
yarn test

# Run backend tests
cd backend
yarn test
```

## 📝 API Documentation

API documentation is available at `/api/docs` when running the backend server.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Thanks to all contributors
- Thanks to the open-source community