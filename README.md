Rabbit: A Community-Based Social Platform
Rabbit is a modern, community-based social platform designed to facilitate interactions, discussions, and content sharing among users. Built with Next.js, TypeScript, Tailwind CSS, and a Spring Boot backend, Rabbit provides a scalable and secure environment for creating and participating in user-driven communities. The platform offers features such as post creation, commenting, voting, community management, and real-time interactions.

Features
User Registration and Authentication: Secure user login and registration system with password encryption using Spring Security and BCrypt.
Community Creation and Participation: Users can create or join communities, contribute to discussions, and share posts.
Post Creation and Management: Supports text, images, and links with real-time interactions.
Commenting and Voting: Users can comment on posts and vote (upvote/downvote) on content to curate the community’s most valuable discussions.
Moderation Tools: Community-specific moderation tools for reporting and removing inappropriate content.

Technologies Used
Frontend
Next.js: A powerful React framework for building server-rendered apps and static websites.
TypeScript: Adds static typing to JavaScript, making the development process more robust and error-free.
Tailwind CSS: A utility-first CSS framework for fast and flexible UI development.
Backend
Spring Boot: Provides a robust, scalable framework for creating REST APIs and managing the business logic.
PostgreSQL: Relational database management system used for storing user data, posts, comments, and community information.
Spring Security: Ensures secure authentication and session management.
Other Tools
JWT: Used for stateless authentication of users across the platform.
OAuth 2.0: Allows users to log in using third-party authentication providers (Google, Facebook).

Installation and Setup
To get the project up and running locally, follow these steps:

Prerequisites
Node.js (v14 or higher)
npm or yarn
Java (JDK 11 or higher)
PostgreSQL (Ensure a running PostgreSQL instance)

Backend Setup
Clone the repository:
bash
Copy code
git clone https://github.com/your-username/rabbit-social-platform.git
cd rabbit-social-platform/backend
Configure the PostgreSQL Database:

Ensure PostgreSQL is running.
Create a new PostgreSQL database for the project.
Update the application.properties or application.yml file with your PostgreSQL configuration:
properties
Copy code
spring.datasource.url=jdbc:postgresql://localhost:5432/rabbit_db
spring.datasource.username=your-username
spring.datasource.password=your-password
Run the Spring Boot Application:

bash
Copy code
./mvnw spring-boot:run
The backend server will be running at http://localhost:8080.

Frontend Setup
Navigate to the frontend folder:

bash
Copy code
cd ../frontend
Install dependencies:

bash
Copy code
npm install
Configure the environment variables:

Create a .env.local file in the frontend directory with the following content:
bash
Copy code
NEXT_PUBLIC_API_URL=http://localhost:8080/api
Run the Next.js Development Server:

bash
Copy code
npm run dev
The frontend will be running at http://localhost:3000.

Usage
Register a User: Create an account or log in with existing credentials (Google OAuth).
Create a Community: Once logged in, create a new community or join an existing one.
Submit a Post: Share content (text, images, or links) in your communities.
Interact: Comment on posts and vote (upvote/downvote) to engage with the content.
Moderate: Use built-in moderation tools to report or remove inappropriate content in communities you manage.
Roadmap
Real-Time Features: Integration of real-time chat and video call functionality.
AI-Driven Moderation: Advanced content filtering and moderation using AI.
Mobile App: Plan to develop a mobile version of the platform for both Android and iOS.
Monetization Features: Subscription-based features for premium communities and content creators.
Contributing
Contributions are welcome! If you would like to contribute, please follow these steps:

Fork the repository.
Create a new branch for your feature/bug fix.
Make your changes.
Submit a pull request for review.
License
This project is licensed under the MIT License - see the LICENSE file for details.
