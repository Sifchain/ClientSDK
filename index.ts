import { delegate } from './sdk/validators/delegate';
import { undelegate } from './sdk/validators/undelegate';

const start = async () => {
	// const txnStatus = await delegate(
	// 	'53837',
	// 	'sifvaloper16svh7gvexg3p7f2a7l5f8cpj5m7rja4exdjhhq'
	// );
	// //const txnStatus = await delegate(53838, 'sifv')
	// console.log(txnStatus);

	const txnStatusUndelegate = await undelegate(
		'53837',
		'sifvaloper16svh7gvexg3p7f2a7l5f8cpj5m7rja4exdjhhq'
	);
	//const txnStatus = await delegate(53838, 'sifv')
	console.log(txnStatusUndelegate);
};

start();
