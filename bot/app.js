const { Client, MessageMedia } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode');
const { body, validationResult, Result } = require('express-validator');
const fs = require('fs');
const http = require('http');
const socketIO = require('socket.io');
const request=require('request');
const { phoneNumberFormatter } = require('./helpers/formatter.js');
const mysql = require('mysql')


const penggunaAksi = new Map(); //inisiasi user
var modes = ["stop", "0", "konsul", "daftar", "kritik", "donasi", "artikel", "event"];
//inisiasi server
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const connecting = mysql.createConnection({
    host: 'remotemysql.com',
    user: 'MqISQsRFUS',
    password: 'Zynv6BoeQE',
    database: 'MqISQsRFUS'
});

function getConnection() {
    return connecting
}

const connection = getConnection()

app.use(express.json());
app.use(express.urlencoded(({ extended: true })));

const SESSION_FILE_PATH = './whatsapp-session.json';
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionCfg = require(SESSION_FILE_PATH);
}

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});
const client = new Client({
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process', // <- this one doesn't works in Windows
            '--disable-gpu'
        ],
    }, session: sessionCfg
});
const ahli = ["6281217883810@c.us"];

client.on('message', async msg => {
    var kontak = await msg.getContact()

    //cek terminal
    console.log(kontak);
    console.log(msg);
    console.log(penggunaAksi);

    mode = penggunaAksi.get(kontak.number + "_mode");
    
    if(mode==null){
        penggunaAksi.set(kontak.number+"_mode", "stop");
        mode = "stop";
    }
    if(ahli.includes(msg.from)){
        kirimJawaban(msg.body);
        //break;
    }
    else if (mode != "konsul" || msg.body == "0" || msg.body == "stop" || msg.body.toLowerCase() == "artikel" || msg.body.toLowerCase() == "kritik" || msg.body.toLowerCase() == "donasi" || msg.body.toLowerCase() == "event")
    switch(msg.body.toLowerCase()){
        case "konsul": //mode konsultasi
            if(mode.toLowerCase()=="konsul") return;
            resetSpam(kontak);
            penggunaAksi.set(kontak.number+"_mode", "konsul");
            mode ="konsul";
            msg.reply("Waalaikumussalaam Warahmatullahi Wabarakatuh, Selamat datang di sistem automasi konsultasi dari Konsul.in. Sistem ini akan menghubungkanmu langsung dengan para ustaz. Pastikan kamu telah membaca profil ustaz yang ingin kamu hubungi pada laman konsulin. Untuk memilih ustaz yang ingin kamu hubungi silahkan masukkan nomor ustaz yang kamu pilih.\n1. Ust. Risqi Firdaus\n2. Ust. Hafidz Nur\n3. Ust. Riyandy Hassan\n4. Ust. Er-Rahman\n0. Kembali ke menu utama.\nKirimkan nomor ustaz pilhanmu dengan format angka saja.");
            break;
        case "stop": // mode stop
            if (mode.toLowerCase() == "stop") return;
            resetSpam(kontak);
            penggunaAksi.set(kontak.number+"_mode", "stop");
            mode = "stop";
            msg.reply("Terima kasih telah menggunakan jasa Konsul.in. Kami menyadari banyak kekurangan dalam platform kami, kami mohon sebesar-besarnya atas ketidaknyamanan yang ada. Sampai jumpa di lain waktu. Ilal Liqo' \n\nKirim \"00\" Untuk kembali ke menu utama.");
            break;
        case "donasi": //mode donasi
            if (mode.toLowerCase() == "donasi") return;
            resetSpam(kontak);
            penggunaAksi.set(kontak.number+"_mode", "donasi");
            mode="donasi";
            msg.reply("Donasi dapat disalurkan melalui:\nBank BRI a.n. Muhammad Risqi Firdaus\nXXXXXXXXXXXX\natau\nLinkaja a.n. Muhammad Risqi Firdaus\n082245200501\n\nJanga lupa untuk mengonfirmasi donasi dengan mengirimkan bukti transfer melalui Whatsapp ke nomor 082245200501. Terima kasih karena telah membantu. Donasi kalian akan kami manfaatakan sebaik-baiknya. Semoga amal ibadah kita diterima oleh ALLAH SWT.\n\nKirim \"0\" Untuk kembali ke menu utama. ");
            break;
        case "kritik": //kritik saran
            if (mode.toLowerCase() == "kritik") return;
            resetSpam(kontak);
            penggunaAksi.set(kontak.number+"_mode", "kritik");
            mode="kritik";
            msg.reply("Silahkan kirimkan kritik atau Saran kamu...\n\nSetiap masukan kamu bakal jadi pertimbangan buat kami. Terima kasih telah membantu kami berkembang. Kritik dapat disampaikan melalui WA admin kami, 082245200501");
            break;
        case "artikel": //daftar artikel
            if (mode.toLowerCase() == "artikel") return;
            resetSpam(kontak);
            penggunaAksi.set(kontak.number+"_mode", "artikel");
            penggunaAksi.set(kontak.number+"_artikel",0);
            mode="artikel"
            client.sendMessage(msg.from,"Kamu sekarang sedang berada di mode Artikel. Kami akan menyajikan artikel terbaru tentang agama yang tersedia pada laman konsul.in. Untuk informasi lengkap kamu bisa langsung berkunjung ke laman konsul.in. Memuat artikel... \n\nUntuk berhenti dari mode ini silahkan ketikkan \"stop\" tanpa tanda petik, agar kamu otomatis keluar dari mode otomasi Konsul.in. Untuk kembali, silahkan kirimkan 0. Terima kasih sudah membaca.");
            //getArtikel(msg, kontak.from);
            var output = "Berikut artikel terbaru dari Konsul.in:\n"
            request("https://powerful-peak-20198.herokuapp.com/artikel", { json: true }, async (err, results, body) => {
                if (err) {
                    client.sendMessage(nomor, "Mohon maaf sepertinya terjadi sesuatu, sistem gagal mendapatkan artikel, silahkan coba lagi.");
                    return console.log(err);
                }
                /*console.log(results.body[0])
                msg.reply(results.body[0].judulArtikel)*/
                for (let i = 0; i < results.body.length; i++) {
                    output += "\n*\t" + results.body[i].judulArtikel + "\n\toleh:" + results.body[i].penulis + "\n\tdapat diakses melalui " + "https://powerful-peak-20198.herokuapp.com/baca/" + (i + 1);
                }
            client.sendMessage(msg.from, output)})
            break;
        case "event": //daftar event
            if (mode.toLowerCase() == "event") return;
            resetSpam(kontak);
            penggunaAksi.set(kontak.number + "_mode", "event");
            penggunaAksi.set(kontak.number + "_event", 0);
            mode ="event"
            client.sendMessage(msg.from,"Kamu sekarang sedang berada di mode Event. Kami akan menyajikan artikel terbaru tentang agama yang tersedia pada laman konsul.in. Untuk informasi lengkap kamu bisa langsung berkunjung ke laman konsul.in. Memuat event... \n\nUntuk berhenti dari mode ini silahkan ketikkan \"stop\" tanpa tanda petik, agar kamu otomatis keluar dari mode otomasi Konsul.in. Untuk kembali, silahkan kirimkan 0. Terima kasih sudah membaca.");
            var output = "Berikut artikel terbaru dari Konsul.in:\n"
            request("https://powerful-peak-20198.herokuapp.com/event", { json: true }, async (err, results, body) => {
                if (err) {
                    client.sendMessage(nomor, "Mohon maaf sepertinya terjadi sesuatu, sistem gagal mendapatkan artikel, silahkan coba lagi.");
                    return console.log(err);
                }
                /*console.log(results.body[0])
                msg.reply(results.body[0].judulArtikel)*/
                for (let i = 0; i < results.body.length; i++) {
                    output += "\n*\t" + results.body[i].namaEvent + "\n\t" + results.body[i].keterangan + "\n\t" + "untuk pendaftaran lebih lanjut hubungi: 082245200501";
                }
                client.sendMessage(msg.from, output)
            })

            break;
        case "daftar":
            if (mode.toLowerCase() == "event") return;
            resetSpam(kontak);
            penggunaAksi.set(kontak.number + "_mode", "daftar");
            //penggunaAksi.set(kontak.number + "_event", 0);
            client.sendMessage(msg.from,"Untuk pendaftaran kegiatan mentoring silakan lakukan pembayaran sebesar Rp15.000. Kemudian isi sesuai format data sebagai berikut:\nNama Lengkap:\nEmail:\nLink gdrive bukti pembayaran:\nTempat, tanggal lahir:\nPekerjaan:\nInstansi:\n\nKamu isi dengan meng-_copy_ pesan ini dan kirim kan lagi ke sini. Jika terdapat hal yang ingin ditanyakan silahkan hubungi admin kami melalui WA 082245200501. Terima Kasih");
            break;
        default:
            if(mode)
                msg.reply("Assalamualaikum warahmatullahi wabarakatuh\nSelamat pagi/siang/malam kak, terima kasih telah menghubungi tim Konsul.in\n\nApakah ada yang bisa kami bantu?\nSilakan pilih salah satu menu berikut\n1. Konsultasi\nUntuk konsultasi, atau tanya-jawab agama silahkan reply dengan \"konsul\"\n2. Donasi\n untuk mengirimkan donasi silahkan reply dengan \"donasi\"\n3. Saran/Kritik\nUntuk mengirim kritik dan saran silahkan reply dengan \"kritik\"\n4. Artikel\nUntuk melihat daftar artikel yang tersedia di laman Konsul.in silahkan reply dengan \"artikel\"\n5. Event\nUntuk mengikuti kegiatan mentoring premium, silahkan sesuaikan dengan jadwal kegiatan yang tertera di menu event. Anda juga dapat mengecek penjelasan kegiatan di menu artikel. Mentoring akan dilakukan secara interaktif. Untuk mendaftar sebagai anggota permium silahkan reply dengan \"daftar\"\nAnda cukup menuliskan tanpa tanda petik keyword yang diingingkan saja.\n\nUntuk berhenti silahkan ketik \"stop\"\nWassalamualaikum warahamtullahi wabarakatuh")
            break;
        }
    switch(mode){
        case "konsul":
            switch(msg.body.toLowerCase()){
                case "1":
                    resetSpam(kontak);
                    penggunaAksi.set(kontak.number+"_mode","1");
                    mode="1";
                    msg.reply("Silahkan tuliskan pertanyaan anda dalam satu _bubble chat_. Bila ingin bertanya menggunakan media, silahkan unggah ke gdrive atau platfrom sejenis lain kemudian kirim pertanyaan beserta link media yang kamu kirimkan.");
                    break;
                case "2":
                    resetSpam(kontak);
                    penggunaAksi.set(kontak.number + "_mode", "2");
                    mode = "2";
                    msg.reply("Silahkan tuliskan pertanyaan anda dalam satu _bubble chat_. Bila ingin bertanya menggunakan media, silahkan unggah ke gdrive atau platfrom sejenis lain kemudian kirim pertanyaan beserta link media yang kamu kirimkan.");
                    break;
                case "3":
                    resetSpam(kontak);
                    penggunaAksi.set(kontak.number + "_mode", "3");
                    mode = "3";
                    msg.reply("Silahkan tuliskan pertanyaan anda dalam satu _bubble chat_. Bila ingin bertanya menggunakan media, silahkan unggah ke gdrive atau platfrom sejenis lain kemudian kirim pertanyaan beserta link media yang kamu kirimkan.");
                    break;
                case "4":
                    resetSpam(kontak);
                    penggunaAksi.set(kontak.number + "_mode", "4");
                    mode = "4";
                    msg.reply("Silahkan tuliskan pertanyaan anda dalam satu _bubble chat_. Bila ingin bertanya menggunakan media, silahkan unggah ke gdrive atau platfrom sejenis lain kemudian kirim pertanyaan beserta link media yang kamu kirimkan.");
                    break;
                /*case "5":
                    resetSpam(kontak);
                    penggunaAksi.set(kontak.number + "_mode", "5");
                    mode = "5";
                    msg.reply("Silahkan tuliskan pertanyaan anda dalam satu _bubble chat_. Bila ingin bertanya menggunakan media, silahkan unggah ke gdrive atau platfrom sejenis lain kemudian kirim pertanyaan beserta link media yang kamu kirimkan.");
                    break;*/
                default:
                    tambahSpam(kontak, msg);
                    return;
            }
        case "1":
            if (modes.includes(msg.body.toLowerCase())) break;
            var number = "6281217883810@c.us";
            var isi=msg.body;
            var sumber = msg.from;
            sendKonsul(number, isi, sumber);
            break;
        case "2":
            if (modes.includes(msg.body.toLowerCase())) break;
            var number = "6281217883810@c.us";
            var isi = msg.body;
            var sumber = msg.from;
            sendKonsul(number, isi, sumber);
            break;
        case "3":
            if (modes.includes(msg.body.toLowerCase())) break;
            var number = "6281217883810@c.us";
            var isi = msg.body;
            var sumber = msg.from;
            sendKonsul(number, isi, sumber);
            break;
        case "4":
            if (modes.includes(msg.body.toLowerCase())) break;
            var number = "6281217883810@c.us";
            var isi = msg.body;
            var sumber = msg.from;
            sendKonsul(number, isi, sumber);
            break;
        case "daftar":
            if (modes.includes(msg.body.toLowerCase())) break;
            var number = "6281217883810@c.us";
            var isi = msg.body;
            var sumber = msg.from;
            sendDaftar(numbe, isi, sumber);
            break;
        }
});

