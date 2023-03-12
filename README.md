# basic_api

This is a basic rest API using sqlite and express.

To run, type node start in the terminal

the functional requirements:
1) Admins should be able to enable or disable the availability of a course
2) Admins should be able to assign one or more courses to a teacher
3) Students can browse and list all the available courses and see the course title and course
teacher’s name.
4) Students can enrol in a course. Students should not be able to enrol in a course more than
once at each time.
5) Teachers can fail or pass a student.
6) Access control for Admins, Teachers and Students: Ensure only the authorized access can
perform an action. For example, only teachers can pass/fail a student.
Here is a suggested method: In the API, on every request, get the primary key of a user as
part of the request/input parameters and before performing an action, check if the user
with the primary key is authorized to perform e a request. 

Your group is expected to develop SQL queries and APIs to address the functional requirements and demonstrate the functionalities.
Here are the steps: 
Create SQL queries needed to support functional requirements.
Install NodeJS and all the required packages, including “mysql2” (not mysql) and “express” packages.
Install postman application.
Write a NodeJS and Express application to connect to the database.
Add APIs to (D) to support functional requirements. (For API coding, following the instructions here: Express "Hello World" example (expressjs.com)
Find a way to restrict access for some actions that need to be performed by a role. For example, some actions such as assigning a course to a teacher are performed by college staffs, pass and fail decisions are done by teachers.
Test and demonstrate results of executing your APIs using Postman application: Sending your first request | Postman Learning Center
