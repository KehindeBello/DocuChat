import { config } from './lib/config';
import { logger } from './lib/logger';
import { app } from './app'

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`Server is running: http://localhost:${PORT} ✅`)
})
