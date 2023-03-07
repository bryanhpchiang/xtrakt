# xtrakt

Get structured data out of every web page.

BYOK (Bring Your Own Key) Demo: https://xtrakt.vercel.app/

# Development

Frontend:

```sh
yarn start # dev
vercel deploy --prod # deployment
```

The backend relies on [Modal](https://modal.com/), which makes it easy to run backends in the cloud.

Get started [here](https://modal.com/docs/guide).

```sh
python server.py # local dev to make sure the function works
modal deploy server.py # deploy to the cloud
```

Then go into `App.js` and replace the `fetch` call URL with your new URL.
