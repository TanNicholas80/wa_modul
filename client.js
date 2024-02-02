const { Client, RemoteAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://nicholas:Tannicholas876@whatsappcluster.rt5xbqr.mongodb.net/whatsapp_otp";

const initializeClient = async () => {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB Connected");
    const store = new MongoStore({ mongoose: mongoose });

    const client = new Client({
        authStrategy: new RemoteAuth({
            clientId: 'whatsapp_user_remote',
            dataPath: './.wwebjs_auth',
            store: store,
            backupSyncIntervalMs: 300000,
        }),
        puppeteer: { 
            headless: true
        },
    });

    client.initialize();

    client.on('remote_session_saved', () => {
        console.log('remote_session_saved');
    });
    
    client.on('loading_screen', (percent, message) => {
        console.log('LOADING SCREEN', percent, message);
    });
    
    client.on('qr', (qr) => {
        // NOTE: This event will not be fired if a session is specified.
        console.log('QR RECEIVED', qr);
        qrcode.generate(qr, { small: true });
    });
    
    client.on('authenticated', () => {
        console.log('AUTHENTICATED');
    });
    
    client.on('auth_failure', msg => {
        // Fired if session restore was unsuccessful
        console.error('AUTHENTICATION FAILURE', msg);
    });
    
    client.on('ready', () => {
        console.log('READY');
    });

    return client;
};

module.exports = { mongoose, initializeClient };