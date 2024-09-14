# Rabbit: A Community-Based Social Platform

Rabbit is a modern, community-based social platform designed to facilitate interactions, discussions, and content sharing among users. Built with Next.js, TypeScript, Tailwind CSS, and a Spring Boot backend, Rabbit provides a scalable and secure environment for creating and participating in user-driven communities. The platform offers features such as post creation, commenting, voting, community management, and real-time interactions.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation and Setup](#installation-and-setup)
- [Usage](#usage)
- [Contributing](#contributing)

## Features

- **User Registration and Authentication**: Secure user login and registration system with password encryption using Spring Security and BCrypt.
- **Community Creation and Participation**: Users can create or join communities, contribute to discussions, and share posts.
- **Post Creation and Management**: Supports text, images, and links with real-time interactions.
- **Commenting and Voting**: Users can comment on posts and vote (upvote/downvote) on content to curate the community’s most valuable discussions.
- **Moderation Tools**: Community-specific moderation tools for reporting and removing inappropriate content.

## Technologies Used

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Spring Boot, PostgreSQL
- **Security**: Spring Security
- **Authentication**: JWT, OAuth 2.0

## Installation and Setup

To get the project up and running locally, follow these steps:

```bash
# Clone the repository
git clone https://github.com/your-username/rabbit.git

# Navigate to the directory
cd rabbit

# Install dependencies
npm install

# Start the application
npm start
```

## Contributing
```bash
# Clone the forked repository to your local machine
git clone https://github.com/i-nap/rabbit.git

# Navigate to the project directory
cd rabbit

# Create a new branch for your feature or fix
git checkout -b feature-or-fix-branch-name

# Make your changes and commit them
git add .
git commit -m "Description of the feature or fix"

# Push your branch to your forked repository
git push origin feature-or-fix-branch-name
