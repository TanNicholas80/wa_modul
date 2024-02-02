const express = require('express')
const app = express()
const port = 3000

const { initializeClient } = require('./client');

app.get('/sendMSG', async(req, res) => {
    try {
        const client = await initializeClient();

        let noTujuan = req.query.noTujuan;
        let pesan = req.query.pesan;
    
        noTujuan = noTujuan.substring(1);
        noTujuan = `62${noTujuan}@c.us`;
        let cekNumber = await client.isRegisteredUser(noTujuan)
    
        if(cekNumber == true) {
            client.sendMessage(noTujuan, pesan);
            res.json({
                status: 200,
                msg: 'Berhasil Mengirim Pesan'
            })
        } else {
            res.json({
                status: 500,
                msg: 'Gagal Mengirim Pesan'
            })
        }
    } catch(error) {
        console.error('Error:', error);
        res.status(500).json({
            status: 500,
            msg: 'Internal Server Error'
        });
    }
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})