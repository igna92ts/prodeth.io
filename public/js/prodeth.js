const prodeth = {
    allMatches: [],
    matchsCounter: 0,
    matchsRender: (data) => {
        for(let i = 0; i < data.length; i++){
            //check already rendered
            if(prodeth.allMatches.some(m => m.date === data[i].date && data[i].team1.country.code === m.team1.country.code && data[i].team2.country.code === m.team2.country.code)){
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
                            <a class="ui black label timeleft" id='timeleft-${prodeth.matchsCounter}' data-inverted="" data-tooltip="Time left before bet closes." data-position="top center"></a>
                            <div class="ui primary button" id="match-details-${prodeth.matchsCounter}">
                                Bet now
                                <i class="right chevron icon"></i>
                            </div>
                        </div>
                    </div>
                `)   

                const countDownDate = new Date(data[i].date).getTime();

                const countdownFunction = (id, interval = null)=> {
                    const now = new Date().getTime();
                    const distance = countDownDate - now;
        
                    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
                    $(`#timeleft-${id}`).text(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        
                    if (distance < 0) {
                        if(interval) clearInterval(interval);
                        $(`#timeleft-${id}`).text("This bet is closed.");
                    }
                }
                const countdownIntervalFunction = id => {
                    let interval = setInterval(() => {
                        countdownFunction(id, interval)
                    }, 1000);
                }

                countdownFunction(prodeth.matchsCounter);
                countdownIntervalFunction(prodeth.matchsCounter);

                $(`#match-details-${prodeth.matchsCounter}`).click(()=>{
                    prodeth.matchDetails(data[i])
                });

                prodeth.matchsCounter++;
            }
        }

        $(".loading").remove();

        prodeth.allMatches = data;
    },
    matchDetails: (data) => {
        $(".modal#match-details").modal("show")
        $(".modal#match-details .content").html(`
        <div class="ui grid">
            <div class="row">
                <div class="seven wide column center aligned">
                    <div class="ui image small" data-tooltip="${data.team1.country.name}">
                        <img src="/images/flags/${data.team1.country.flag}.png">
                    </div>
                    <div class='country-code'>${data.team1.country.name}</div>
                    <a class="ui green label big payoff" data-inverted="" data-tooltip="This is the current payoff for betting on ${data.team1.country.name}." data-position="bottom center">x4.44 ETH</a>
                    <a class="ui black label big" id="bet-team1">Bet on this team</a>
                </div>
                <div class="two wide column versus vertical-center">
                    VS
                </div>
                <div class="seven wide column center aligned">
                    <div class="ui image small" data-tooltip="${data.team2.country.name}">
                        <img src="/images/flags/${data.team2.country.flag}.png">
                    </div>
                    <div class='country-code'>${data.team2.country.name}</div>
                    <a class="ui green label big payoff" data-inverted="" data-tooltip="This is the current payoff for betting on ${data.team2.country.name}." data-position="bottom center">x5.55 ETH</a>
                    <a class="ui black label big" id="bet-team2">Bet on this team</a>
                </div>
            </div>
            <div class="row">
                <div class="eight wide column center aligned">
                    <table class="ui collapsing celled small table">
                        <thead>
                            <tr>
                                <th colspan="2" style="text-align: center;">Last Transactions</th>
                            </tr>
                            <tr>
                                <th>From Address</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><a target="_blank" data-inverted="" data-tooltip="Transaction details" data-position="left center" href="https://etherscan.io/tx/0x68a19d11ad0211c3e9d361d901aaa96313965a8c5c63356d761ff9e9a0352420"><i class="icon external alternate"></i></a> 0x73667e5b76403b07732c62622dc5a3bca091808d</td>
                                <td class="collapsing">5.23 ETH</td>
                            </tr>
                            <tr>
                                <td><a target="_blank" data-inverted="" data-tooltip="Transaction details" data-position="left center" href="https://etherscan.io/tx/0x68a19d11ad0211c3e9d361d901aaa96313965a8c5c63356d761ff9e9a0352420"><i class="icon external alternate"></i></a> 0x73667e5b76403b07732c62622dc5a3bca091808d</td>
                                <td class="collapsing">1.52 ETH</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="eight wide column center aligned">
                    <table class="ui collapsing celled small table">
                        <thead>
                            <tr>
                                <th colspan="2" style="text-align: center;">Last Transactions</th>
                            </tr>
                            <tr>
                                <th>From Address</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><a target="_blank" data-inverted="" data-tooltip="Transaction details" data-position="left center" href="https://etherscan.io/tx/0x68a19d11ad0211c3e9d361d901aaa96313965a8c5c63356d761ff9e9a0352420"><i class="icon external alternate"></i></a> 0x73667e5b76403b07732c62622dc5a3bca091808d</td>
                                <td class="collapsing">5.23 ETH</td>
                            </tr>
                            <tr>
                                <td><a target="_blank" data-inverted="" data-tooltip="Transaction details" data-position="left center" href="https://etherscan.io/tx/0x68a19d11ad0211c3e9d361d901aaa96313965a8c5c63356d761ff9e9a0352420"><i class="icon external alternate"></i></a> 0x73667e5b76403b07732c62622dc5a3bca091808d</td>
                                <td class="collapsing">1.52 ETH</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>`)

        $("#bet-team1").unbind().click(()=>{
            prodeth.bet(data, data.team1.country.code);
        })
        $("#bet-team2").unbind().click(()=>{
            prodeth.bet(data, data.team2.country.code);
        })
    },
    bet: (data, bettingFor) => {
        
        const goal = (bettingFor === data.team1.country.code) ? data.team1 : data.team2;

        $(".modal#bet").modal("show");
        $(".modal#bet .content").html(`
            <div class="ui image centered small">
                <img src="/images/flags/${goal.country.flag}.png">
            </div>
            <h2>You are betting for ${goal.country.name}.</h2>
            ${(typeof web3 !== "undefined") ?
                `
                <h3>How much would you like to bet on this team?</h3>
                <div class="ui right big labeled input">
                    <input type="number" placeholder="Amount" id="amount" min=0.001>
                    <label for="amount" class="ui label">ETH</label>
                </div>
                `
                :
                `
                <div class="ui floating message">
                    It seems you don't have <a href="https://metamask.io/">MetaMask</a> on your browser, but don't worry!
                    <br>
                    You can still do the bet by sending your desired amount to this match team address:
                    <pre>${goal.address}</pre>
                    <button class="ui teal right labeled icon button copy-button" data-clipboard-text="${goal.address}">
                        <i class="copy icon"></i>
                        Copy
                    </button>
                    <div class="ui red inverted segment">
                        <b>IMPORTANT:</b> Do <b>NOT</b> send funds directly from exchanges to Prodeth's addresses. We cannot pay back to those wallets. <a href="/faq" target="_blank"><b>Read more</b></a>.
                    </div>
                </div>
                `
            }         
        `)
        
        if(typeof web3 !== "undefined"){
            $("#confirm-bet").unbind().click(()=>{
                web3.eth.sendTransaction({from: web3.eth.accounts[0], to: goal.address, gas:250000, value: web3.toWei($("#amount").val(),"ether") },function(){

                })
            })
        }
    }
}