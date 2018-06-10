$(document).ready(()=>{
	if(typeof web3 !== "undefined"){

		if(ropstenProvider.trim() !== ''){
			web3.setProvider(new Web3.providers.HttpProvider(ropstenProvider));
		}

		//get balance from metamask
		let balance = 0;

		if(web3.eth.accounts.length > 0){
			web3.eth.getBalance(web3.eth.accounts[0],(e,r)=>{
				balance = web3.fromWei(r);
				$("#balance").html(`Current balance: <b>${balance} ETH</b>`);
			})
		} else {
			$("#balance").text(`It seems that you have MetaMask installed but you didn't selected an account.`);
		}
	} else {
		//metamask not installed
		$("#balance").html(`We recommend you to use <a style="font-weight: bold;" target="_blank" href="https://metamask.io/">MetaMask</a>`)
	}

	var clipboard = new ClipboardJS('.copy-button');

	clipboard.on('success', function(e) {
		$(e.trigger).attr("data-inverted","").attr("data-tooltip","Copied!").attr("data-position","right center");

		e.clearSelection();
	});
})

const showError = message => {
	$(".modal#error").modal("show");
	$(".modal#error .content").text(message);
}