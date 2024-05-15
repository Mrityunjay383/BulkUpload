# CSV Bulk Upload with Parallel Processing using Node.js, MongoDB, and Worker Threads

This repository contains a Node.js application that processes large CSV files for bulk upload to a MongoDB database. The application leverages worker threads for parallel processing to efficiently handle large datasets. Progress updates are provided via `socket.io` to keep the user informed during the upload process.

## Features

- **CSV Parsing**: Efficiently parses large CSV files using streams.
- **Batch Processing**: Organizes data into batches for optimized database insertion.
- **Parallel Processing**: Uses worker threads to process batches in parallel.
- **Progress Updates**: Real-time progress updates via `socket.io`.
- **Server Crash Recovery**: Mechanism to resume uploads in case of server failure.
- **Error Handling**: Robust error handling and logging.

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. **Clone the repository**
    ```bash
    git clone https://github.com/Mrityunjay383/BulkUpload.git
    cd server
    ```

2. **Install dependencies**
    ```bash
    npm install
    ```

3. **Set up environment variables**
    Create a `.env` file in the root directory with the following contents:
    ```
    MONGO_URI=mongodb://localhost:27017/yourdbname
    PORT=5000
    BATCH_SIZE=1000
    ```

### Running the Application

1. **Run the application**
    ```bash
    npm run dev
    ```

2. **Access the application**
    The application will be running on `http://localhost:5000`.

### API Endpoints

- **Upload CSV File**

    Endpoint: `POST /upload`
    - **Description**: Upload a CSV file for processing.
    - **Request**: Form-data with a file field named `file`.
    - **Response**: JSON with upload ID.


### Contributing

1. **Fork the repository**
2. **Create a new branch**
    ```bash
    git checkout -b feature-name
    ```
3. **Commit your changes**
    ```bash
    git commit -m "Add some feature"
    ```
4. **Push to the branch**
    ```bash
    git push origin feature-name
    ```
5. **Open a pull request**

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Acknowledgments

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Socket.io](https://socket.io/)
- [csv-parser](https://www.npmjs.com/package/csv-parser)
- [worker_threads](https://nodejs.org/api/worker_threads.html)
