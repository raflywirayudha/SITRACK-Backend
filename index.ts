import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/auth.routes.js";
import dosenRoutes from "./src/routes/dosen.routes.js";
import mahasiswaRoutes from "./src/routes/mahasiswa.routes.js";
import koordinatorRoutes from "./src/routes/koordinator.routes";
import { errorUploadHandler } from "./src/middlewares/error.handler";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.use(authRoutes);
app.use(dosenRoutes);
app.use(mahasiswaRoutes);
app.use(koordinatorRoutes);
app.use(errorUploadHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});