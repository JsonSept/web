import express from 'express';
import bcrypt from 'bcrypt';
import mysql from 'mysql2';
import jwt from 'jsonwebtoken';

const app = express();

const port = 9000;

// Middleware to parse JSON bodies
app.use(express.json());

// Set up the database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'users'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to database');
        return;
    }
    console.log('Connected to the database')
});

// Secret key for JWT
const SECRET_KEY = "gvadcgiCOY8wgyocHCBCQ";


app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// POST route to register a new user
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    // Validate the data (this is a basic example, more validation may be needed)
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields.' });
    }

// Check if the user already exists
db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
        return res.status(500).json({ message: 'Database error.' });
    }

    if (results.length > 0) {
        return res.status(400).json({ message: 'User already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
        'INSERT INTO users (username, email, password) VALUES (?,?,?)',
        [username, email, hashedPassword],
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database error.' });
            }

            // send a success response
            res.status(201).json({ messsage: 'User registered successfully!' });
        }
    );
});
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    //Validate the data
    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    // Check if the user exists
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Database error.' });
        }
         
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
         
        const user = results[0];

        //compare the provided password with the hashed password in the database
        const Matching = await bcrypt.compare(password, user.password);

        if (!Matching) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Create a JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email }, // Payload
            SECRET_KEY, // Secret Key
            { expiresIn: '1h' } // Token expiration time
        );

        // Send the token to the client
        res.json({ token });
    });
});
app.get('/', (req, res) => {
  const data = { message: 'Here is your data!' };
  res.json(data);
});

// Middleware to verify the JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401); // Unautherized
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }

        req.user = user;
        next(); // Pass control to the next handler
    });
}

app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});



app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});