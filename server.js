import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import loginRoutes from "./routes/loginRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import casesRoutes from "./routes/casesRoutes.js";
import followupRoutes from "./routes/followupRoutes.js";

const app = express();
//const PORT = 5000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
// app.use((req, res, next) => {
// 	res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
// 	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
// 	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
// 	next();
// });

// JWT Authentication middleware
app.use((req, res, next) => {
	if (
		req.headers &&
		req.headers.authorization &&
		req.headers.authorization.split(" ")[0] === "JWT"
	) {
		console.log(req.user);
		jsonwebtoken.verify(
			req.headers.authorization.split(" ")[1],
			process.env.JWT_SECRET,
			(err, decode) => {
				if (err) req.user = undefined;
				req.user = decode;
				next();
			},
		);
	} else {
		req.user = undefined;
		next();
	}
});

app.get("/", (req, res) => {
	res.send("API is running...");
});

app.use("/", loginRoutes);
app.use("/", adminRoutes);
app.use("/", settingsRoutes);
app.use("/", casesRoutes);
app.use("/", followupRoutes);

// app.listen(PORT, () => {
// 	console.log(`Server started on port ${PORT}`);
// });
app.listen(config.port || 5000, () => {
	console.log("Server started on port ");
});