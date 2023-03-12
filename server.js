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

// Enable a course
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

// Disable a course
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

// Assign courses to a teacher
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
