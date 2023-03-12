// Create express app
const express = require("express")
const app = express()
const db = require("./database.js")

// Server port
const HTTP_PORT = 8000
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
// Root endpoint
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

app.get("/api/user", (req, res, next) => {
    const sql = "select * from user"
    let params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
});

app.get("/api/roles", (req, res, next) => {
    const sql = "select * from roles"
    let params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
});

app.get("/api/courses", (req, res, next) => {
    const sql = "select * from courses"
    let params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
});

// Q1:Enable a course
app.put('/courses/enable/:id', (req, res) => {
  const courseId = req.params.id;
  const sql = `UPDATE courses SET isAvailable = 1 WHERE courseID = ?`;

  db.run(sql, [courseId], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Course ${courseId} has been enabled`);
    res.send(`Course ${courseId} has been enabled`);
  });
});

// Q1:Disable a course
app.put('/courses/disable/:id', (req, res) => {
  const courseId = req.params.id;
  const sql = `UPDATE courses SET isAvailable = 0 WHERE courseID = ?`;

  db.run(sql, [courseId], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Course ${courseId} has been disabled`);
    res.send(`Course ${courseId} has been disabled`);
  });
});

// Q2:Assign courses to a teacher
app.put('/teachers/:teacherId/courses', (req, res) => {
  const teacherId = req.params.teacherId;
  const courseIds = req.body.courseIds;
  const placeholders = courseIds.map(() => '?').join(',');
  const sql = `UPDATE courses SET teacherID = ? WHERE courseID IN (${placeholders})`;

  db.run(sql, [teacherId, ...courseIds], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Courses ${courseIds.join(', ')} have been assigned to teacher ${teacherId}`);
    res.send(`Courses ${courseIds.join(', ')} have been assigned to teacher ${teacherId}`);
  });
});


// Q3:Students can browse and list all the available courses and see the course title and course teacher’s name. 
// connect to the database
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database!');
  
  // create the teacher table firstly
  db.query(`CREATE TABLE IF NOT EXISTS teacher (
    TeacherID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    Name VARCHAR(255)
  )`, (err, result) => {
    if (err) throw err;
    console.log('Teacher table created!');
    
    // insert data into the teacher table
    db.query(`INSERT INTO teacher (UserID, Name)
    SELECT UserID, Name
    FROM users
    WHERE RoleID = 2`, (err, result) => {
      if (err) throw err;
      console.log(`${result.affectedRows} rows inserted into teacher table.`);
      
      // reset the auto-increment value of the teacher table
      db.query('ALTER TABLE teacher AUTO_INCREMENT = 1', (err, result) => {
        if (err) throw err;
        console.log('Auto-increment value of teacher table reset!');
      });
    });
  });
});

// define a route to browse and list available courses with course title and teacher's name
app.get('/courses', (req, res) => {
  // query the courses table and join the teacher table to get the teacher's name
  db.query(`SELECT courses.CourseID, courses.Title, teacher.Name AS TeacherName
    FROM courses
    INNER JOIN teacher
    ON courses.TeacherID = teacher.TeacherID
    WHERE courses.isAvailable = 1`, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.get("/api/enrolments", (req, res, next) => {
    const sql = "select * from enrolments"
    let params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
});

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});
