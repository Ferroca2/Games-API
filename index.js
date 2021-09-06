const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors")

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
    ]
}
app.get("/", (req, res) => {
    res.status(200)
    res.send("BEM VINDO A MINHA PRIMEIRA API")
})
app.get("/games",(req, res) => {
    res.status(200)
    res.json(DB.games)
})

app.get("/game/:id", (req,res) => {
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

app.post("/game", (req, res) => {
    var {title, price, year} = req.body
    DB.games.push({
        id: 4,
        title,
        year,
        price
    })
    res.sendStatus(200)
})

app.delete("/game/:id", (req, res) => {
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

app.put("/game/:id", (req,res) => {
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

app.listen(8080, () => {
    console.log("API RODANDO")
})