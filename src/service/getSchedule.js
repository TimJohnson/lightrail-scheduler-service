import fetch from 'node-fetch';
import moment from 'moment';

export default (direction, routeDay) => {
    let response = fetch(`http://wirelesscats.ridetransit.org/BusSchedules/Search/Schedule?routeCode=6338&routeDirection=${direction}&bookingId=75&routeType=${routeDay}`)
        .then( res => res.json())
        .then( json => {
            let formattedResponse = {};
            json.stationStops.map((stationStops, i) => {

                const formattedStops = stationStops.map((stop,i) => {
                    let formattedStop = moment(stop, 'hh:mm A').format('HH:mm');
                    return formattedStop;					
                });

                let midnight = moment('00:00', 'HH:mm');
                let firstTrains = moment('04:00', 'HH:mm');

                let lateNightStops = formattedStops.filter(s => {
                    let momentStop = moment(s, 'HH:mm');

                    if (momentStop.isBetween(midnight, firstTrains) || momentStop.isSame(midnight)) {
                        return momentStop;
                    }
                });

                let daytimeStops = formattedStops.filter(s => {
                    let momentStop = moment(s, 'HH:mm');

                    if (!momentStop.isBetween(midnight, firstTrains) && !momentStop.isSame(midnight)) {
                        return momentStop;
                    }
                });

                formattedResponse[`station-${i+1}`] = [...daytimeStops, ...lateNightStops];
            });
            let respObject = {}
            let identifier = direction.toLowerCase() + routeDay;
            respObject[`${identifier}`] = formattedResponse
            return respObject;
        })
        .catch(err => console.log(err));
    return response;
}
