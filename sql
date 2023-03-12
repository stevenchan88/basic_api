//1Admins should be able to enable or disable the availability of a course 
//To enable a course:
UPDATE courses SET is_available = 1 WHERE courseID = {courseID};
//To disable a course:
UPDATE courses SET is_available = 0 WHERE courseID = {courseID};

//2)Admins should be able to assign one or more courses to a teacher 
UPDATE courses
SET teacher_id = <teacherID>
WHERE course_id IN (<courseID>);

//3)3)Students can browse and list all the available courses and see the course title and course teacher’s name. 
