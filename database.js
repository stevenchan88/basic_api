const sqlite3 = require('sqlite3').verbose()


const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    }else{
        console.log('Connected to the SQLite database.')

        db.run(`CREATE TABLE roles (
            roleID INTEGER PRIMARY KEY AUTOINCREMENT,
            role varchar(45) NOT NULL
        )`,
            (err) => {
                if (err) {
                    // Table already created
                }else{
                    // Table just created, creating some rows
                    let insert = 'INSERT INTO roles (roleID, role) VALUES (?,?)'
                    db.run(insert, ["1", "admin"])
                    db.run(insert, ["2", "teacher"])
                    db.run(insert, ["3", "student"])
                }
            });
        db.run(`CREATE TABLE courses (
            courseID INTEGER PRIMARY KEY AUTOINCREMENT,
            title varchar(45) NOT NULL,
            teacherID INTEGER default "0",
            isAvailable tinyint(1)
        )`,
            (err) => {
                if (err) {
                    // Table already created
                }else{
                    // Table just created, creating some rows
                    let insert = 'INSERT INTO courses (courseID, title,teacherID, isAvailable) VALUES (?,?,?,?)'
                    db.run(insert, [1,'Data structures',6,1])
                    db.run(insert, [2,'Databases',5,1])
                    db.run(insert, [3,'Machine learning',0,1])
                    db.run(insert, [4,'Network security',0,0])
                    db.run(insert, [5,'Computer graphics',0,0])
                    db.run(insert, [6,'Computer programming I',0,0])
                    db.run(insert, [7,'Game development',0,0])
                    db.run(insert, [8,'Computer algorithms',0,0])
                    db.run(insert, [9,'Computer programming II',0,0])
                    db.run(insert, [10,'Project management',0,0])

                }
            });
        db.run(`CREATE TABLE enrolments (
            enrolmentID INTEGER PRIMARY KEY AUTOINCREMENT,
            mark INTEGER DEFAULT NULL,
            courseID INTEGER NOT NULL,
            userID INTEGER NOT NULL,
            FOREIGN KEY(courseID) REFERENCES courses(courseID),
            FOREIGN KEY(userID) REFERENCES users(userID)
        )`,
            (err) => {
                if (err) {
                    // Table already created
                }else{
                    // Table just created, creating some rows
                    let insert = 'INSERT INTO enrolments (mark, courseID, userID) VALUES (?,?,?)'
                    db.run(insert, [1,1,6])

                }
            });

        db.run(`CREATE TABLE users (
            userID INTEGER PRIMARY KEY AUTOINCREMENT,
            name text,
            roleID INTEGER NOT NULL,
            FOREIGN KEY(roleID) REFERENCES roles(roleID)
            )`,
            (err) => {
                if (err) {
                    // Table already created
                }else{
                    // Table just created, creating some rows
                    let insert = 'INSERT INTO users (name, roleID) VALUES (?,?)'
                    db.run(insert, ['Clark Taylor',1])
                    db.run(insert, ['Natalie Armstrong',1])
                    db.run(insert, ['Max Barrett',2])
                    db.run(insert, ['Alisa Barnes',2])
                    db.run(insert, ['Catherine Nelson',2])
                    db.run(insert, ['Ted Casey',2])
                    db.run(insert, ['Dainton Henderson',2])
                    db.run(insert, ['Sarah Howard',2])
                    db.run(insert, ['Adrianna Hall',3])
                    db.run(insert, ['Kelvin Murray',3])
                    db.run(insert, ['Kate Wilson',3])
                    db.run(insert, ['Nicholas Ross',3])

                }
            });
        console.log('Tables created')
    }
});


module.exports = db