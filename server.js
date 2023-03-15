const express = require('express')
const bodyParser = require('body-parser')
const db = require('./database')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Helper function to get user role
const getUserRole = (userID) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT roleID FROM users WHERE userID = ?', [userID], (err, row) => {
            if (err) reject(err)
            else resolve(row.roleID)
        })
    })
}



// 1: Endpoint for enabling/disabling a course
// To use this endpoint, include the following elements in the request body:
// - userID: (integer) the ID of the user making the request (required)
// - isAvailable: (boolean) a boolean value indicating whether the course should be enabled (true) or disabled (false).
app.post('/course/:courseID/availability', async (req, res) => {
    console.log(req.body)
    const userID = req.body.userID
    const courseID = req.params.courseID
    const userRole = await getUserRole(userID)
    console.log(`userRole: ${userRole}`)
    if (userRole !== 1) { // Only admins can enable/disable a course
        res.status(403).send('Access Denied')
        return
    }
    const isAvailable = req.body.isAvailable ? 1 : 0
    db.run('UPDATE courses SET isAvailable = ? WHERE courseID = ?', [isAvailable, courseID], (err) => {
        if (err) res.status(500).send(err.message)
        else res.status(200).send(`user ${userID} enabled course ${courseID}`)
    })
})

// 2: Endpoint for assigning a teacher to a course
// To use this endpoint, include the following elements in the request body:
// - userID: (integer) the ID of the user making the request (required, must be Admin)
// - teacherID: (integer) the ID of the teacher to be assigned to the course (required)
app.post('/course/:courseID/teacher', async (req, res) => {
    const userID = req.body.userID
    const courseID = req.params.courseID
    const userRole = await getUserRole(userID)
    if (userRole !== 1) { // Only admins can assign a teacher to a course
        res.status(403).send('Access Denied')
        return
    }
    const teacherID = req.body.teacherID
    db.run('UPDATE courses SET teacherID = ? WHERE courseID = ?', [teacherID, courseID], (err) => {
        if (err) res.status(500).send(err.message)
        else res.status(200).send(`Teacher ${teacherID} assigned to course ${courseID}`)
    })
})


app.get('/courses', async (req, res) => {
    const userID = req.body.userID;
    console.log(userID)
    const userRole = await getUserRole(userID);
    let query;
    if (userRole === 3) { // Students can only see the course title and teacher name
        query = `SELECT courses.title, users.name AS TeacherName FROM courses 
                 LEFT JOIN users ON courses.teacherID = users.userID
                 WHERE courses.isAvailable = 1`;
    } else { // Admins and teachers can see the course ID, title and teacher name
        query = `SELECT courses.courseID, courses.title, users.name AS TeacherName FROM courses 
                 LEFT JOIN users ON courses.teacherID = users.userID
                 WHERE courses.isAvailable = 1`;
    }
    db.each(query, (err, row) => {
        if (err) {
            console.error(err.message)
            res.status(500).send('Internal server error')
            return
        }

        console.log(row) // Output the current row to the console
        res.write(JSON.stringify(row) + '\n') // Send the current row to the client, with a newline character
    }, (err, num) => {
        if (err) {
            console.error(err.message)
            res.status(500).send(err.message)
            return
        }

        res.end() // Signal the end of the response to the client
    })
})




// 4: Endpoint for enrolling in a course
// To use this endpoint, include the following element in the request body:
// - userID: (integer) the ID of the student who is enrolling in the course (required)
// - courseID: (integer) the ID of the course in which to enrol (required)
app.post('/course/:courseID/enroll', async (req, res) => {
    const userID = req.body.userID
    const courseID = req.params.courseID
    const userRole = await getUserRole(userID)
    if (userRole !== 3) { // Only students can enroll in a course
        res.status(403).send('Access Denied')
        return
    }
    db.get('SELECT * FROM enrolments WHERE courseID = ? AND userID = ?', [courseID, userID], (err, row) => {
        if (err) res.status(500).send(err.message)
        else if (row) { // Student is already enrolled in the course
            res.status(400).send('Already enrolled in the course')
        } else { // Student is not enrolled in the course
            db.run('INSERT INTO enrolments (courseID, userID) VALUES (?, ?)', [courseID, userID], (err) => {
                if (err) res.status(500).send(err.message)
                else res.status(200).send(`Used ${usedID} enrolled onto course ${courseID}`)
            })
        }
    })
})

// 5: Endpoint for passing/failing a student
// To use this endpoint, include the following elements in the request body:
// - mark: (boolean) a boolean value indicating whether the student has passed (true) or failed (false).
//   This element is optional; if not provided, the student's mark will not be changed.
// - userID: (integer) the ID of the teacher making the request (required)
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
        else res.status(200).send(`Grade ${mark} given to user ${userID}`)
    })
})

app.get('/view/courses', (req, res) => {
    db.each('SELECT * FROM courses', (err, row) => {
        if (err) {
            console.error(err.message)
            res.status(500).send('Internal server error')
            return
        }

        console.log(row) // Output the current row to the console
        res.write(JSON.stringify(row) + '\n') // Send the current row to the client, with a newline character
    }, (err, num) => {
        if (err) {
            console.error(err.message)
            res.status(500).send('Internal server error')
            return
        }

        res.end() // Signal the end of the response to the client
    })
})


app.get('/view/users', (req, res) => {
    db.each('SELECT * FROM users', (err, row) => {
        if (err) {
            console.error(err.message)
            res.status(500).send('Internal server error')
            return
        }

        console.log(row) // Output the current row to the console
        res.write(JSON.stringify(row) + '\n') // Send the current row to the client
    }, (err, num) => {
        if (err) {
            console.error(err.message)
            res.status(500).send('Internal server error')
            return
        }

        res.end() // Signal the end of the response to the client
    })
})


app.get('/view/enrolments', (req, res) => {
    db.each('SELECT * FROM enrolments', (err, row) => {
        if (err) {
            console.error(err.message)
            res.status(500).send('Internal server error')
            return
        }

        console.log(row) // Output the current row to the console
        res.write(JSON.stringify(row) + '\n') // Send the current row to the client, with a newline character
    }, (err, num) => {
        if (err) {
            console.error(err.message)
            res.status(500).send('Internal server error')
            return
        }

        res.end() // Signal the end of the response to the client
    })
})


app.get('/view/roles', (req, res) => {
    db.each('SELECT * FROM roles', (err, row) => {
        if (err) {
            console.error(err.message)
            res.status(500).send('Internal server error')
            return
        }

        console.log(row) // Output the current row to the console
        res.write(JSON.stringify(row) + '\n') // Send the current row to the client, with a newline character
    }, (err, num) => {
        if (err) {
            console.error(err.message)
            res.status(500).send('Internal server error')
            return
        }

        res.end() // Signal the end of the response to the client
    })
})



app.listen(3000, () => {
    console.log('Server listening on port 3000')
})
