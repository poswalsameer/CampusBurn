# CampusBurn Introduction:
Have you ever felt that you should provide a good review of your college but are afraid that your college might take some actions against you? Well, what if you could do this anonymously and also in this process, make some anonymous friends of a similar age group? Sounds thrilling right! That's what CAMPUSBURN is.

Campusburn is an anonymous social platform built dedicatedly for college students who want to help the upcoming generations with correct knowledge and guidance about anything related to their college and university.

### Tech Stack:
We are using a diverse tech stack that includes:
1. Next.js ( for client-side )
2. TypeScript
3. Tailwind CSS
4. Shadcn UI
5. Golang ( for server-side )
6. GORM ( ORM for Golang )
7. PostgreSQL
8. NeonDB ( to get serverless postgreSQL )

### Project Setup:
1. Clone the repository.
2. Open in your code editor.
3. To start the client-side application, `cd` into `client/campusburn` and run `npm i` to install all the dependencies, then run `npm run dev` to start the localhost.
4. To start the server, `cd` into `server` and run `go run dbMigrate/migrate.go` for initial database migration and then run `go run main.go` to start the server.
5. Remember: For any server-side change, you have to start the server again by running `go run main.go` to make sure your changes are reflected.
