# RevoeAI Frontend

This is the frontend part of the RevoeAI assignment. It is built using React and Next.js, and it includes various components and pages to manage and display dynamic tables.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [What This Application Does](#what-this-application-does)
- [Components](#components)
- [Pages](#pages)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Installation

To install the dependencies and set up the project, follow these steps:

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/revoeai_assignment.git
   cd revoeai_assignment/frontend
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

3. Create a `.env.local` file in the root directory and add the following environment variables:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
   NEXT_PUBLIC_WS_BACKEND_URL=ws://localhost:5000
   ```

## Usage

To start the development server, run:

```sh
npm run dev
```

To build the application for production, run:

```sh
npm run build
```

To start the production server, run:

```sh
npm start
```

To lint the code, run:

```sh
npm run lint
```

## Technologies Used

This project uses the following technologies:

- **React**: A JavaScript library for building user interfaces.
- **Next.js**: A React framework for server-side rendering and generating static websites.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **Axios**: A promise-based HTTP client for making API requests.
- **Socket.IO**: A library for real-time web applications.

## What This Application Does

The RevoeAI frontend application provides a user interface for managing and displaying dynamic tables. It includes features such as:

- User authentication (login and logout).
- Displaying a list of tables fetched from the backend.
- Viewing details of a specific table.
- A dashboard displaying user-specific data.
- Real-time updates using WebSockets.

## Components

This section describes the various components used in the project.

- **TableComponent**: Displays dynamic tables fetched from the backend.
- **AuthComponent**: Handles user authentication (login, logout).
- **Navbar**: Navigation bar for the application.
- **Footer**: Footer component for the application.
- **Dashboard**: Main dashboard component displaying user-specific data.

## Pages

This section describes the various pages available in the project.

- **/login**: Login page for user authentication.
- **/dashboard**: Dashboard page displaying user-specific data.
- **/tables**: Page displaying a list of tables.
- **/tables/[id]**: Page displaying a specific table by ID.

## API Endpoints

This section describes the API endpoints used in the project.

- **GET /api/tables**: Fetches a list of tables.
- **GET /api/tables/[id]**: Fetches a specific table by ID.
- **POST /api/auth/login**: Authenticates a user and returns a JWT token.
- **POST /api/auth/logout**: Logs out a user by clearing the JWT token.

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) first.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
