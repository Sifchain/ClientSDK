import { delegate } from './sdk/validators/delegate';
import { undelegate } from './sdk/validators/undelegate';
import { swap } from './sdk/pools/swap';

const start = async () => {
	// const txnStatus = await delegate(
	// 	'53837',
	// 	'sifvaloper16svh7gvexg3p7f2a7l5f8cpj5m7rja4exdjhhq'
	// );
	// //const txnStatus = await delegate(53838, 'sifv')
	// console.log(txnStatus);

	// const txnStatusUndelegate = await undelegate(
	// 	'53837',
	// 	'sifvaloper16svh7gvexg3p7f2a7l5f8cpj5m7rja4exdjhhq'
	// );
	// //const txnStatus = await delegate(53838, 'sifv')
	// console.log(txnStatusUndelegate);


	const txnStatusSwap = await swap(
		'rowan',
		'ceth',
		'1234',
		'1',
	);
	//const txnStatus = await delegate(53838, 'sifv')
	console.log(txnStatusSwap);
};

start();
