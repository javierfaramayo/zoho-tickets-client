const axios = require('axios')
const fs = require('fs')
require('dotenv').config()

const url = `https://accounts.zoho.com/oauth/v2/token?code=${process.env.AUTHORIZATION_CODE}&grant_type=authorization_code&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`

let tickets = []

const getTickets = (accessToken, from = 0, limit = 100) => {
  const authorization = `Zoho-oauthtoken ${accessToken}`
  const orgId = 698682121

  axios
    .get(`https://desk.zoho.com/api/v1/tickets?limit=${limit}&from=${from}`, {
      headers: { orgId: orgId, Authorization: authorization },
    })
    .then((res) => {
      if (res.data.data && res.data.data.length) {
        tickets = [...tickets, ...res.data.data]
        console.log(tickets.length)
        getTickets(accessToken, from + 100)
      } else {
        console.log('FINISHED')
        fs.writeFileSync('tickets.json', JSON.stringify(tickets))
        delete tickets
      }
    })
    .catch((err) => console.error(err))
}

// getTickets()
axios
  .post(url)
  .then((res) => {
    if (res.data.access_token) getTickets(res.data.access_token)
    else console.error('Not authorized', res.data)
  })
  .catch((err) => console.log(err))
