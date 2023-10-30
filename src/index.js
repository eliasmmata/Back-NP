import './database/database';
import app from '../src/app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
});