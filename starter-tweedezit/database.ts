import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { Series, User } from "./types";
import bcrypt from "bcrypt";
import { response } from "express";
import { Console } from "console";
dotenv.config();

export const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
export const client = new MongoClient(MONGODB_URI);
export const userCollection = client.db("login-express").collection<User>("users");
let cursor =  client.db("herexamen").collection("series").find<Series>({});

const saltRounds : number = 10;



export async function seedDatabase() {
    let series: Series[] = [];
    try {
        const response = await fetch('https://raw.githubusercontent.com/similonap/json/master/series.json');
        series = await response.json();
    } catch(error: any){
        console.log(error);
    }
    const result = await client.db("herexamen").collection("series").insertMany(series);
}

export async function getSeries(q: string, sortField: string, direction: string) {
    const series:Series[] = await cursor.toArray();
    let filteredSeries: Series[] = series.filter((serie) => {
        serie.title.toLowerCase().includes(q.toLowerCase());
    });

    let sortedseries = [...filteredSeries].sort((a, b) => {
        if (sortField === "title") {
            return direction === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
        } else if (sortField === "genre") {
            return direction === "asc" ? a.title.localeCompare(b.genre) : b.genre.localeCompare(a.genre);
        } else if (sortField === "rating") {
            return direction === "asc" ? a.rating - b.rating : b.rating - a.rating;
        } else {
            return 0;
        }
    });

    return sortedseries;
}

export async function getUser(username: string) {
    try{
        let user: User = await userCollection.findOne<User>({username:username});
    } catch(error:any) {
        console.log(error);
    }
    return user;
}



export async function deleteSeries(id: string) {
    const result = await client.db("herexamen").collection("series").deleteOne({id: id});
}

export async function login(username: string, password: string) {
    if (username === "" || password === "") {
        throw new Error("Email and password required");
    }
    let user : User | null = await userCollection.findOne<User>({username: username});
    if (user) {
        if (await bcrypt.compare(password, user.password!)) {
            return user;
        } else {
            throw new Error("Password incorrect");
        }
    } else {
        throw new Error("User not found");
    }
}

export async function createUser(user: User) {
    try {
        const result = await client.db("herexamen").collection("users").insertOne(user);
        console.log(`New document created with the following id: ${result.insertedId}`);
    } catch (e) {
        console.error(e);
    }
}

async function exit() {
    try {
        await client.close();
        console.log("Disconnected from database");
    } catch (error) {
        console.error(error);
    }
    process.exit(0);
}

export async function hash(password:string) : Promise<string> {
    let hashedPassword : string =  await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

export async function connect() {
    await client.connect();
    await seedDatabase();
    console.log("Connected to database");
    process.on("SIGINT", exit);
}