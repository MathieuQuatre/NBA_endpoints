const axios = require('axios');

// Set your Back4App credentials
const back4AppAppId = 'ZOeEUiWH0Hxdw2dG1pGdOXjZwAY9XjT7KfXIPlkB';
const back4AppRestApiKey = '11cWKlRiKQzB5X2J0lzWbSnfkCQkuR5T3bvppmkf';

// Base URL for Back4App API
const back4AppBaseUrl = 'https://parseapi.back4app.com';

exports.handler = async function(event, context) {
  try {
    // Fetch data from Back4App Players class
    const playersResponse = await axios.get(`${back4AppBaseUrl}/classes/Players`, {
      headers: {
        'X-Parse-Application-Id': back4AppAppId,
        'X-Parse-REST-API-Key': back4AppRestApiKey,
      },
    });
    const players = playersResponse.data.results;

    // Fetch data from Back4App Teams class
    const teamsResponse = await axios.get(`${back4AppBaseUrl}/classes/Teams`, {
      headers: {
        'X-Parse-Application-Id': back4AppAppId,
        'X-Parse-REST-API-Key': back4AppRestApiKey,
      },
    });
    const teams = teamsResponse.data.results;

    // Fetch data from Back4App PlayerStatistics class
    const playerStatsResponse = await axios.get(`${back4AppBaseUrl}/classes/PlayerStatistics`, {
      headers: {
        'X-Parse-Application-Id': back4AppAppId,
        'X-Parse-REST-API-Key': back4AppRestApiKey,
      },
    });
    const playerStatistics = playerStatsResponse.data.results;

    // Combine data from different classes
    const results = playerStatistics.map(stat => {
      const player = players.find(p => p.objectId === stat.playerId);
      const team = teams.find(t => t.objectId === stat.teamId);

      return {
        CLASSEMENT: stat.classement,
        JOUEUR: player ? player.playerName : '',
        EQUIPE: team ? team.teamName : '',
        M: stat.matchesPlayed,
        MJ: stat.minutesPlayed,
        PPM: stat.pointsPerMinute,
        RPM: stat.reboundsPerMinute,
        PDPM: stat.pointsDifferencePerMinute,
        MPM: stat.minutesPerMatch,
        EFF: stat.efficiency,
        FG: stat.fieldGoalPercentage,
        LF: stat.catchAndShootPercentage,
      };
    });

    return {
      statusCode: 200,
      body: JSON.stringify(results),
    };
  } catch (error) {
    console.error('Error fetching data from Back4App:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
