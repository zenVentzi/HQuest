# HQuest

a minimalistic social network for all shades of non-pc, uncensored humor. Professional innovation one dick at a time. One button create/delete account.

## Getting Started

1. `git clone https://github.com/zenVentzi/HQuest.git`
2. Run `npm install` in project root folder
3. Create .env file based on .env.example file(located in project root)
4. Run `npm run build`
5. Run `npm run start`
6. Visit `localhost:4000` or `localhost:4000/graphql` for graphql playground

The first user to login/register has the ADMIN role. Go to `localhost:4000/admin` to add the questions for the app.

### Prerequisites

- `Node.js 10.x` Lower v. may work as well
- Free Cloudinary account
- MongoDB locally installed **OR** mLab free tier account. Note that if you want to run integration tests, MongoDB local installation is still required.

## Running the tests

```
npm run test // runs both unit and integration tests
npm run test:unit // runs only unit tests
npm run test:integration //runs only integration tests
```

Results are generated in `root/server/coverage`.

## Tech used:

- Typescript
- React
- Node
- Graphql(Apollo)
- Jest

## Authors

- **Ventsislav Marinov(Zen Ventzi)**

## Acknowledgments

- My grandmother who helped and supported me unquiestionably while my health kept deteriorating
- Jocko Willink for being the masculine role model to many of us
- My stupid cat, that just doesn't give a damn
