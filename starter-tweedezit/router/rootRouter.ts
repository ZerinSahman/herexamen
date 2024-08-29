import express from "express";
import { getSeries, getUser, deleteSeries } from "../database";
import { User, Series } from "../types";
import { loginMiddleware } from "../middleware/jwtMiddleware";
import { ObjectId } from "mongodb";

export default function rootRouter() {
    const router = express.Router();

    router.get("/",loginMiddleware, async(req, res) => {
        let q: string = req.body.q;
        let sortField = req.body.sortField;
        let sortDirection = req.body.sortDirection;
        res.locals.series = await getSeries(q, sortField, sortDirection);
            
            
        res.render("index");
    });

    router.post("/delete/:id", async(req, res) => {
        let id:ObjectId = req.body.id;
        await deleteSeries(id.toString());
        res.redirect("/");
    })

    return router;
}