# iWealth Project

## Prerequisites

Make sure the following are installed:

- Node.js (v20 or later)
- npm
- MongoDB

Verify installation:

```bash
node -v
npm -v
mongod --version
```

---

## Clone the Repository

```bash
git clone <repository-url>
cd iwealth_project
```

---

## Install Dependencies

```bash
npm install
```

---

## Configure Environment Variables

Create a `.env` file in the project root and add the required values:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/wealthtech
```

---

## Start MongoDB

Make sure MongoDB is running before proceeding.


## Initial Data Import (Run Once)

Before starting the application for the first time, import the NAV and Benchmark data:

```bash
node src/scripts/importNav.js
this will import the past 3 years data from openapi and store it in database
```

```bash
node src/scripts/importBenchmark.js
this will store the corresponding benchmark data in the database
```

These scripts populate the database with the required data.

---

## Start the Application

```bash
npm start
```

The server should now be running on:

```
http://localhost:3000
```

---

## Project Startup Summary

For the first run:

```bash
git clone <repository-url>
cd iwealth_project
npm install

node src/scripts/importNav.js
node src/scripts/importBenchmark.js

npm start
```

For subsequent runs:

```bash
npm start
```

The import scripts only need to be executed again if the database is cleared or re-created.




# Running with Docker

Docker provides a quick way to run the application and MongoDB without installing MongoDB locally. it ensures that code will run on every machine regardless of which version is installed in machine

## Prerequisites

Make sure the following are installed:

- Docker
- Docker Compose

Verify installation:

```bash
docker --version
docker-compose --version
```

---

## Start the Application

From the project root directory, run:

```bash
docker-compose up --build
```

This command will:

1. Build the application Docker image.
2. Start a MongoDB container.
3. Start the Node.js application container.
4. Automatically run:
   - `src/scripts/importNav.js`
   - `src/scripts/importBenchmark.js`
5. Start the application using `npm start`.

---

## Access the Application

Once the containers are running, the API will be available at:

```text
http://localhost:3000
```

---

## Stop the Application

Press:

```text
Ctrl + C
```

or run:

```bash
docker-compose down
```

---

## Rebuild After Code Changes

If Docker configuration or dependencies change:

```bash
docker-compose down
docker-compose up --build
```

---

## Quick Start

```bash
git clone <repository-url>
cd iwealth_project

docker-compose up --build
```

That's it. Docker will automatically set up MongoDB, import the required NAV and Benchmark data, and start the application.

AI Tools Used (and Purpose)

I used ChatGPT mainly as a support tool during development to speed up thinking and structuring. It helped me quickly validate ideas, refine system design decisions, and convert rough thoughts into clear technical and business documentation. I also used it for improving wording, checking API structure clarity, and quickly generating different versions of the same concept to compare approaches.

It was also useful for debugging support and understanding best practices when designing APIs, scaling strategies, and system architecture. Instead of replacing design work, it acted more like a review and thinking assistant to help me move faster and avoid missing common design considerations.