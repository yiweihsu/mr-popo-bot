const axios = require('axios');
const translate = require('translate');

const isoCountryCodeMapper = require('../iso-country-code.json');

const getCovid19DataByCountry = async (country) => {
  try {
    const translatedText = await translate(country, {
      from: 'zh',
      to: 'en',
      engine: 'yandex',
      key:
        'trnsl.1.1.20200411T153632Z.a582d2f96a2833f4.9424df4283896fa12b2ae4ba0e8bc3135d94fd30',
    });
    const sanitizedInpute = translatedText.toLowerCase();
    const mappedCountry = isoCountryCodeMapper.filter((country) => {
      if (
        country.name.toLowerCase() === sanitizedInpute ||
        country['alpha-3'] === sanitizedInpute.toUpperCase()
      ) {
        return country['alpha-3'];
      }
    });

    if (mappedCountry.length > 0) {
      const { 'alpha-3': countryCode, name } = mappedCountry[0];
      const COVID_API_BASE_URL = 'https://covidapi.info/api/v1/country';
      const covidData = await axios.get(`${COVID_API_BASE_URL}/${countryCode}`);

      return {
        country: name,
        covidData,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      failed: true,
    };
  }
};

const getRandomVideo = async () => {
  try {
    const AVGLE_GET_VIDEO_API_URL = 'https://api.avgle.com/v1/video';
    const videoNum = getRandomIntNum(2, 90189);
    return axios.get(`${AVGLE_GET_VIDEO_API_URL}/${videoNum}`);
  } catch (error) {
    console.error(error);
  }
};

const getRandomIntNum = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min)) + min;
};

module.exports = {
  getCovid19DataByCountry,
  getRandomVideo,
  getRandomIntNum,
};
