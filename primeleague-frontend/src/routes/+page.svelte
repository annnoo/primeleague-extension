<script>
	const i = [100, 200, 300];

	const tableArr = [
		{
			position: '1',
			name: 'NNO Prime',
			img: 'https://cdn0.gamesports.net/edb_team_logos_light/29000/29951.png',
			symbol: '12 - 0',
			weight: 100
		}
	];
</script>


{#each i as num}
	{num}
{/each}

<div class="table-container">
	<table class="table table-hover">
		<thead>
			<tr>
				<th>#</th>
				<th>Team</th>
				<th>W-L</th>
			</tr>
		</thead>
		<tbody>
			{#each tableArr as row, i}
				<tr>
					<td>{row.position}.</td>
					<td>
							<a
								class="flex items-center p-0 m-0 w-full h-full font-sans text-xs font-normal leading-5 text-white border-0 border-collapse cursor-pointer"
								href="https://www.primeleague.gg/teams/21801-unicorns-of-love-sexy-edition"
								style="outline: 0px; text-decoration: none; transition: color 100ms ease-in-out 0s;"
							>
								<img
									data-src="https://cdn0.gamesports.net/edb_team_logos/21000/21801_thumb.png?1582027029"
									alt="Unicorns of Love Sexy Edition"
									src="https://cdn0.gamesports.net/edb_team_logos/21000/21801_thumb.png?1582027029"
									data-loaded="true"
									class="object-contain absolute p-0 m-0 w-auto max-w-full h-auto max-h-full leading-5 text-center text-cyan-400 whitespace-nowrap border-0 border-collapse cursor-pointer"
									style="outline: 0px; transition: filter 150ms ease-in-out 0s;"
								/>

								<span
									class="p-0 my-0 mr-0 ml-2 leading-5 text-cyan-400 border-0 border-collapse cursor-pointer truncate"
									style="outline: 0px;">Unicorns of Love Sexy Edition</span
								>
							</a>
					</td>
					<td>{row.symbol}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
