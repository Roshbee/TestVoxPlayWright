const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const XLSX = require('xlsx');

// Folder containing PDF files
const folderPath = path.join(__dirname, 'pdfs');

// Links to ignore
const linkBlocklist = ['https://t.me/testingexperiencedopenings'];
// Emails to ignore
const emailBlocklist = ['info@jobcurator.in'];

let allResults = [];

function extractLinksAndEmails(text) {
    let links = text.match(/https?:\/\/[^\s]+/g) || [];
    let emails = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/g) || [];

    // Apply blocklist filters
    links = links.filter(link => !linkBlocklist.includes(link));
    emails = emails.filter(email => !emailBlocklist.includes(email));

    return { links, emails };
}

async function processPDF(filePath) {
    const buffer = fs.readFileSync(filePath);
    const data = await pdf(buffer);
    const { links, emails } = extractLinksAndEmails(data.text);

    const baseName = path.basename(filePath);
    links.forEach(link => {
        allResults.push({ File: baseName, Type: 'Link', Value: link });
    });

    emails.forEach(email => {
        allResults.push({ File: baseName, Type: 'Email', Value: email });
    });

    // Optional console logging
    console.log(`\n📄 ${baseName}:\n`);
    if (links.length) {
        console.log('🔗 Links:');
        links.forEach(link => console.log('  -', link));
    }
    if (emails.length) {
        console.log('✉️ Emails:');
        emails.forEach(email => console.log('  -', email));
    }
    if (!links.length && !emails.length) {
        console.log('⚠️ No links or emails found.');
    }
}

fs.readdir(folderPath, (err, files) => {
    if (err) {
        return console.error('Error reading directory:', err);
    }

    const pdfFiles = files.filter(file => file.endsWith('.pdf'));

    Promise.all(pdfFiles.map(file => {
        const filePath = path.join(folderPath, file);
        return processPDF(filePath);
    })).then(() => {
        // Write results to Excel
        const worksheet = XLSX.utils.json_to_sheet(allResults);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Extracted Data');

        const outputPath = path.join(__dirname, 'extracted_links_emails.xlsx');
        XLSX.writeFile(workbook, outputPath);

        console.log(`\n✅ Data written to ${outputPath}`);
    });
});
