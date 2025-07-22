# Interactive Board

**Interactive Board** is a web application that provides a real-time, collaborative whiteboard experience. Users can log in, sign up, and interact with a shared board, making it ideal for brainstorming, teaching, or remote collaboration.

## Features

- **Real-Time Collaboration:** Multiple users can draw and interact on the board simultaneously.
- **User Authentication:** Secure login and sign-up functionality.
- **Google OAuth Integration:** Option to log in with Google (if enabled).
- **Protected Routes:** Only authenticated users can access the board.
- **Responsive Design:** Works well on desktops, tablets, and mobile devices.
- **Modern UI:** Built with React and styled using Tailwind CSS.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/InteractiveBoard.git
   cd InteractiveBoard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in any required values (e.g., API endpoints, Google OAuth credentials).

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   - Visit [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

To build the app for production:

```bash
npm run build
```

The output will be in the `dist/` directory.

## Project Structure

```
InteractiveBoard/
├── public/                # Static assets
├── src/
│   ├── components/        # React components (Board, Login, SignUp, etc.)
│   ├── routes/            # App routing and protected routes
│   ├── services/          # Auth and user utilities
│   ├── App.jsx            # Main app component
│   └── main.jsx           # Entry point
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## Technologies Used

- **React** (frontend framework)
- **Vite** (build tool)
- **Tailwind CSS** (styling)
- **PostCSS** (CSS processing)
- **Google OAuth** (authentication, optional)
- **ESLint** (code linting)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

