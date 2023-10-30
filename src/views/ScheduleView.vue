<template lang="html">
  <div class="schedule">
    <h1 class="schedule__title">League Schedule</h1>

    <table v-if="matches" class="table schedule__table">
      <colgroup>
        <col class="col__1" />
        <col class="col__2" />
        <col class="col__3" />
        <col class="col__4" />
        <col class="col__5" />
      </colgroup>

      <thead>
        <tr>
          <th class="th__datetime">Date/Time</th>
          <th class="th__stadion">Stadium</th>
          <th class="th__hometeam">Home Team</th>
          <th class="th__result"></th>
          <th class="th__awayteam">Away Team</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(match, index) in matches" :key="index">
          <td class="td__datetime"><time :datetime="match.matchDate">{{ match.matchDate }}</time></td>
          <td class="td__stadion">{{ match.stadium }}</td>
          <td>
            <div class="td__hometeam">
              {{ match.homeTeam }}
              <img :src="`https://flagsapi.codeaid.io/${match.homeTeam}.png`" :alt="match.homeTeam" />
            </div>
          </td>
          <td>
            <div class="td__result">{{ match.matchResult }}</div>
          </td>
          <td>
            <div class="td__awayteam">
              <img :src="`https://flagsapi.codeaid.io/${match.awayTeam}.png`" :alt="match.awayTeam" />
              {{ match.awayTeam }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <Spinner v-else />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LeagueService from '@/services/LeagueService.js'
import Spinner from '@/components/Spinner.vue'

const leagueService = new LeagueService()
const matches = ref(null)

// Get all matches
matches.value = await leagueService.getMatches()
</script>
