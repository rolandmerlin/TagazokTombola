const sqlite = require('sqlite3').verbose()
var db = new sqlite.Database('./bdd/tombola.db');

class sqliteApi {
    constructor(){
        db.serialize(() => {
            db.run("CREATE TABLE IF NOT EXISTS joueur (jid INTEGER PRIMARY KEY AUTOINCREMENT, jname TEXT UNIQUE, jticket INTEGER)");
            db.run("CREATE TABLE IF NOT EXISTS listlots (llid INTEGER PRIMARY KEY AUTOINCREMENT, llname TEXT, llquant INTEGER)");
            db.run("CREATE TABLE IF NOT EXISTS tirage (tid INTEGER PRIMARY KEY AUTOINCREMENT, tjid INTEGER, tticket INTEGER, tlid INTEGER, randomOrder BIGINT)");
            db.run("CREATE TABLE IF NOT EXISTS lots (lid INTEGER PRIMARY KEY AUTOINCREMENT, lname TEXT)");

            this.insertJoueur = db.prepare("INSERT OR IGNORE INTO joueur VALUES (?,?,?)");
            this.selectJoueur = db.prepare("SELECT * FROM joueur");
            this.updateJoueur = db.prepare("UPDATE joueur SET jname = ? , jticket = ? WHERE jid = ?");
            this.deleteJoueur = db.prepare("DELETE FROM joueur WHERE jid = ?");

            this.insertlistlots = db.prepare("INSERT OR IGNORE INTO listlots VALUES (?,?,?)");
            this.selectlistlots = db.prepare("SELECT * FROM listlots");
            this.updatelistlots = db.prepare("UPDATE listlots SET llname = ? , llquant = ? WHERE llid = ?");
            this.deletelistlots = db.prepare("DELETE FROM listlots WHERE llid = ?");

            this.inserttirage = db.prepare("INSERT OR IGNORE INTO tirage VALUES (?,?,?,?,?)");
            this.selecttirage = db.prepare("SELECT * FROM tirage");
            //this.updatetirage = db.prepare("UPDATE tirage SET tlid = ? WHERE tjid = ?");
            //this.deletetirage = db.prepare("DELETE FROM tirage WHERE tjid = ?");

            this.insertlots = db.prepare("INSERT OR IGNORE INTO lots VALUES (?,?)");
            this.selectlots = db.prepare("SELECT * FROM lots");
            this.updatelots = db.prepare("UPDATE lots SET lid = ? , lname = ? WHERE lid = ?");
            this.deletelots = db.prepare("DELETE FROM lots WHERE lid = ?");
        });
    }
    reinit(){
        db.run('DELETE FROM joueur');
        db.run('DELETE FROM listlots');
        db.run('DELETE FROM tirage');
        db.run('DELETE FROM lots');
    }
    JoueurGetAll(fn){
        db.serialize(()=>{ this.selectJoueur.all([],(err,joueur)=>{ if (err){ fn({ error:1,e:err }) } else fn({joueur,ok:1}) }) })
    }    
    JoueurInsert(data,fn){
        db.serialize(()=>{
            try {
                this.insertJoueur.run([data.jid,data.jname,data.jticket])
                this.JoueurGetAll(fn)
            } catch (e){
                fn({error:1,e:'DUPLICATE ROW'})
            }
        })
    }
    JoueurSelect(fn){
        try { db.serialize(()=>{ this.JoueurGetAll(fn) }) }
        catch (e) { fn({ error:1,e }) }
    }
    JoueurUpdate(data,fn){
        try {
            db.serialize(()=>{
                this.updateJoueur.run([data.jname,data.jticket,data.jid])
                this.JoueurGetAll(fn)
            })
        } catch (e) { fn({ error:1,e }) }
    }
    JoueurDelete(jid,fn){
        try {
            db.serialize(()=>{
                this.deleteJoueur.run([jid])
                this.JoueurGetAll(fn)
            })
        } catch (e) { fn({ error:1,e }) }
    }

    LLGetAll(fn){
        this.selectlistlots.all([],(err,listlots)=>{
            if (err) { fn({error:1,e:err}); } else { fn({ ok:1, listlots }) }
        })
    }
    LLInsert(data,fn){
        try {
            db.serialize(()=>{
                this.insertlistlots.run([data.llid,data.llname,data.llquant])
                this.LLGetAll(fn)
            })
        } catch (error) { fn({ error:1,e }) }
    }
    LLSelect(fn){ this.LLGetAll(fn) }
    LLUpdate(data,fn){
        try {
            db.serialize(()=>{
                this.updatelistlots.run([data.llname,data.llquant,data.llid])
                this.LLGetAll(fn)
            })
        } catch (e) { fn({ error:1,e }) }
    }
    LLDelete(data,fn){
        try {
            db.serialize(()=>{
                this.deletelistlots.run([data.llid])
                this.LLGetAll(fn)
            })
        } catch (e) { fn({ error:1,e})  }
    }

    TirageGetAll(fn){
        this.selecttirage.all([],(err,t)=>{
            let tirage = []
            for (const tr of t) tirage.push([tr.tid,tr.tjid,tr.tticket,tr.tlid,tr.randomOrder])
            if (err) { fn({error:1,e:err}) } else { fn({ ok:1, tirage }) }
        })
    }
    TirageInsert(data,fn){
        db.serialize(()=>{
            this.inserttirage.run(data)
        })
    }
    TirageSelect(fn){
        this.TirageGetAll(fn)
    }
    MakeTirage(fn){
        let listlots = []
        let nl = 0
        db.run('DELETE FROM tirage')
        db.run("UPDATE `sqlite_sequence` SET `seq` = 0 WHERE `name` = 'tirage'")
        this.LLGetAll(l=>{
            this.JoueurGetAll(j=>{
                let joueur = j.joueur
                let llots = l.listlots
                let l_listlots = 0
                let l_joueur = 0
                let ticket = []
                let numticket = []
                let lots = []
                for (let l of llots) l_listlots+=l.llquant
                for (let j in joueur){
                    l_joueur+=joueur[j].jticket
                    ticket = ticket.concat(Array(joueur[j].jticket).fill(j*1))
                    numticket = numticket.concat(Array.from(Array(joueur[j].jticket).keys()))
                }

                let ll = l_listlots>l_joueur?l_listlots:l_joueur
                for (let i=0;i<ll;i++) lots.push(i>=l_listlots?-1:i)
                for (let i=0;i<lots.length;i++){
                    let ai = Math.floor(lots.length*Math.random())
                    let t = lots[ai]+0
                    lots[ai]=lots[i]+0
                    lots[i]=t
                }

                let res = []
                db.serialize(()=>{
                    for (let k in ticket){
                        let randomOrder = Math.ceil(1e12*Math.random())
                        res.push([k*1+1,ticket[k],numticket[k],lots[k],randomOrder])
                        this.inserttirage.run([k*1+1,ticket[k],numticket[k],lots[k],randomOrder])
                    }                    
                })

                fn({ok:1,tirage:res})
            })
        })
    }
    close(){ db.close() }
}

module.exports = (new sqliteApi())