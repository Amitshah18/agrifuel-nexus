AgriFuel Nexus - Core Backend API

The Node.js backend handles all the heavy lifting for user authentication, marketplace matching, secure escrow transactions, OTP generation, and profile management.
🛠 Tech Stack

    Runtime: Node.js

    Framework: Express.js

    Database: MongoDB & Mongoose

    Authentication: JSON Web Tokens (JWT) & bcrypt

⚙️ Prerequisites

    Node.js (v18 or higher)

    MongoDB (Local instance or MongoDB Atlas cluster URI)

🚀 Local Setup Instructions

    Navigate to the backend directory:
    Bash

    cd backend

    Install dependencies:
    Bash

    npm install

    Configure Environment Variables:
    Create a .env file in the root of the backend folder.
    Code snippet

    PORT=8000
    MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/agrifuel?retryWrites=true&w=majority
    JWT_SECRET=your_super_secret_jwt_key
    FRONTEND_URL=http://localhost:5173

    Start the server:

        For development (auto-restarts on save):
        Bash

        npm run dev

        For production:
        Bash

        npm start

    Verify the API:
    The server should now be running at http://localhost:8000. You can ping http://localhost:8000/api/health to verify status.