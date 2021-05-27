const puppeteer = require('puppeteer');

const options = {
    headless: false,
    defaultViewport: null,
    args: ['--window-size=1200,800'],
    executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
};



(async () => {

    function gatherTableURLs(hrefArray) {

        // Gather all the html nodes that hold the href information.
        let tableRows = document.querySelectorAll('#lv-spells > div.listview-scroller-horizontal > div > table > tbody > tr > td:nth-child(2) > div > a');
        // Iterate through the NodeList and grab the href values from them.
        for (let i = 0; i < tableRows.length; i++) {
            hrefArray.push(tableRows[i].href);
        };
    }

    try {

        // Launch Puppeteer
        console.log('Launching...');
        const browser = await puppeteer.launch(options);
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);

        console.log("Navigating to website.");
        // Go to Profession website
        await page.goto('https://tbc.wowhead.com/spells/professions/alchemy');


        // Wait for selector that holds the data we want to load.
        console.log("Waiting...");
        await page.waitForSelector('#lv-spells');
        console.log("Selector Loaded...");


        // Gather item data within an evaluate function.
        let hrefs = await page.evaluate(() => {

            // Gather all the html nodes that hold the href information.
            return Array.from(document.querySelectorAll('#lv-spells > div.listview-scroller-horizontal > div > table > tbody > tr > td:nth-child(2) > div > a'), a => a.href);


        });

        console.log(hrefs);






        await browser.close();

    } catch (err) {
        console.log("Error: " + err);


    }

})();