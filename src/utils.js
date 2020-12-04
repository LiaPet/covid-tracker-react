import { Circle, Popup } from 'react-leaflet';
import numeral from 'numeral';

const casesTypeColors = {
	cases: {
		option: { color: '#cc1034', fillColor: '#cc1034' },
		multiplier: 800,
	},
	recovered: {
		option: { color: '#7dd71d', fillColor: '#7dd71d' },
		multiplier: 1200,
	},
	deaths: {
		option: { color: '#ff6c47', fillColor: '#ff6c47' },
		multiplier: 2000,
	},
};

export const sortData = (data) => {
	const sortedData = [...data];

	return sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1));
};

// Draw circles on map
export const showDataOnMap = (data, casesType = 'cases') =>
	data.map((country) => (
		<Circle
			center={[country.countryInfo.lat, country.countryInfo.long]}
			pathOptions={casesTypeColors[casesType].option}
			radius={Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier}
		>
			<Popup>
				<div className='info-container'>
					<div
						className='info-flag'
						style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
					></div>
					<div className='info-name'>{country.country}</div>
					<div className='info-confirmed'>
						Cases: {numeral(country.cases).format('0,0')}{' '}
					</div>
					<div className='info-recovered'>
						Recovered: {numeral(country.recovered).format('0,0')}{' '}
					</div>
					<div className='info-deaths'>
						Deaths: {numeral(country.deaths).format('0,0')}{' '}
					</div>
				</div>
			</Popup>
		</Circle>
	));
