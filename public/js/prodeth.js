const prodeth = {
    allMatches: [],
    matchsRender: (data) => {
        for(let i = 0; i < data.length; i++){
            //check already rendered
            //THIS DOESNT WORK 
            if(prodeth.allMatches.indexOf(data[i]) > -1){
                continue;
            }



            if(data[i].payed){
                //finished
            } else if(new Date() >= new Date(data[i].date)){
                //closed
            } else {
                //open
                
                //calculate payoff
                const balanceTeam1 = data[i].team1.balance;
                const balanceTeam2 = data[i].team2.balance;
                let payoffTeam1 = 1.00;
                let payoffTeam2 = 1.00;

                if(balanceTeam1 !== 0 && balanceTeam2 !== 0){
                    payoffTeam1 = (balanceTeam2 / balanceTeam1 < 1) ? balanceTeam2 / balanceTeam1 + 1 : balanceTeam2 / balanceTeam1
                    payoffTeam2 = (balanceTeam1 / balanceTeam2 < 1) ? balanceTeam1 / balanceTeam2 + 1 : balanceTeam1 / balanceTeam2
                }

                $(".open-bets").append(`
                    <div class="row">
                        <div class="four wide column center aligned">
                            <div class="ui tiny image" data-tooltip="${data[i].team1.country.name}">
                                <img src="/images/flags/${data[i].team1.country.flag}.png">
                            </div>
                            <div class='country-code'>${data[i].team1.country.code}</div>
                            <a class="ui green label payoff" data-inverted="" data-tooltip="This is the current payoff for betting on ${data[i].team1.country.name}." data-position="bottom center">x${parseFloat(payoffTeam1).toFixed(2)} ETH</a>
                        </div>
                        <div class="two wide column versus vertical-center">
                            VS
                        </div>
                        <div class="four wide column center aligned">
                            <div class="ui tiny image" data-tooltip="${data[i].team2.country.name}">
                                <img src="/images/flags/${data[i].team2.country.flag}.png">
                            </div>
                            <div class='country-code'>${data[i].team2.country.code}</div>
                            <a class="ui green label payoff" data-inverted="" data-tooltip="This is the current payoff for betting on ${data[i].team2.country.name}." data-position="bottom center">x${parseFloat(payoffTeam2).toFixed(2)} ETH</a>
                        </div>
                        <div class="six wide column center aligned vertical-center">
                            <div class="ui primary button" onclick="prodeth.matchDetails('${data[i].date}','${data[i].team1.country.code}','${data[i].team2.country.code}')">
                                Bet now
                                <i class="right chevron icon"></i>
                            </div>
                        </div>
                    </div>
                `)   
            }
        }

        $(".loading").remove();

        prodeth.allMatches = data;
    },
    matchDetails: (date, team1, team2) => {
        $("#match-details").modal("show")
    }
}