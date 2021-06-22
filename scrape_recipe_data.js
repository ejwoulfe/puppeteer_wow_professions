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

            // Gather the html nodes that hold the reagents data we need.
            let htmlNodes = Array.from(document.querySelectorAll('#icon-list-reagents > tbody > tr'));

            // Filter through the html nodes looking only for the ones which are currently being displayed.
            let reagentsList = htmlNodes.filter(html => !html.outerHTML.includes('style="display:none"'));

            // Create a new array to hold the html strings of the reagents.
            let reagentsHtml = reagentsList.map((value) => {
                return value.outerHTML;
            })

            return reagentsHtml;
        });

        
        console.log(reagents[0]);

        for(let i =0; i< reagents.length-1;i++){
            let startIndex = reagents[i].indexOf('quantity');
            let endIndex = reagents[i].indexOf('"><th');
            console.log(reagents[i].substring(startIndex +10, endIndex));

        }

        await browser.close();



    } catch (err) {
        console.log("Error: " + err);


    }finally{
        process.exit(1);
    }

})();