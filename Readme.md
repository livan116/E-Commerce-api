

# Shopi
A e-commerce platform built with MERN stack (MongoDB, Express.js, React.js, Node.js) that provides a seamless shopping experience with user authentication, product management, and order processing. 


## Tech Stack

**Frontend**:

- React Js
- Tailwind CSS

**Backend**:

- Node.js
- Express.js
- MongoDB

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/livan116/E-Commerce-api.git
cd E-Commerce-api
```

### 2. Setup Backend

```bash
cd server
npm install
```

**Create .env file**:

```env
PORT=your_port
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret
```

**Start the backend**:

```bash
node index.js
```

### 2. Setup Frontend

```bash
cd client
npm install
```

**Create .env file**:

```env
VITE_API_URL=your_backend_url
```

**Start the frontend**:

```bash
npm run dev
```