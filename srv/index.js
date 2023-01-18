const bdd = require('./lib/sqliteApi')

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')

app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(cors())
const port = 3001

app.use(express.static('../dist'))

app.get('/api/joueur',(req,res)=>{ bdd.JoueurSelect(d=>res.json(d)) })
app.post('/api/joueur',(req,res)=>{ bdd.JoueurInsert({...req.body},d=>res.json(d)) })
app.put('/api/joueur',(req,res)=>{ bdd.JoueurUpdate({...req.body}, d=>{ res.json(d) }) })
app.delete('/api/joueur/:jid',(req,res)=>{ bdd.JoueurDelete(req.params.jid,d=>res.json(d) ) })

app.get('/api/listlots',(req,res)=>{ bdd.LLSelect( d => res.json(d) ) })
app.post('/api/listlots',(req,res)=>{ bdd.LLInsert({...req.body},d=>res.json(d) ) })
app.put('/api/listlots',(req,res)=>{ bdd.LLUpdate({...req.body},d=>res.json(d) ) })
app.delete('/api/listlots/:llid',(req,res)=>{ bdd.LLDelete({ ...req.params },d=>res.json(d) ) })

app.get('/api/lots',(req,res)=>{ bdd.LotSelect(d=>res.json(d)) })
app.get('/api/tirage',(req,res)=>{ bdd.TirageSelect(d => res.json(d)) })

app.get('/api/maketirage',(req,res)=>{ bdd.MakeTirage(d=> res.json(d)) })
app.delete('/api/cleanTirage',(req,res)=>{

})

app.listen(port)
