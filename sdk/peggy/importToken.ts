import { setupWallet, ethWallet } from '../../wallet';
import Web3 from 'web3';
import config from '../../config';
import { getToken, approveSpend, getWeb3 } from '../../lib/helper';
import { bridgeBank } from '../../lib/contracts';

const web3 = getWeb3();

// import
export const importToken = async (symbol: string, amount: string) => {
	const sifWallet = await setupWallet();
	const [sifAccount] = await sifWallet.getAccounts();
	const sifAddress = Web3.utils.utf8ToHex(sifAccount.address);
	const gas = (await web3.eth.getBlock('latest')).gasLimit; // 150000
	let tx;

	////////////////////////
	// ETH -> cETH
	////////////////////////
	if (symbol.toLowerCase() === 'eth') {
		// lock
		tx = {
			nonce: (await web3.eth.getTransactionCount(ethWallet.address)),
			to: config.bridgeBankAddress,
			// from: ethWallet.address,
			value: amount,
			gas,
			data: bridgeBank()
				.methods.lock(sifAddress, config.ethContractAddress, amount)
				.encodeABI(),
		};
	}

	////////////////////////
	// eRowan -> Rowan
	////////////////////////
	if (symbol.toLowerCase() === 'erowan') {
		// approve and burn
		await approveSpend(ethWallet.address, amount, gas);

		tx = {
			nonce: await web3.eth.getTransactionCount(ethWallet.address),
			to: config.bridgeBankAddress,
			value: 0,
			gas,
			data: bridgeBank()
				.methods.burn(sifAddress, config.bridgeTokenAddress, amount)
				.encodeABI(),
		};
	}

	////////////////////////
	// ERC20 -> cToken
	////////////////////////
	const token = getToken(`c${symbol}`);
	if (token && symbol !== 'eth') {
		// approve and lock
		await approveSpend(ethWallet.address, amount, gas);

		tx = {
			nonce: await web3.eth.getTransactionCount(ethWallet.address),
			to: config.bridgeBankAddress,
			value: amount,
			gas,
			data: bridgeBank()
				.methods.lock(sifAddress, token.address, amount)
				.encodeABI(),
		};
	}
	
	const signed = await web3.eth.accounts.signTransaction(
		tx,
		ethWallet.privateKey
	);
	return await web3.eth.sendSignedTransaction(signed.rawTransaction);
};