function sendKonsul(tujuan, kisi, asal){
    var isi = asal+"\n\nAssalamualaikum ustadz/ustadzah, mohon maaf menganggu waktunya. Izin untuk bertanya."+kisi+"Terima kasih atas jawabannya";
    client.sendMessage(tujuan,isi);
    const jawab = "Terima kasih telah menggunakan platform konsulin. Silahkan menunggu jawaban dari asatidz, semoga menjadi berkah. Semoga membantu, dan sampai jumpa.";
    client.sendMessage(asal,jawab);
    mode = "stop";
}

function sendDaftar(tujuan, kisi, asal) {
    client.sendMessage(tujuan, kisi);
    const jawab = "Terima kasih telah bergabung bersama kami. Silahkan menunggu konfirmasi dan informasi lebih lanjut dari kami, semoga menjadi berkah. Semoga membantu, dan sampai jumpa.";
    client.sendMessage(asal, jawab);
    mode = "stop";
}

function kirimJawaban(jawaban){
    const balik=jawaban.substr(0,18);
    const hasil=jawaban.substr(19,jawaban.length);
    client.sendMessage(balik,hasil);
}
/*
function getArtikel(msg, nomor){
    var output = "Berikut artikel terbaru dari Konsul.in:\n"
    const akhir = ""
    request("https://powerful-peak-20198.herokuapp.com/artikel", {json: true}, async (err, results, body)=>{
    if(err){
        msg.sendMessage(nomor,"Mohon maaf sepertinya terjadi sesuatu, sistem gagal mendapatkan artikel, silahkan coba lagi.");
        return console.log(err);
    }
    for(let i=0; i<body.length; i++){
        output += "\n \t" + body[i].judulArtikel + "\n\t oleh:" + body[i].penulis + "\n\t dapat diakses melalui" + "https://powerful-peak-20198.herokuapp.com/baca/"+(i+1)+"\n";
    }
    client.sendMessage(nomor,output)
    })

}*/


