const express = require('express')
const bodyParser = require('body-parser')
const db = require('./database')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Helper function to get user role
const getUserRole = (userID) => {
    console.log(userID)
    return new Promise((resolve, reject) => {
        db.get('SELECT roleID FROM user WHERE userID = ?', [userID], (err, row) => {
            if (err) reject(err)
            else resolve(row.roleID)
        })
    })
}


app.post('/test', (req, res) => {
    console.log(req.body)
    res.send('Received request')
})

// Endpoint for enabling/disabling a course
app.post('/course/:courseID/availability', async (req, res) => {
    console.log(req.body)
    const userID = req.body.userID
    const userRole = await getUserRole(userID)
    if (userRole !== 1) { // Only admins can enable/disable a course
        res.status(403).send('Access Denied')
        return
    }
    const isAvailable = req.body.isAvailable ? 1 : 0
    db.run('UPDATE courses SET isAvailable = ? WHERE courseID = ?', [isAvailable, req.body.courseID], (err) => {
        if (err) res.status(500).send(err.message)
        else res.sendStatus(200)
    })
})

// Endpoint for assigning a teacher to a course
app.post('/course/:courseID/teacher', async (req, res) => {
    const userID = req.body.userID
    const userRole = await getUserRole(userID)
    if (userRole !== 1) { // Only admins can assign a teacher to a course
        res.status(403).send('Access Denied')
        return
    }
    const teacherID = req.body.teacherID
    db.run('UPDATE courses SET teacherID = ? WHERE courseID = ?', [teacherID, req.params.courseID], (err) => {
        if (err) res.status(500).send(err.message)
        else res.sendStatus(200)
    })
})

// Endpoint for listing all available courses
app.get('/courses', async (req, res) => {
    const userID = req.body.userID
    const userRole = await getUserRole(userID)
    const query = 'SELECT courses.courseID, courses.title, user.name AS teacherName FROM courses LEFT JOIN user ON courses.teacherID = user.userID WHERE courses.isAvailable = 1'
    db.all(query, [], (err, rows) => {
        if (err) res.status(500).send(err.message)
        else {
            if (userRole === 3) { // Students can only see the course title and teacher name
                const courses = rows.map(row => ({title: row.title, teacherName: row.teacherName}))
                res.send(courses)
            } else { // Admins and teachers can see the course ID, title and teacher name
                res.send(rows)
            }
        }
    })
})

// Endpoint for enrolling in a course
app.post('/course/:courseID/enroll', async (req, res) => {
    const userID = req.body.userID
    const userRole = await getUserRole(userID)
    if (userRole !== 3) { // Only students can enroll in a course
        res.status(403).send('Access Denied')
        return
    }
    db.get('SELECT * FROM enrolments WHERE courseID = ? AND userID = ?', [req.params.courseID, userID], (err, row) => {
        if (err) res.status(500).send(err.message)
        else if (row) { // Student is already enrolled in the course
            res.status(400).send('Already enrolled in the course')
        } else { // Student is not enrolled in the course
            db.run('INSERT INTO enrolments (courseID, userID) VALUES (?, ?)', [req.params.courseID, userID], (err) => {
                if (err) res.status(500).send(err.message)
                else res.sendStatus(200)
            })
        }
    })
})

// Endpoint for passing/failing a student
app.post('/enrollment/:enrollmentID/grade', async (req, res) => {
    const userID = req.body.userID
    const userRole = await getUserRole(userID)
    if (userRole !== 2) { // Only teachers can pass/fail a student
        res.status(403).send('Access Denied')
        return
    }
    const mark = req.body.mark ? 1 : 0
    db.run('UPDATE enrolments SET mark = ? WHERE enrolmentID = ?', [mark, req.params.enrollmentID], (err) => {
        if (err) res.status(500).send(err.message)
        else res.sendStatus(200)
    })
})

app.get('/api/courses', (req, res) => {
    db.all('SELECT * FROM courses', (err, rows) => {
        if (err) {
            console.error(err.message)
            res.status(500).send('Internal server error')
            return
        }

        res.json(rows)
    })
})


app.listen(3000, () => {
    console.log('Server listening on port 3000')
})