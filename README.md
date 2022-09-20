

# StandUp Viewer

This project was generated using [Nx](https://nx.dev).

<p align="center"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="100"></p>



🔎 **Nx is a set of Extensible Dev Tools for Monorepos.**

### [NestJS](https://docs.nestjs.com/) 

Nest (NestJS) is a framework for building efficient, scalable Node.js server-side applications.

### [ReactJS](https://reactjs.org/) 

A JavaScript library for building user interfaces

### [MongoDB](https://www.mongodb.com/) 

A complete data framework

# Getting started

## Installation

Clone the repository


Switch to the repo folder

    cd standup
    
Install dependencies
    
    npm install

Create .env file

    MONGO_URI='mongodb://localhost/YOURMONGODBNAME'
    JWT_SECRET='YOURJWTSECRETCHANGEIT'
    ENCRYPT_JWT_SECRET='YOURJWTENCRIPTINGPASSCHANGEIT'
    JWT_EXPIRATION=5d
    GLOBAL_PREFIX='api'
    TICKET_LINK='https://www.google.com/search?q={{TICKET_LINK}}'

Start Front

    npm run start -- standup

Start Backend

    npm run start -- api


Reference https://github.com/pejmanhadavi/real-world-example-nestjs-mongoose-jwt-auth

    