client.initialize();

//Socket IO
io.on('connection', function (socket) {
    socket.emit('message', 'Connecting');

    client.on('qr', (qr) => {
        // Generate and scan this code with your phone
        console.log('QR RECEIVED', qr);
        qrcode.toDataURL(qr, (err, url) => {
            socket.emit('qr', url);
            socket.emit('message', 'QR Code Recived, scan please');
        });
    });
    client.on('ready', () => {
        socket.emit('ready', 'WA dah bisa')
        socket.emit('message', 'WA is ready');
    });
    client.on('authenticated', (session) => {
        socket.emit('authenticated', 'WA dah masuk cuyy')
        socket.emit('message', 'WA is Authenticated');
        console.log('AUTHENTICATED', session);
        sessionCfg = session;
        fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
            if (err) {
                console.error(err);
            }
        });
    });
});

const checkRegisteredNumber = async function (number) {
    const isRegistered = await client.isRegisteredUser(number);
    return isRegistered;
}

//spam checker
function resetSpam(kontak) {
    penggunaAksi.set(kontak.number + "_spam", 0);
}
function tambahSpam(kontak, msg) {
    var spam = penggunaAksi.get(kontak.number + "_spam");
    if (spam == null) spam = 0;
    console.log(spam);
    if (spam >= 3) {
        penggunaAksi.set(kontak.number + "_mode", "stop");
        msg.reply("Batas invalid tercapai, *Mohon baca lebih teliti informasi yang diberikan, setiap informasi memiliki _perintah_ tersendiri*\n\n_Untuk menghindari spam berlebih sitem otomatis Konsul.in akan dimatikan._");
        resetSpam(kontak);
        return;
    }
    penggunaAksi.set(kontak.number + "_spam", spam + 1);
    //client.sendMessage("Perintah tidak valid" + stop);
}

