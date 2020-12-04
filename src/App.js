import 'leaflet/dist/leaflet.css';

import './App.css';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core';

import InfoBox from './InfoBox';
import LineGraph from './LineGraph';
import Map from './Map';
import Table from './Table';
import { sortData } from './utils';

const App = () => {
	const [countries, setCountries] = useState([]);
	const [selectedCountry, setSelectedCountry] = useState('worldwide');
	const [countryInfo, setCountryInfo] = useState({});
	const [tableData, setTableData] = useState([]);
	const [mapCenter, setMapCenter] = useState([0, 0]);
	const [mapZoom, setMapZoom] = useState(3);
	const [mapCountries, setMapCountries] = useState([]);
	const [casesType, setCasesType] = useState('cases');

	useEffect(() => {
		async function initialLoad() {
			const { data } = await axios.get('https://disease.sh/v3/covid-19/all');
			setCountryInfo(data);
		}
		initialLoad();
	}, []);

	useEffect(() => {
		const getCountries = async () => {
			const { data } = await axios.get('https://disease.sh/v3/covid-19/countries');
			const fetchedCountries = data.map((country) => ({
				name: country.country,
				iso: country.countryInfo.iso2,
				flag: country.countryInfo.flag,
			}));
			const sortedTableData = sortData(data);
			setTableData(sortedTableData);
			setMapCountries(data);
			setCountries(fetchedCountries);
		};
		getCountries();
	}, []);

	const onCountryChange = async (event) => {
		const countryName = event.target.value;
		const url =
			countryName === 'worldwide'
				? 'https://disease.sh/v3/covid-19/all'
				: `https://disease.sh/v3/covid-19/countries/${countryName}`;

		const { data } = await axios.get(url);
		setSelectedCountry(countryName);
		setCountryInfo(data);

		countryName === 'worldwide'
			? setMapCenter([34.80746, -40.4796])
			: setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
		countryName === 'worldwide' ? setMapZoom(3) : setMapZoom(4);
	};
	return (
		<div className='app'>
			<div className='app__left'>
				{/* Header Component */}
				<div className='app__header'>
					<h1>COVID-19 TRACKER</h1>
					<FormControl className='app__dropdown'>
						<Select
							variant='outlined'
							value={selectedCountry}
							onChange={onCountryChange}
						>
							<MenuItem value='worldwide'> Worldwide</MenuItem>
							{countries.length > 0 &&
								countries.map((country, i) => (
									<MenuItem value={country.iso} key={i}>
										<img
											height='15px'
											src={country.flag}
											alt={`${country.name} flag`}
										/>{' '}
										{country.name}
									</MenuItem>
								))}
						</Select>
					</FormControl>
				</div>

				<div className='app__stats'>
					<InfoBox
						active={casesType === 'cases'}
						casesType={casesType}
						onClick={(e) => setCasesType('cases')}
						title='Coronavirus cases'
						cases={countryInfo.todayCases}
						total={countryInfo.cases}
					/>
					<InfoBox
						isGreen
						active={casesType === 'recovered'}
						casesType={casesType}
						onClick={(e) => setCasesType('recovered')}
						title='Recovered'
						cases={countryInfo.todayRecovered}
						total={countryInfo.recovered}
					/>
					<InfoBox
						active={casesType === 'deaths'}
						casesType={casesType}
						onClick={(e) => setCasesType('deaths')}
						title='Deaths'
						cases={countryInfo.todayDeaths}
						total={countryInfo.deaths}
					/>
				</div>

				<Map
					casesType={casesType}
					countries={mapCountries}
					center={mapCenter}
					zoom={mapZoom}
				/>
			</div>

			<Card className='app__right'>
				<CardContent>
					<h3>Live Cases by Country</h3>
					<Table countries={tableData} />
				</CardContent>
				<CardContent>
					<h3>Worldwide new {casesType}</h3>
					<LineGraph casesType={casesType} />
				</CardContent>
			</Card>
		</div>
	);
};

export default App;
