import app from "./app.js";
import { loadSOPs } from "./services/sop.service.js";

const PORT = process.env.PORT || 5000;

loadSOPs().then(() => {
  app.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT}`)
  );
});
