const axios = require('axios');
const fs    = require('fs-extra');
const path  = require('path');

const BASE_URL   = 'https://api.ecfr.gov/api/versioner/v1';
const ADMIN_BASE_URL = 'https://api.ecfr.gov/api/admin/v1';
const SEARCH_BASE= 'https://api.ecfr.gov/api/search/v1';
const OUT_ROOT   = path.resolve(__dirname, '../client/public/ecfr-data');

/**
 * Ensure the folder ecfr-data/<sub> exists, then write JSON to <filename>.
 */
async function writeJson(subfolder, filename, data) {
    // subfolder to be nested
    const dir = path.join(OUT_ROOT, subfolder);

    await fs.ensureDir(dir);
    await fs.writeJson(path.join(dir, filename), data, { spaces: 2 });
}


/**
 * For each agency, download:
 *  - /agencies.json
 */
async function fetchTitles() {  
  try {  
      console.log('Downloading titles list…');  
      const { data } = await axios.get(`${BASE_URL}/titles.json`);  
      await writeJson('titles/', 'titles.json', data);  
      console.log('Saved titles/titles.json');  
  } catch (err) {  
      console.error('Failed to download titles:', err.message);  
  }  
}  

/**
 * Fetch the list of all titles from /titles.json
 */
async function fetchAllTitles() {
  const { data } = await axios.get(`${BASE_URL}/titles.json`);
  if (!Array.isArray(data.titles)) {
    throw new Error(`Unexpected /titles.json response shape: ${JSON.stringify(data)}`);
  }
  return data.titles;
}

/**
 * Fetch the ancestry tree for a given title & date.
 * @param {number|string} titleNumber
 * @param {string} date  – the up_to_date_as_of date
 */
async function fetchAncestry(titleNumber, date) {
    const url = `${BASE_URL}/ancestry/${date}/title-${titleNumber}.json`;
    const res = await axios.get(url);
    return res.data;
}

/**
 * For each agency, download:
 *  - /agencies.json
 */
async function fetchAgencies() {  
    try {  
        console.log('Downloading agencies list…');  
        const { data } = await axios.get(`${ADMIN_BASE_URL}/agencies.json`);  
        await writeJson('agencies/', 'agencies.json', data);  
        console.log('Saved agencies/agencies.json');  
    } catch (err) {  
        console.error('Failed to download agencies:', err.message);  
    }  
}  

/**
 * For each correction, download:
 *  - /corrections.json
 */
async function fetchCorrections() {  
    try {  
        console.log('Downloading corrections list…');  
        const { data } = await axios.get(`${ADMIN_BASE_URL}/corrections.json`);  
    
        // write the full payload to disk
        await writeJson('corrections', 'corrections.json', data);  
        console.log('Saved corrections/corrections.json');  
    
        // now grab the array off that payload and confirm its length:
        const correctionsArr = data.ecfr_corrections;  
        console.log(`There are ${correctionsArr.length} corrections in total.`);  
    
      } catch (err) {  
        console.error('Failed to download corrections:', err.message);  
      }  
}  


/**
 * Fetch and save corrections for a given CFR title.
 * @param {number|string} titleNumber — e.g. 21
 */
async function fetchCorrectionsByTitle(titleNumber) {
    try {
      console.log(`Downloading corrections for Title ${titleNumber}…`);
      const url = `${ADMIN_BASE_URL}/corrections/title/${encodeURIComponent(titleNumber)}.json`;
      const { data } = await axios.get(url);
  
      await writeJson(
        'corrections/titles',
        `corrections-title-${titleNumber}.json`,
        data
      );
  
      console.log(`Saved corrections/titles/corrections-title-${titleNumber}.json`);
      return data;
    } catch (err) {
      console.error(`Failed to download corrections for Title ${titleNumber}:`, err.message);
      throw err;
    }
}

/**
 * For each title, download:
 *  - /versions/title-{N}.json
 *  - /structure/{date}/title-{N}.json   (using up_to_date_as_of)
 *  - /ancestry/{date}/title-{N}.json
 */
async function downloadTitleVersionData() {
  const titles = await fetchAllTitles();
  console.log(`Found ${titles.length} titles.`);

  for (const t of titles) {
    const num  = t.number;
    const date = t.up_to_date_as_of;

    // 1. Download the title version tree
    try {
      console.log(`versions/title-${num}.json`);
      const vRes = await axios.get(`${BASE_URL}/versions/title-${num}.json`);
      await writeJson('versions', `title-${num}.json`, vRes.data);
      console.log(`Saved versions/title-${num}.json`);
    } catch (err) {
      console.error(`versions/title-${num}.json failed:`, err.message);
    }

    // 2. Structure snapshot
    if (date) {
      try {
        console.log(`structure/${date}/title-${num}.json`);
        const sRes = await axios.get(`${BASE_URL}/structure/${date}/title-${num}.json`);
        
        // sanitize date for filename
        const safeDate = date.replace(/[:\/]/g, '-');

        await writeJson('structure', `title-${num}-${safeDate}.json`, sRes.data);
        console.log(`Saved structure/title-${num}-${safeDate}.json`);
      } catch (err) {
        console.error(`structure/${date}/title-${num}.json failed:`, err.message);
      }
    } else {
      console.warn(`No up_to_date_as_of for title ${num}, skipping structure.`);
    }

    // 3. Ancestry data
    if (date) {
      try {
        console.log(`ancestry/${date}/title-${num}.json`);
        const aData = await fetchAncestry(num, date);

        const safeDate = date ? date.replace(/[:\/]/g, '-') : null;

        await writeJson('ancestry', `title-${num}-${safeDate}.json`, aData);
        console.log(`Saved ancestry/title-${num}-${safeDate}.json`);
      } catch (err) {
        console.error(`ancestry/title-${num} failed:`, err.message);
      }
    } else {
      console.warn(`No date for title ${num}, skipping ancestry.`);
    }
  }
}



/**
 * Top-level orchestrator—only calls functions that actually exist.
 */
async function downloadAll() {
    // !!This wipes everything under ecfr-data/ before starting!!
    await fs.emptyDir(OUT_ROOT);

    await fs.ensureDir(OUT_ROOT);
    // download title related data
    await fetchTitles();
    await downloadTitleVersionData();

    // download agency related data
    await fetchAgencies();

    // download eCFR corrections data
    await fetchCorrections(); 


  console.log('!!All done!!');
}

// Always catch those errors
downloadAll().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
