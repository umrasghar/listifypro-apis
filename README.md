
# Property Application

This is a simple Node.js/Express/MongoDB application for managing property listings, including images and reviews.

## Table of Contents
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Sample Data](#sample-data)
- [Running the Application](#running-the-application)
- [Contributing](#contributing)
- [License](#license)

## ✨ New Update

- Images APIs updates : Now It accepts the image and store it instead of URL 🥳

## Getting Started

Before you start, make sure you have the following prerequisites installed on your machine:

- Node.js and npm
- MongoDB

Clone this repository to your local machine:

```
git clone https://github.com/umrasghar/listifypro-apis.git
```

Install the project dependencies:

```
cd property-application
npm install
```

### Configuration

You need to configure your MongoDB connection. Rename `config/db-sample.js` to `config/db.js` and update the MongoDB connection URL in `db.js` to match your environment.

## Project Structure

The project is organized as follows:

- `config/`: Contains configuration files, including the database connection.
- `middleware/`: Contains custom middleware functions.
- `models/`: Defines Mongoose models for properties, images, and reviews.
- `routes/api/`: Contains API route handlers for properties, images, and reviews.
- `server.js`: Entry point for the application.

## API Endpoints

The following API endpoints are available:

- `POST /api/properties`: Create a new property listing.
- `GET /api/properties`: Retrieve all property listings.
- `GET /api/properties/:id`: Retrieve a property listing by ID.
- `POST /api/images`: Create a new image for a property.
- `GET /api/images`: Retrieve all images.
- `GET /api/images/:id`: Retrieve an image by ID.
- `POST /api/reviews`: Create a new review for a property.
- `GET /api/reviews`: Retrieve all reviews.
- `GET /api/reviews/:id`: Retrieve a review by ID.
- `PUT /api/reviews/:id`: Update a review by ID.
- `DELETE /api/reviews/:id`: Delete a review by ID.

## Sample Data

You can use `curl` commands or API clients like Postman to add sample data to the database. Refer to the provided `curl` examples in this README.

## Running the Application

Start the application:

```
npm run server
```

The application will run on `http://localhost:5000`.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

