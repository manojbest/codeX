import express from 'express';
import { Logger } from './util/logger';

const app = express();
const port = process.env.PORT || 7070;

app.get('/', (req, res) => res.send('its working'));

app.listen(port, () => {
  Logger.info(`Server is running at localhost:${port}`);
});
