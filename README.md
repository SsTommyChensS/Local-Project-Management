
# Local Project Management

This is my personal project called "Local Project Management" based on a project that I used to join at an old company. This project is still being developed continously so that I can make a better profile for my CV and improve my technical skills. 

The purpose of this application is that we can create, manage projects for local businesses in a simple approach. 

# Technologies used
- BackEnd: NodeJS (ExpressJS)
- Database: MongoDB (Mongoose)
- Some of packaged used:
    + Jsonwebtoken (Jwt - Create token for authentication)
    + Express-validator (Validate body fields)
    + BcryptJs (Create user's password)
    + Multer (Local file storages)
    + Cloudinary (Online cloud for saving images and files)

# How to run this project?
- Clone the project
- Install all available packages (Using command: npm install)
- Create .env file (Same variables with .sample.env) and adjust variable values (MongoDB connect - Keys - Cloudinary)
- Redirect to the root of application and start the project by using the command (npm start)
    + Note: I use nodemon package to restart the application immidiately whenever codes change.
    + Note2: I've already designed API documents using Swagger (Access: http://localhost:[port]/api-docs)
    + Note3: Updated 14/06/2023 -> Add pagination when get data
    + Note4: I've implemented Front-End Application to test the API: https://github.com/SsTommyChensS/Local-Project-Management-FE-NextJS (NextJS - TailwindCSS)
# Result
So far, I've published this project with some available features below:
+ Authentication: Sign up, Login, Logout, Renew token
+ Project
    - Create / Get / Update / Remove a project
    - Invite a member to a project by user's code
+ User
    - Update user's information
    - Update user's avatar using Multer and Cloudinary
+ Attachment
    - Upload Attachments to cloudinary (With the support of multer: Allow upload image and PDF)
    - Remove attachments (Remove one by one or remove multiple when remove a project)
+ Comment
    - Post / Show / Remove comments
+ Task
    - Create / Update / Get / Remove task (Remove task one by one or multiple when remove a project)
+ Swagger API Documentation
    - Auth: Signup, Login, Logout, Renew token
    - Project
    - Task
    - Comment
    - User
    - Attachments
+ These are some of main features that I feel very pleased to research and practice
    - Authentication (Using accessToken and refreshToken)
    - RestAPI (Project, Task,...)
    - Upload images and attachments (Using multer and cloudinary)
    - Extra: Pagination (Using mongodb methods: skip - limit; slice)
# Conclusion:
With the passion of programming application, I hope that I can improve more not only my technical skills but also my soft skills.
About this project, and plan to design front-end application using ReactJS (NextJS) to test the API's performance and will fix some bugs or improve bussiness logics if needed. 

