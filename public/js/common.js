$(document).ready(()=>{
	if(typeof web3 !== "undefined"){
		//get balance from metamask
		let balance = 0;

		if(web3.eth.accounts.length > 0){
			web3.eth.getBalance(web3.eth.accounts[0],(e,r)=>{
				balance = web3.fromWei(r);
				$("#balance").html(`Current balance: <b>${balance} ETH</b>`);
			})
		}
	} else {
		//metamask not installed
		$("#balance").html(`We recommend you to use  <a href="https://metamask.io/">MetaMask</a>`)
	}
})