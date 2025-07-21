const https = require('https');
const fs = require('fs');
const path = require('path');

// Bella Vista dishes with their image filenames
const dishes = [
  { name: "Chianti Classico", filename: "chianti-wine.jpg", keywords: "red wine glass" },
  { name: "Italian Soda", filename: "italian-soda.jpg", keywords: "sparkling water soda" },
  { name: "Espresso", filename: "espresso.jpg", keywords: "espresso coffee cup" },
  { name: "Bruschetta al Pomodoro", filename: "bruschetta.jpg", keywords: "bruschetta tomato bread" },
  { name: "Antipasto Classico", filename: "antipasto.jpg", keywords: "antipasto platter charcuterie" },
  { name: "Caprese Salad", filename: "caprese.jpg", keywords: "caprese mozzarella tomato" },
  { name: "Spaghetti Carbonara", filename: "carbonara.jpg", keywords: "spaghetti carbonara pasta" },
  { name: "Margherita Pizza", filename: "margherita-pizza.jpg", keywords: "margherita pizza" },
  { name: "Osso Buco", filename: "osso-buco.jpg", keywords: "osso buco veal" },
  { name: "Seafood Risotto", filename: "seafood-risotto.jpg", keywords: "seafood risotto" },
  { name: "Tiramisu", filename: "tiramisu.jpg", keywords: "tiramisu dessert" },
  { name: "Gelato Trio", filename: "gelato-trio.jpg", keywords: "gelato ice cream" },
  { name: "Cannoli Siciliani", filename: "cannoli.jpg", keywords: "cannoli sicilian pastry" }
];

// Alternative free food APIs and image sources
const imageApis = [
  {
    name: "Foodish API",
    getUrl: () => "https://foodish-api.com/api/"
  },
  {
    name: "Lorem Picsum Food",
    getUrl: () => "https://picsum.photos/400/300/?random"
  }
];

// Create directory if it doesn't exist
const outputDir = path.join(__dirname, '../public/images/dishes');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Function to download image from URL
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path.join(outputDir, filename));
    
    const request = https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✓ Downloaded: ${filename}`);
          resolve();
        });
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirects
        downloadImage(response.headers.location, filename)
          .then(resolve)
          .catch(reject);
      } else {
        reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
      }
    });

    request.on('error', (err) => {
      reject(err);
    });
  });
}

// Function to get random food image from Foodish API
function getFoodishImage() {
  return new Promise((resolve, reject) => {
    const req = https.get('https://foodish-api.com/api/', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.image);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
  });
}

// Function to download all images
async function downloadAllImages() {
  console.log('Starting download of Bella Vista dish images...\n');
  
  for (let i = 0; i < dishes.length; i++) {
    const dish = dishes[i];
    console.log(`Downloading image for: ${dish.name}`);
    
    try {
      // Try to get a random food image from Foodish API
      const imageUrl = await getFoodishImage();
      await downloadImage(imageUrl, dish.filename);
      
      // Add a small delay to be respectful to the API
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Failed to download ${dish.name}: ${error.message}`);
      
      // Fallback to a placeholder or Lorem Picsum
      try {
        const fallbackUrl = `https://picsum.photos/400/300/?random=${i}`;
        await downloadImage(fallbackUrl, dish.filename);
      } catch (fallbackError) {
        console.error(`Fallback also failed for ${dish.name}: ${fallbackError.message}`);
      }
    }
  }
  
  console.log('\n🎉 Finished downloading all images!');
  console.log(`Images saved to: ${outputDir}`);
}

// Run the download
downloadAllImages().catch(console.error);
