require('dotenv').config();
require('express-async-errors');
const express = require('express');

//security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');


// swagger ui 
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');

const swaggerDocs = YAML.load('./swagger.yaml');


const app = express();
const auth = require('./middleware/authentication');

// Connect DB

const connectDB = require('./db/connect');

// import Routes
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each ip to max request per window
}))
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// extra packages

// routing
app.get('/', (req, res) => {
  res.send('<h1>JOBS API</h1> <a href = "/api-docs"> Documentation <a> ');
});

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use('/api/auth', authRouter);
app.use('/api/jobs', auth, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {

    await connectDB(process.env.MONGO_URI);

    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
