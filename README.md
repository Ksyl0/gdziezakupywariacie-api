# Gdzie Zakupy Wariacie API

Simple API that tells you whether stores are open on a given Sunday in Poland, helping you decide if you can shop at regular stores or need to visit frog shop.

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Ksyl0/gdziezakupywariacie-api.git
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.template`

4. Start the server:
```bash
node app.js
```

The server will run on port 3000 by default or the port specified in your `.env` file.

## API Endpoints

### GET /
Returns information about store availability for the current Sunday.

Example response:
```json
{
    "czy_handlowa": false,
    "odp": "Wariacie musisz lecieć do płaza",
    "next_handlowa": "2025-04-27"
}
```

### GET /status
Returns API status.

Example response:
```json
{
    "is_running": true
}
```

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.

## Author

Created by [Ksyl0](https://github.com/Ksyl0)
