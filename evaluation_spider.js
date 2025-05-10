const { chromium } = require('playwright');

/**
 * Scrapes a given URL and loads the HTML content into Cheerio.
 * Includes basic error handling from the original script.
 *
 * @param {object} input - An object containing the input parameters.
 * @param {string} input.url - The URL to scrape.
 */
async function run(input) {
  
  if (!input || !input.url || (!input.productsCount && input.productsCount <= 0)) {
    console.error('Invalid input. Please provide a valid URL and products count.');
    return;
  }

  const url = input.url;
  const productsCount = input.productsCount;
  console.log(`Attempting to scrape: ${url}`);

  try {

    const browser = await chromium.launch({ headless: true, devtools: true });
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForLoadState('domcontentloaded'); // Esperar a que la página esté completamente cargada

    // Esperar a que se carguen los productos
    await page.waitForSelector('#gallery-layout-container .vtex-search-result-3-x-galleryItem');
    await page.waitForTimeout(2000); // Esperar 2 segundos para que se cargue la página

    // Inicializar la variable products
    let products = [];
    let productsCountCurrent = 0;


    while(true) {
      // Scroll para cargar más productos
      await page.evaluate(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        });
      });

      await page.waitForTimeout(2000); // Esperar 2 segundos para que los nuevos productos se carguen

      // Obtener los productos cargados en la página
      let productsLoaded = await page.evaluate(() => {
        const container = document.querySelector('#gallery-layout-container');
        const products = Array.from(container.querySelectorAll('.vtex-search-result-3-x-galleryItem')); //busco todos los productos y los convierto en array

        //recorro el array de productos y obtengo los datos que necesito
        return products.map(product => {
          const name = product.querySelector('section')?.getAttribute('aria-label') || 'Sin nombre';

          const priceInteger = product.querySelector('.vtex-product-price-1-x-currencyInteger')?.textContent || '';
          const priceFraction = product.querySelector('.vtex-product-price-1-x-currencyFraction')?.textContent || '';
          const price = priceInteger && priceFraction ? `R$ ${priceInteger},${priceFraction}` : 'Sin precio';

          const image = product.querySelector('img')?.src || 'Sin imagen';

          const url = product.querySelector('a')?.href || 'Sin URL';

          return {
            name,
            price,
            image,
            url,
            category: 'Bebidas Refrigerante' // Asignar la categoría deseada
          };
        });
      });

      // Si no se cargan más productos, salimos del ciclo
      if (productsLoaded.length === productsCountCurrent) {
        console.log('No hay más productos para cargar');
        break;
      }

      //Sobrescribir el array con los productos encontrados
      products = productsLoaded; // se sobreescribe el array cada vez
      productsCountCurrent = products.length;
      console.log(`Productos cargados hasta ahora: ${productsCountCurrent}`);
    
    }

    console.log('cantidad de productos encontrados:', products.length);
    
    if(products.length < productsCount) {
      console.log(`usted pidio ${productsCount} productos pero se encontraron ${products.length}, probablemente tenga que cargar otra pagina `);
    }
    
    console.log(products.slice(0,productsCount)); // mostrar la cantidad pedida de productos

    await browser.close();
  } catch (error) {
    console.error('Error during scraping:', error.message);
  }
}

// Example of how to call the run function with the specified URL
const scrapingInput = {
  url: 'https://www.angeloni.com.br/super/bebidas/refrigerante',
  productsCount: 20
};

// Execute the run function with the example input
run(scrapingInput);