// Sen message
app.post('/send-message', [
    body('number').notEmpty(),
    body('message').notEmpty(),
], (req, res) => {
    const errors = validationResult(req).formatWith(({ msg }) => {
        return msg;
    });
    if (!errors.isEmpty()) {
        return res.status(422).json({
            status: false,
            message: errors.mapped()
        })
    }
    const number = phoneNumberFormatter(req.body.number);
    const message = req.body.message;

    const isRegisteredNumber = checkRegisteredNumber(number);

    if (!isRegisteredNumber) {
        return res.status(422).json({
            status: false,
            message: 'gagal'
        });
    }

    client.sendMessage(number, message).then(response => {
        res.status(200).json({
            status: true,
            response: response
        })
    }).catch(err => {
        res.status(500).json({
            status: false,
            response: err
        })
    });
});

// Sen message
app.post('/send-media', (req, res) => {
    const number = phoneNumberFormatter(req.body.number);
    const caption = req.body.caption;
    const media = MessageMedia.fromFilePath('./cek.jpg');

    client.sendMessage(number, media, { caption: caption }).then(response => {
        res.status(200).json({
            status: true,
            response: response
        })
    }).catch(err => {
        res.status(500).json({
            status: false,
            response: err
        })
    });
});


server.listen(8000, function () {
    console.log('App running well on ' + 8000);
});