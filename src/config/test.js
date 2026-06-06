const axios = require("axios");

const SCHEME_CODE = 125497;

function parseDate(dateStr) {
    const [day, month, year] = dateStr.split("-");

    return new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
    );
}

async function main() {
    try {
        const response = await axios.get(
            `https://api.mfapi.in/mf/${SCHEME_CODE}`
        );

        const navData = response.data.data;

        console.log(
            "Total records:",
            navData.length
        );

        const threeYearsAgo = new Date();

        threeYearsAgo.setFullYear(
            threeYearsAgo.getFullYear() - 3
        );

        console.log(
            "Three years ago:",
            threeYearsAgo.toDateString()
        );

        console.log(
            "Latest API record:",
            navData[0]
        );

        console.log(
            "Oldest API record:",
            navData[navData.length - 1]
        );

        const filteredData = navData.filter(
            (record) =>
                parseDate(record.date) >=
                threeYearsAgo
        );

        console.log(
            "Records in last 3 years:",
            filteredData.length
        );
    } catch (err) {
        console.error(
            "Error:",
            err.message
        );
    }
}

main();