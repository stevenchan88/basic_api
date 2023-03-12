//Admins should be able to enable or disable the availability of a course 
//To enable a course:
UPDATE courses SET is_available = 1 WHERE course_id = {course_id};
//To disable a course:
UPDATE courses SET is_available = 0 WHERE course_id = {course_id};

