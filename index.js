const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors")
const jwt = require("jsonwebtoken")

const jwtSecret = "matheusferroca"

function auth (req, res, next){
    const authToken = req.headers['authorization']
    if(authToken != undefined){
        const bearer = authToken.split(" ")
        let token = bearer[1]
        jwt.verify(token, jwtSecret,(err, data) => {
            if(err){
                res.sendStatus(401)
            }else{
                req.token = token
                req.loggerUser = {id: data.id, email: data.email}
                next()
            }
        })
    }else{
        res.sendStatus(401)
    }
}

app.use(cors())
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var DB ={
    games: [
        {
            id: 1,
            title: "overwatch",
            year: 2020,
            price: 90
        },
        {
            id: 2,
            title: "Ferroca gamer",
            year: 2022,
            price: 900
        },
        {
            id: 3,
            title: "Ferroca rico",
            year: 2021,
            price: 100090
        }
    ],
    users: [
        {
            id:1,
            name: "matheus",
            email: "ferra",
            password: "1234"
        }
    ]
}
app.get("/", (req, res) => {
    res.status(200)
    res.send("BEM VINDO A MINHA PRIMEIRA API")
})
app.get("/games",auth,(req, res) => {
    res.status(200)
    res.json(DB.games)
})

app.get("/game/:id", auth, (req,res) => {
    if(isNaN(req.params.id)){
        res.sendStatus(400)
    }else{
        let id = parseInt(req.params.id)
        let game = DB.games.find((game) => game.id == id)
        if (game != undefined){
            res.status(200)
            res.json(game)
        }else{
            res.sendStatus(404)
        }
    }
})

app.post("/game", auth, (req, res) => {
    var {title, price, year} = req.body
    DB.games.push({
        id: 4,
        title,
        year,
        price
    })
    res.sendStatus(200)
})

app.delete("/game/:id", auth, (req, res) => {
    if(isNaN(req.params.id)){
        res.sendStatus(400)
    }else{
        let id = parseInt(req.params.id)
        let index = DB.games.findIndex((game) => game.id == id)
        if(index == -1){
            res.sendStatus(404)
        }else{
            DB.games.splice(index, 1)
            res.sendStatus(200)
        }
    }
})

app.put("/game/:id", auth, (req,res) => {
    if(isNaN(req.params.id)){
        res.sendStatus(400)
    }else{
        let id = parseInt(req.params.id)
        let game = DB.games.find((game) => game.id == id)
        if (game != undefined){
            var {title, price, year} = req.body
            if(title!=undefined){
                game.title = title
            }
            if(price != undefined){
                game.price = price
            }
            if(year!=undefined){
                game.year = year
            }
            res.sendStatus(200)
        }else{
            res.sendStatus(404)
        }
    }
})

app.post("/auth", auth, (req, res) => {
    let {email, password} = req.body
    let user = DB.users.find(user => user.email == email)
    if(user.password == password){
        jwt.sign({id: user.id, email: user.email}, jwtSecret, {expiresIn: "1h"}, (err, token) => {
            if(err){
                res.sendStatus(400)
            }else{
                res.status(200)
                res.json({token: token})
            }
        })
    }
})

app.listen(8080, () => {
    console.log("API RODANDO")
})