/**
 * A class representing a service that processes the data for match schedule
 * and generates leaderboard.
 *
 * NOTE: MAKE SURE TO IMPLEMENT ALL EXISITNG METHODS BELOW WITHOUT CHANGING THE INTERFACE OF THEM,
 *       AND PLEASE DO NOT RENAME, MOVE OR DELETE THIS FILE.
 *
 */

class LeagueService {

    #date
    #matches
    #options
    #teamPoints
    #miniLeaderboard
    #leaderboard
    #apiURL
    #apiSufix

    constructor() {
      this.#date = null
      this.#matches = null
      this.#options = {}
      this.#teamPoints = {}
      this.#miniLeaderboard = null
      this.#leaderboard = null
      this.#apiURL = process.env.VUE_APP_BASE_URL
      this.#apiSufix = process.env.VUE_APP_API_SUFIX
   }

    /**
     * Sets the match schedule.
     * Match schedule will be given in the following form:
     * [
     *      {
     *          matchDate: [TIMESTAMP],
     *          stadium: [STRING],
     *          homeTeam: [STRING],
     *          awayTeam: [STRING],
     *          matchPlayed: [BOOLEAN],
     *          homeTeamScore: [INTEGER],
     *          awayTeamScore: [INTEGER]
     *      },
     *      {
     *          matchDate: [TIMESTAMP],
     *          stadium: [STRING],
     *          homeTeam: [STRING],
     *          awayTeam: [STRING],
     *          matchPlayed: [BOOLEAN],
     *          homeTeamScore: [INTEGER],
     *          awayTeamScore: [INTEGER]
     *      }
     * ]
     *
     * @param {Array} matches List of matches.
     */
    setMatches(matches) {
      this.#matches = matches.map(val => {
        return {
          ...val,
           matchDate: this.formatMatchDate(val.matchDate),
           matchResult: val.matchPlayed ? `${val.homeTeamScore} : ${val.awayTeamScore}` : '-:-'
        }
      })
    }

    /**
     * Returns the full list of matches.
     *
     * @returns {Array} List of matches.
     */
    getMatches() {
      return (async () => {
        let res = await this.getAccessToken()

        if (res.success) {
          this.#options.headers = { 'Authorization': `Bearer ${res.access_token}` }

          res = await this.fetchData(`${this.#apiURL}${this.#apiSufix}getAllMatches`, this.#options)

          if (res.success) {
            this.setMatches(res.matches)
            return this.#matches
          }
        }

        return
      })()
    }

    /**
     * Returns the leaderboard in a form of a list of JSON objecs.
     *
     * [
     *      {
     *          teamName: [STRING]',
     *          matchesPlayed: [INTEGER],
     *          goalsFor: [INTEGER],
     *          goalsAgainst: [INTEGER],
     *          points: [INTEGER]
     *      },
     * ]
     *
     * @returns {Array} List of teams representing the leaderboard.
     */
    getLeaderboard() {
      return (async () => {
        await this.getMatches()

        // Calculate points
        this.#matches.forEach(match => this.addMatch(match))

        // Calculate leaderboard
        return this.calculateLeaderboard()
      })()
    }

    /**
     * Returns the leaderboard single object with scores in a form of JSON objecs.
     *
     *     Brazil {
     *      goalDifference: 4,
     *      goalsAgainst: 4,
     *      matchesPlayed: 3,
     *      points: 7,
     *      scoredGoals: 8,
     *      teamName: "Brazil"
     *    }
     *
     * @returns {Object} Object of team representing the leaderboard with scores.
     */
    addMatch(match) {
      const homeTeam = match.homeTeam,
            awayTeam = match.awayTeam,
            homeScore = match.homeTeamScore,
            awayScore = match.awayTeamScore

      let played = 0

      if (!this.#teamPoints[homeTeam]) this.#teamPoints[homeTeam] = { teamName: '', matchPlayed: 0, points: 0, goalDifference: 0, scoredGoals: 0, goalsAgainst: 0 }

      if (!this.#teamPoints[awayTeam]) this.#teamPoints[awayTeam] = { teamName: '', matchPlayed: 0, points: 0, goalDifference: 0, scoredGoals: 0, goalsAgainst: 0 }

      if (match.matchPlayed) {
        played++

        if (homeScore > awayScore) {
            this.#teamPoints[homeTeam].points += 3
        } else if (homeScore < awayScore) {
            this.#teamPoints[awayTeam].points += 3
        } else {
            // Draw
            this.#teamPoints[homeTeam].points += 1
            this.#teamPoints[awayTeam].points += 1
        }

        // Update goal difference and scored goals
        // Home team
        this.#teamPoints[homeTeam].teamName = homeTeam // Team
        this.#teamPoints[homeTeam].matchPlayed += played // MP (Match Played)
        this.#teamPoints[homeTeam].scoredGoals += homeScore // GF (Goals For)
        this.#teamPoints[homeTeam].goalsAgainst += awayScore // GA (Goals Against)
        this.#teamPoints[homeTeam].goalDifference += homeScore - awayScore // GD (Goal Difference)

        // Away team
        this.#teamPoints[awayTeam].teamName = awayTeam // Team
        this.#teamPoints[awayTeam].matchPlayed += played // MP (Match Played)
        this.#teamPoints[awayTeam].goalDifference += awayScore - homeScore // GD (Goal Difference)
        this.#teamPoints[awayTeam].scoredGoals += awayScore // GF (Goals For)
        this.#teamPoints[awayTeam].goalsAgainst += homeScore // GA (Goals Against)
      }
    }

    /**
     * Returns the leaderboard with scores in a form of a list of JSON objecs.
     *
     * [
     *     Brazil {
     *      goalDifference: 4,
     *      goalsAgainst: 4,
     *      matchesPlayed: 3,
     *      points: 7,
     *      scoredGoals: 8,
     *      teamName: "Brazil"
     *    }
     * ]
     *
     * @returns {Array} List of teams representing the leaderboard with scores.
     */
    calculateLeaderboard() {
      // Create a mini leaderboard for teams with the same points
      this.#miniLeaderboard = Object.entries(this.#teamPoints)
        .sort((a, b) => b[1].points - a[1].points)
        .reduce((acc, [team, stats]) => {
          acc[team] = stats
          return acc
        }, {})

      // Sort teams by points, goal difference, scored goals, and alphabetical order
      this.#leaderboard = Object.entries(this.#miniLeaderboard)
        .sort((a, b) => {
          // Sort by points
          if (b[1].points !== a[1].points) return b[1].points - a[1].points

          // Sort by goal difference
          if (b[1].goalDifference !== a[1].goalDifference) return b[1].goalDifference - a[1].goalDifference

          // Sort by scored goals
          if (b[1].scoredGoals !== a[1].scoredGoals) return b[1].scoredGoals - a[1].scoredGoals

          // Sort alphabetically
          return a[0].localeCompare(b[0])
        })
        .reduce((acc, [team, stats]) => {
          acc[team] = stats
          return acc
        }, {})

      return this.#leaderboard
    }

    /**
     * Returns the acces token in a form of JSON objecs.
     *
     * {
     *  “success”: true,
     *  “access_token”: “[TOKEN]”
     * }
     *
     * @returns {Object} object with access token string.
     */
    getAccessToken() {
      return this.fetchData(`${this.#apiURL}${this.#apiSufix}getAccessToken`)
    }

    /**
     * Returns the formated date/time.
     *
     * “D.M.YYYY hh:mm”
     *
     * @returns {String} “D.M.YYYY hh:mm”
     */
    formatMatchDate(timestamp) {
      this.#date = new Date(timestamp)

      return new Intl.DateTimeFormat('default', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
      }).format(this.#date).replaceAll('/', '.')
    }

    /**
     * Asynchronic function to fetch the data from the server.
     */
    async fetchData(apiURL, args = {}) {
      return await fetch(apiURL, args).then(res => res.json())
    }

    updateLiveSportData(originalArray, newArray) {
      newArray.forEach(newObj => {
        const index = originalArray.findIndex(obj => obj.event_key === newObj.event_key)

        // If the object with the same id is found, update it
        // If the object with the same id is not found, add it to the original array
        index !== -1 ? originalArray[index] = newObj : originalArray.push(newObj)
      });

      return originalArray
    }
}

export default LeagueService
