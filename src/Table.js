import React from 'react';
import './Table.css';

const Table = ({ countries }) => {
	return (
		<div className='table'>
			{countries.map(({ country, cases, countryInfo }) => (
				<tr>
					<td>
						<img height='20px' src={countryInfo.flag} alt={country.country} />
					</td>
					<td> {country} </td>
					<td>
						<strong>{cases.toLocaleString('en')}</strong>
					</td>
				</tr>
			))}
		</div>
	);
};

export default Table;
