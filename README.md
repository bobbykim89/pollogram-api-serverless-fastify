# Pollogram-API-Serverless fastify

Pollogram-API is a backend API for an Instagram clone project, designed using Fastify and Prisma as ORM. Project is deployed on AWS Lambda using AWS-CDK as its IAS. It provides endpoints to manage users, profiles, posts, and comments.

---

## Features

- User Management: Register, authenticate, and manage user accounts.
- Profile Management: Create, view, and update user profiles.
- Post Management: Upload, edit, and view posts.
- Comment System: Add, edit, and manage comments on posts.
- Admin Features: WIP

## Endpoints

| Endpoint       | Description                     |
| -------------- | ------------------------------- |
| /api/user/     | Manage user-related operations. |
| /api/profile/  | View and edit user profiles.    |
| /api/posts/    | CRUD operations for posts.      |
| /api/comments/ | Manage comments on posts.       |

### /api/user/

| Endpoint          | Description          |
| ----------------- | -------------------- |
| /                 | Get user info        |
| /signup/          | Signup new user      |
| /login/           | Login user           |
| /change-password/ | Change user password |

### /api/profile/

| Endpoint                     | Description                                        |
| ---------------------------- | -------------------------------------------------- |
| /                            | Get Profiles list                                  |
| /current-user/               | Get current user profile detailed view             |
| /current-user/profile-image/ | Update current user's profile image                |
| /current-user/username/      | Update current user's username                     |
| /current-user/description/   | Update current user's description                  |
| /:id/                        | Get user profile detailed view based on profile id |
| /:id/follow/                 | Follow user profile with profile id                |
| /:id/unfollow/               | Unfollow user profile with profile id              |

### /api/posts/

| Endpoint     | Description                                             |
| ------------ | ------------------------------------------------------- |
| /            | GET: retrieve posts list, POST: Create new post         |
| /:id/        | GET: get detailed post by id, DELETE: delete post by id |
| /:id/like/   | Like post by id                                         |
| /:id/unlike/ | Unlike post by id                                       |

### /api/comments/

| Endpoint     | Description                                                                 |
| ------------ | --------------------------------------------------------------------------- |
| /:postId/    | GET: retrieve comments list by post id, POST: create new comment by post id |
| /:id/delete/ | Delete comment by id                                                        |
| /:id/like/   | Like comment by id                                                          |
| /:id/unlike/ | Unlike comment by id                                                        |

## Installation

1. Clone the Repository

```bash
git clone https://github.com/bobbykim89/pollogram-api-serverless-fastify.git
```

2. Install Dependencies

```bash
npm install
```

3. Set Up Environment Variables<br>

   Create a `.env`, `.env.prod`, `.env.dev` file in the root directory and add the necessary configuration variables (e.g., database URL, secret key, etc.).

4. Run Migrations

```bash
# for prod build
npm run db:prod:migrate:create
npm run db:prod:migrate:deploy

# for dev build
npm run db:dev:migrate:create
npm run db:dev:migrate:deploy
```

5. Start the Server (Local dev server)

```bash
npm run dev:watch
```

6. Deploy to AWS

```bash
# prod deploy
npm run cdk:deploy:prod

# dev deploy
npm run cdk:deploy:dev
```

## Usage

After starting the server, you can access the API endpoints at http://localhost:3000/. Use a tool like Postman or curl to test the API.

## Future Enhancements

Finalize admin route.
Implement user stories for following/unfollowing.
Add notifications for likes and comments.

## License

This project is licensed under the MIT License.

Feel free to customize further based on your specific implementation!
