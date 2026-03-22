const axios = require('axios');
const cheerio = require('cheerio');

(async () => {
  try {
    const res = await axios.get('https://www.commodityonline.com/mandiprices/mustard/haryana/babain', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Upgrade-Insecure-Requests': '1'
      }
    });
    const $ = cheerio.load(res.data);
    console.log('SUCCESS! Title:', $('title').text());
    const table = $('table tbody tr').first();
    console.log('ROW:', table.text().replace(/\s+/g, ' '));
  } catch(e) {
    console.log('FAIL:', e.response ? e.response.status : e.message);
  }
})();
