const puppeteer = require('puppeteer');
const fsLibrary = require('fs');

//Read from file, seperate by a new line.
let textFile = fsLibrary.readFileSync("./recipe_urls/alchemy_urls.txt", 'utf-8');
let recipeUrls = textFile.split('\n');


const options = {
    headless: false,
    defaultViewport: null,
    args: ['--window-size=1200,800'],
    executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
};

(async () => {


    try {

        const browser = await puppeteer.launch(options);


        // Loop through all the recipe urls, opening and closing a new page for each.
        // for (let i = 0; i < recipeUrls.length; i++) {

        //     const page = await browser.newPage();
        //     await page.setDefaultNavigationTimeout(0);
        //     await page.goto(recipeUrls[i]);



        //     await page.close();

        // }

        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto('https://tbc.wowhead.com/spell=26754/spellfire-robe');

        // Variable to hold the number of possible reagents we need to loop through.
        let listLength = await page.evaluate(() => {
            return document.querySelectorAll('#icon-list-reagents > tbody > tr').length;
        });


        let reagents = await page.evaluate(() => {
            let htmlNodes = Array.from(document.querySelectorAll('#icon-list-reagents > tbody > tr'));

            let reagentsList = htmlNodes.filter(html => !html.outerHTML.includes('style="display:none"'));

            let reagentsHtml = reagentsList.map((value) => {
                return value.outerHTML;
            })

            return reagentsHtml;
        });

        console.log(reagents);
        // .outerHTML.includes('style="display:none"')




        await page.close();



    } catch (err) {
        console.log("Error: " + err);


    }

})();