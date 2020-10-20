"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var path_1 = __importDefault(require("path"));
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var db_1 = require("./core/db");
var userRoutes_1 = __importDefault(require("./routes/userRoutes"));
var app = express_1.default();
app.use(cors_1.default());
app.use(express_1.default.json());
app.use(express_1.default.text());
app.set("view engine", "ejs");
app.use(express_1.default.static(path_1.default.join(__dirname, "views")));
app.use("/users", userRoutes_1.default);
app.get("/", function (_, res) {
    res.send("hello");
});
db_1.connectDB().then(function () {
    return app.listen(process.env.PORT, function () { return console.log("Server is running at " + process.env.PORT); });
});
// app.listen(5001, () => console.log("Server is running at 5001"));
