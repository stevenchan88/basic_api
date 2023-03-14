// to run the following SQL in the workbench
//Q1:Admins should be able to enable or disable the availability of a course 
//To enable a course:
UPDATE courses SET is_available = 1 WHERE courseID = {courseID};
//To disable a course:
UPDATE courses SET is_available = 0 WHERE courseID = {courseID};

//2)Admins should be able to assign one or more courses to a teacher 
UPDATE courses
SET teacher_id = <teacherID>
WHERE course_id IN (<courseID>);

//3)Students can browse and list all the available courses and see the course title and course teacher’s name. 

CREATE TABLE teacher (
  TeacherID INT AUTO_INCREMENT PRIMARY KEY,
  UserID INT,
  Name VARCHAR(255)
);

INSERT INTO teacher (UserID, Name)
SELECT UserID, Name
FROM users
WHERE RoleID = 2;

ALTER TABLE teacher AUTO_INCREMENT = 1;

SELECT courses.CourseID, courses.Title, teacher.Name AS TeacherName
FROM courses
INNER JOIN teacher
ON courses.TeacherID = teacher.TeacherID
WHERE courses.isAvailable = 1;
