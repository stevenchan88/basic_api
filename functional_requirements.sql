-- Q1:Admins should be able to enable or disable the availability of a course 
-- To disable a course:
-- UPDATE courses SET isAvailable = ? WHERE courseID = ?
UPDATE courses SET isAvailable = 0 WHERE courseID = 3;
-- to check the result:
select *  from my_schema.courses;

-- 2)Admins should be able to assign one or more courses to a teacher 
-- UPDATE courses SET teacherID = ? WHERE courseID = ?
UPDATE courses SET teacherID = 4 WHERE courseID = 5;
select *  from my_schema.courses;


-- 3)Students can browse and list all the available courses and see the course title and course teacher’s name. 
-- Students can only see the course title and teacher name
SELECT courses.title, users.name AS TeacherName FROM courses 
                 LEFT JOIN users ON courses.teacherID = users.userID
                 WHERE courses.isAvailable = 1;
                 
-- Admins and teachers can see the course ID, title and teacher name				
SELECT courses.courseID, courses.title, users.name AS TeacherName FROM courses 
                 LEFT JOIN users ON courses.teacherID = users.userID
                 WHERE courses.isAvailable = 1;

-- 4)Students can enrol in a course. Students should not be able to enrol in a course more than once at each time. 
-- SELECT * FROM enrolments WHERE courseID = ? AND userID = ?
-- INSERT INTO enrolments (courseID, userID) VALUES (?, ?)
-- to check if the student (userID =10) is already enrolled in a specific course (courseID=1)
SELECT * FROM enrolments WHERE courseID = 1 AND userID = 10;
-- student (userID =10) enrolles in a specific course (courseID=1)
INSERT INTO enrolments (courseID, userID) VALUES (1, 10);
select *  from my_schema.enrolments;


-- 5)Teachers can fail or pass a student
-- UPDATE enrolments SET mark = ? WHERE enrolmentID = ?
-- to pass a student with the enrolmentID = 14
UPDATE enrolments SET mark = 1 WHERE enrolmentID = 14;
select *  from my_schema.enrolments;
-- to fail a student with the enrolmentID = 14
UPDATE enrolments SET mark = 0 WHERE enrolmentID = 14;
select *  from my_schema.enrolments;
