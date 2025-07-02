const data = [
    {"name": "AMOXICILLIN DRY SYRUP 125MG/SML", "unit": "BOTTLE", "brand": "default"},
    {"name": "AZITHROMYCIN 500 MG TABLETS", "unit": "PACK", "brand": "default"},
    {"name": "AMOXICILLIN CAPSULES 500 MG", "unit": "PACK", "brand": "default"},
    {"name": "IBUPROFEN 400 MG TABLETS", "unit": "PACK", "brand": "default"},
    {"name": "DOXYCYCLINE CAPSULES 100MG", "unit": "PACK", "brand": "default"},
    {"name": "OMEPRAZOLE CAPSULES 20 MG", "unit": "PACK", "brand": "default"},
    {"name": "CLOXACILLIN DRY SYRUP 125 MG/ML", "unit": "BOTTLE", "brand": "default"},
    {"name": "Albendazole 100 mg /Sm", "unit": "Botde", "brand": "default"},
    {"name": "Albendazole BP 400 mg", "unit": "Packs", "brand": "default"},
    {"name": "Chloramphenicol USP 125mg /Sml", "unit": "Botde", "brand": "default"}
];

const mainApi = "https://159.69.214.45/api/v1/products";

// Import axios
const axios = require('axios');
const https = require('https');

// Bearer token
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWFseTlpd28wMHd3ajh6ZDRtYTBkZmprIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzQ5NTU3NDYzLCJleHAiOjE3NDk0NjAxMTMwMDd9.YdZL0PR_ESyIgjn3BEqqLL4KWw7zQhKNltXWnXz4r3E";

// Create axios instance with custom config
const api = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    }),
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
});

async function postProducts() {
    try {
        const response = await api.post(mainApi, data);
        console.log(`Successfully added product: ${response.message}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
        console.error(`Error adding product `, err.message, err.response ? `: ${JSON.stringify(err.response.data)}` : '');
    }
}

postProducts().catch(err => {
    console.error('Fatal error:', err);
});
