# Search for places, get your current location and much more in this map app

Tired of wasting your time? **VueMapApp** is a lightweight Vue.js map application that makes it easy to search for places and find your current location. Whether you’re exploring a new city, planning a trip, or just curious about nearby points of interest, **VueMapApp** has got you covered!

## Features

1. **Place Search:** Quickly search for any location by name, address, or category. **VueMapApp** uses real-world data to provide accurate results.
2. **Current Location:** Click the “Locate Me” button to instantly find your current position on the map. Great for when you’re on the move!
3. **Responsive Design:** **VueMapApp** works seamlessly on both desktop and mobile devices. No need to download a separate app — just open it in your browser!

## Usage

To run this app on your computer, do the following:

1. Clone this repo into any folder you want.
2. After you're done, navigate to the project folder.
3. Run

        npm install

   to install all dependencies.
4. Get your ArcGIS API key. You can find out how to do this [here](https://developers.arcgis.com/documentation/mapping-apis-and-services/security/tutorials/create-and-manage-an-api-key/#:~:text=An%20API%20key%20is%20a,service%2C%20notebook%2C%20or%20application.).
5. Create a `.env` file. Copy `.env.example` content and paste it into the `.env` file you've just created. In

        VITE_MAP_API_KEY=""

   replace the empty string with the ArcGIS API key you've got.
6. Navigate to the project folder and run

        npm run dev

7. In the browser, go to the address you'll see in the console once the aforementioned command has finished.
8. Test it out!

## Credits

I want to thank [Lucas Oliveira](https://codepen.io/lucasyem) for their [Material Design input field](https://codepen.io/lucasyem/pen/ZEEYKdj). I've also used one of the [gradient buttons](https://codepen.io/JavaScriptJunkie/pen/pPRooV) by [Muhammed Erdem](https://codepen.io/JavaScriptJunkie).