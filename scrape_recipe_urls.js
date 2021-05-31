const puppeteer = require('puppeteer');
const fsLibrary = require('fs');
const profession = "leatherworking";

const options = {
    headless: false,
    defaultViewport: null,
    args: ['--window-size=1200,800'],
    executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
};

(async () => {


    try {

        // Launch Puppeteer
        console.log('Launching...');
        const browser = await puppeteer.launch(options);
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);

        console.log("Navigating to website.");
        // Go to Profession website
        await page.goto('https://tbc.wowhead.com/spells/professions/' + profession);


        // Wait for selector that holds the data we want to load.
        console.log("Waiting...");
        await page.waitForSelector('#lv-spells');
        console.log("Selector Loaded...");


        // Gather item data within an evaluate function.
        let tableHrefs = await page.evaluate(() => {

            // Gather all the html nodes that hold the href information.
            return Array.from(document.querySelectorAll('#lv-spells > div.listview-scroller-horizontal > div > table > tbody > tr > td:nth-child(2) > div > a'), a => a.href);
        });


        // Variable to check if next button is active.
        let buttonActive = await page.evaluate(() => {
            return (document.querySelector('#lv-spells > div.listview-band-top > div.listview-nav > a:nth-child(5)').outerHTML).includes("yes");
        });

        let urls = [];

        // Do while loop to keep pressing the next button as long as it is active.
        do {

            // Every iteration have to reinstantiate to get the updated value of the html.
            buttonActive = await page.evaluate(() => {
                return (document.querySelector('#lv-spells > div.listview-band-top > div.listview-nav > a:nth-child(5)').outerHTML).includes("yes");
            });
            tableHrefs = await page.evaluate(() => {

                // Gather all the html nodes that hold the href information.
                return Array.from(document.querySelectorAll('#lv-spells > div.listview-scroller-horizontal > div > table > tbody > tr > td:nth-child(2) > div > a'), a => a.href);
            });

            await urls.push(...tableHrefs);
            await page.click('#lv-spells > div.listview-band-top > div.listview-nav > a:nth-child(5)');

            // Wait for 2 seconds for all the data to load, just a safety precaution.
            // await page.waitForTimeout(2000);


        } while (buttonActive);






        // Write urls to a.
        fsLibrary.writeFile(profession + '_urls.txt',
            urls.map((value) => {
                return value + "\n";
            }),
            (error) => {

                if (error) throw err;
            })


        await browser.close();

    } catch (err) {
        console.log("Error: " + err);


    }

})();