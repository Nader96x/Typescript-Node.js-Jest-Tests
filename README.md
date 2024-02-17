# Express TypeScript Test App

This Express app is a demonstration of a simple book management system using TypeScript. It supports CRUD operations for books, utilizing MongoDB as a database, with the added capability of running tests against an in-memory MongoDB server. Validation is handled through Joi, ensuring that data conforms to expected formats. This project is structured to serve as a template or starting point for more complex TypeScript Node.js applications.

## Features

- **CRUD Operations**: Create, Read, Update, and Delete books.
- **Validation Middleware**: Request data validation using Joi.
- **In-Memory MongoDB**: Integration with MongoDB Memory Server for seamless testing.
- **Unit Testing**: Comprehensive unit tests with Jest.
- **TypeScript**: Full TypeScript support for type safety and reliability.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/express-ts-test-app.git
cd express-ts-test-app
npm install
```
2. Install NPM packages:

```bash
npm install
```

### Running the Application in the developement enviroment:

To start the application in development mode with hot reload, run:

```bash
npm run ts:dev
```

For production, first compile the project and then start it:

```bash
npm run build
npm run start:prod
```

### Testing

To run the unit tests, use:

```bash
npm test
```
This executes tests using Jest against the MongoDB in-memory server, ensuring that all components function as expected without the need for an external MongoDB instance.

## API Endpoints

The application provides a set of RESTful endpoints for managing books. Here are the available endpoints and their functionalities:

- `POST /books` - Create a new book. Requires a JSON body with book details.
- `GET /books` - Retrieve a list of all books in the database.
- `GET /books/:id` - Retrieve details of a specific book by its ID.
- `PUT /books/:id` - Update the details of an existing book. Requires a JSON body with the updated book details.
- `DELETE /books/:id` - Delete a book from the database by its ID.

## Built With

This project is built using the following technologies:

- **Express**: A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
- **MongoDB Memory Server**: An in-memory database server mimicking MongoDB. This is used primarily for testing purposes, allowing for fast, reliable tests without the need for a live MongoDB instance.
- **Mongoose**: An elegant mongodb object modeling for Node.js. It provides a straightforward, schema-based solution to model your application data.
- **Joi**: A powerful schema description language and data validator for JavaScript. Joi allows you to create blueprints or schemas for JavaScript objects (an object that stores information) to ensure validation of key information.
- **Jest**: A delightful JavaScript Testing Framework with a focus on simplicity. It works with projects using: Babel, TypeScript, Node, React, Angular, Vue, and more.


