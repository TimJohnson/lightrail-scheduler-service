import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import fetch from 'node-fetch';

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	api.get('/schedule', (req, resp) => {
		console.log("making the request");
		fetch(`http://wirelesscats.ridetransit.org/BusSchedules/Search/Schedule?routeCode=6199&routeDirection=${req.query.direction}&bookingId=70&routeType=${req.query.routeDay}`)
			.then( res => res.json())
			.then( json => {
				resp.send(json);
			})
			.catch(err => console.log(err));
	});

	return api;
}
