<template lang="html">
	<div class="home">
		<h1 class="home__title">Live Matches</h1>

		<div v-if="matches" class="home__table--wrapper">
			<table class="table home__table">
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
						<th class="th__datetime">Date/Time</th>
						<th class="th__country">Country</th>
						<th class="th__stadion">Stadium</th>
						<th class="th__hometeam">Home Team</th>
						<th class="th__result"></th>
						<th class="th__awayteam">Away Team</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(match, index) in matches" :key="index">
						<td class="td__datetime">
							<time :datetime="`${match.event_date} ${match.event_time}`">{{ match.event_date}}, {{match.event_time}}</time>
						</td>
						<td class="td__country">
							<div>
								<img :src="match.country_logo || notFound" alt="County logo" />
								{{ match.country_name }}
							</div>
						</td>
						<td class="td__stadion">
							<div>
								<span>{{ match.event_stadium }}</span>
								<span class="league__name">
									<img :src="match.league_logo || notFound" alt="League logo" />
									{{ match.league_name }}
								</span>
							</div>
						</td>
						<td>
							<div class="td__hometeam">
								{{ match.event_home_team }}
								<img :src="match.home_team_logo || notFound" alt="HomeTeam logo" />
							</div>
						</td>
						<td>
							<div class="td__result">{{ match.event_final_result }}</div>
						</td>
						<td>
							<div class="td__awayteam">
								<img :src="match.away_team_logo || notFound" alt="AwayTeam logo" />
								{{ match.event_away_team }}
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<Spinner v-else />
	</div>
</template>

<script setup>
	import { ref } from 'vue' 
	import LeagueService from '@/services/LeagueService.js'
	import Spinner from '@/components/Spinner.vue'

	const leagueService = new LeagueService(),
		matches = ref(null),
	    websocketAPIkey = process.env.VUE_APP_WEBSOCKET_API_KEY,
      	websocketURL = process.env.VUE_APP_WEBSOCKET,
      	socket = new WebSocket(`${websocketURL}live_events?widgetKey=${websocketAPIkey}`),
      	notFound = require('@/assets/images/icons/notfound.svg')

	// Get all matches
    /* function to fetch live websocket data */
    const fetchWebsocketData = () => {
		socket.onopen = event => console.log("WebSocket connection opened: ", event)

		socket.onmessage = e => {
			if (e.data) {
				let matchesData = JSON.parse(e.data);
				// Now variable matchesData contains all matches that received an update
				// Here can update matches in dom from variable matchesData

				matches.value = matches.value === null ? matchesData : leagueService.updateLiveSportData(matches.value, matchesData)
			}
		}

		socket.onerror = error => console.log("WebSocket error: ", error)
    }

    fetchWebsocketData()
</script>