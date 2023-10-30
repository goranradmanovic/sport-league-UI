<template lang="html">
  <div class="leaderboard">
    <h1 class="leaderboard__title">League Standings</h1>

    <table v-if="matches" class="table leaderboard__table">
      <colgroup>
        <col class="col__1" />
        <col class="col__2" />
        <col class="col__3" />
        <col class="col__4" />
        <col class="col__5" />
        <col class="col__6" />
      </colgroup>

      <thead>
        <tr>
          <th class="th__teamname">Team Name</th>
          <th class="th__matchplayed">MP</th>
          <th class="th__goalsfor">GF</th>
          <th class="th__goalsagainst">GA</th>
          <th class="th__goaldifference">GD</th>
          <th class="th__points">Points</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(match, index) in matches" :key="index">
          <td>
            <div class="td__teamname">
              <img :src="`https://flagsapi.codeaid.io/${match.teamName}.png`" :alt="match.teamName" />
              {{ match.teamName }}
            </div>
          </td>
          <td class="th__matchplayed">{{ match.matchPlayed }}</td>
          <td class="td__goalsfor">{{ match.scoredGoals }}</td>
          <td class="td__goalsagainst">{{ match.goalsAgainst }}</td>
          <td class="td__goaldifference">{{ match.goalDifference }}</td>
          <td class="td__points">{{ match.points }}</td>
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
matches.value = await leagueService.getLeaderboard()
</script>
