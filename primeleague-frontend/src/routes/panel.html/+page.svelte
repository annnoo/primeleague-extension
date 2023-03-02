<script>
	import { onMount } from "svelte";


	const i = [100, 200, 300];


	let tableArr = [
		{
			position: '1',
			name: 'NNO Prime',
			img: 'https://cdn0.gamesports.net/edb_team_logos_light/29000/29951.png',
			symbol: '12 - 0',
		},
	{
			position: '1',
			name: 'NNO Prime',
			img: 'https://cdn0.gamesports.net/edb_team_logos_light/29000/29951.png',
			symbol: '12 - 0',
		},
	{
			position: '1',
			name: 'NNO Prime',
			img: 'https://cdn0.gamesports.net/edb_team_logos_light/29000/29951.png',
			symbol: '12 - 0',
		},
	{
			position: '1',
			name: 'NNO Prime',
			img: 'https://cdn0.gamesports.net/edb_team_logos_light/29000/29951.png',
			symbol: '12 - 0',
		}
	,
	{
			position: '1',
			name: 'NNO Prime',
			img: 'https://cdn0.gamesports.net/edb_team_logos_light/29000/29951.png',
			symbol: '12 - 0',
		}
,
	{
			position: '1',
			name: 'NNO Prime',
			img: 'https://cdn0.gamesports.net/edb_team_logos_light/29000/29951.png',
			symbol: '12 - 0',
		}
,
	{
			position: '1',
			name: 'NNO Prime',
			img: 'https://cdn0.gamesports.net/edb_team_logos_light/29000/29951.png',
			symbol: '12 - 0',
		}
,
	{
			position: '1',
			name: 'NNO Prime',
			img: 'https://cdn0.gamesports.net/edb_team_logos_light/29000/29951.png',
			symbol: '12 - 0',
		}

	];

  
  onMount(() => {
    async function fetchData(){
      const data = await fetch("http://localhost:3000").then(i => i.json());
      if(data){
        tableArr = data.standings;
      }

      console.log(data);
    }
    fetchData();
    const interval = setInterval(fetchData, 300000);

    return () => clearInterval(interval);
  });
</script>

<div class="h-[100px] w-screen  bg-gray-900">
	<div class="w-full bg-gray-900  border-gray-800 ">
		<table class=" w-full text-xs text-left text-gray-500 dark:text-gray-400 ">
			<thead class="top-0 sticky bg-black h-full text-sm text-gray-200 uppercase  border-b border-gray-700">
				<tr class="">
					<th class="p-3">#</th>
					<th>Team</th>
					<th>W - L</th>
				</tr>
			</thead>
			<tbody class="bg-neutral-800 text-white overflow-y-scroll">
				{#each tableArr as row}
					<tr class="m-2 border-b border-gray-700 ">
						<td class="m-2 p-2">{row.place}</td>
						<td>
							<a
								class="flex flex-row align-top text-center items-center w-full h-full font-sans text-xs font-normal  text-white cursor-pointer hover:text-cyan-300"
								href="https://www.primeleague.gg/teams/21801-unicorns-of-love-sexy-edition"
                target="_blank"
								style="outline: 0px; text-decoration: none; transition: color 100ms ease-in-out 0s;"
							>
								<img
									alt="{row.teamName}"
									src="{row.teamImgSrc}"
									data-loaded="true"
									class="max-h-6 w-auto max-w-[1.5rem]"
									style="outline: 0px; transition: filter 150ms ease-in-out 0s;"
								/>

								<span class="text-center ml-2 align-middle " style=""
									>{row.teamName}</span
								>
							</a>
						</td>
						<td>{row.stats}</td>
					</tr>
				{/each}
			</tbody>
        <tfoot class="sticky bottom-0"> 
        <tr  class="bg-black">
          <td colspan="3" class="text-center p-0 w-full">

            <div class="text-center flex flex-row items-center justify-center">
              <a href="https://www.primeleague.gg/" target="_blank"> 
                <img class="w-20 text-center" src="https://cdn1-v3.gamesports.net/img/themes/primeleague/logo_prm_strauss.svg?1"/>

              </a>
                
            </div>
          </td>
        </tr>
      </tfoot>
		</table>
	</div>
</div>
