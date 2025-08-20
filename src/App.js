const express = require('express');
const db = require('./db'); // import your connection

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json()); // to parse JSON bodies

// Example: fetch all rows from a table
app.get('/users', (req, res) => {
  db.query('SELECT * FROM user', (err, results) => {
    if (err) {
      console.error('❌ Error fetching users:', err);
      return res.status(400).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
});

app.post('/user/add',((req,res)=>{
  db.query('INSERT INTO USER (firstName,lastName,email,password,age,gender) VALUES ("Charishma","Cherukuri","charishma@gmail.com","cherry789@",20,"F")', (err,results)=>{
      if (err){
        console.log('Error :',err);
        res.status(400).send({error: 'Error occured while inserting data'});
      }
      res.send(results);
    })
}))

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
