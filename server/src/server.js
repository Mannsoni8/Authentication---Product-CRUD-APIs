import app from "./app/app.js";
import { connectDB } from "./config/db.js";
import { config } from "./config/config.js";

await connectDB();

const PORT = config.PORT;

app.get('/',()=>{
  console.log("server is running")
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});