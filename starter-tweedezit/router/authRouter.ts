import express from "express";
import { loginMiddleware } from "../middleware/jwtMiddleware";
import * as jwt from 'jsonwebtoken';
import { User } from "../types";
import { login, hash, createUser } from "../database";
import { FlashMessage } from "../types";
import { Session, SessionData } from "express-session";



export default function loginRouter() {
    const router = express.Router();

    router.get("/login", (req, res) => {
        res.render("login");
    });

    router.post("/login",loginMiddleware, async(req, res) => {
        const token = jwt.sign(res.locals.user, process.env.JWT_SECRET!, { expiresIn: "7d" });
        res.cookie("jwt", token, { httpOnly: true, sameSite: "lax", secure: true });
        
    });

    router.get("/logout", async(req, res) => {
        req.session.destroy(() => {
            res.redirect("/login");
        });
    });
    router.post("/logout", loginMiddleware, async (req, res) => {
        res.clearCookie("jwt");
        res.redirect("/login");
    });

    router.get("/register", (req, res) => {
        res.render("register");
    });

    router.post("/register", async(req, res) => {
        const userName:string = req.body.name;
        const password:string = await hash(req.body.password);
        const newUser: User = {username: userName, password: password, role: "USER"};
        createUser(newUser);
    });

    return router;
}