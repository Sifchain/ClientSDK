import { delegate } from './sdk/validators/delegate';

const start = async () => {
	const txnStatus = await delegate(
		'53837',
		'sifvaloper1d0q6q6afvzk3whu6cy338yth64vau78runp6u8'
	);
	//const txnStatus = await delegate(53838, 'sifv')
	console.log(txnStatus);
};

start();
