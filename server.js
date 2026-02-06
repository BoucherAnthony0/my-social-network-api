const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const morgan = require('morgan');
const cors = require('cors');


dotenv.config();


connectDB();

const app = express();


app.use(express.json()); 
app.use(cors());         
app.use(morgan('dev'));  


app.get('/', (req, res) => {
    res.send('API My Social Networks est en ligne !');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/groups', require('./routes/groups'));
app.use('/api/events', require('./routes/events'));
app.use('/api/threads', require('./routes/threads'));
app.use('/api/albums', require('./routes/albums'));
app.use('/api/polls', require('./routes/polls'));
app.use('/api/tickets', require('./routes/tickets'));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Serveur lancé en mode ${process.env.NODE_ENV} sur le port ${PORT}`);
});