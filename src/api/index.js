import { version } from '../../package.json';
import { Router } from 'express';
import GetSchedule from '../service/getSchedule';

export default ({ config, db }) => {
	let api = Router();

	api.get('/', (req, res) => {
		res.json({ version });
	});

	api.get('/schedule', async (req, resp) => {

		let response1 = GetSchedule("Inbound", "Weekday");
		let response2 = GetSchedule("Outbound", "Weekday");
		let response3 = GetSchedule("Inbound", "Saturday");
		let response4 = GetSchedule("Outbound", "Saturday");
		let response5 = GetSchedule("Inbound", "Sunday");
		let response6 = GetSchedule("Outbound", "Sunday");
		let finalResponse = [
			await response1,
			await response2,
			await response3,
			await response4,
			await response5,
			await response6,
		];
		resp.send(finalResponse);
	});

	return api;
}
