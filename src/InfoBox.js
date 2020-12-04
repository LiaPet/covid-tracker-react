import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import './InfoBox.css';

const InfoBox = ({ active, isGreen, casesType, title, cases, total, ...props }) => {
	if (cases) {
		cases = cases.toLocaleString('en');
		total = total.toLocaleString('en');
	}
	return (
		<Card
			className={`infoBox ${active && 'infoBox--selected--'}${casesType}`}
			onClick={props.onClick}
		>
			<CardContent>
				<Typography className='infoBox__title' color='textSecondary'>
					{title}
				</Typography>

				<h2 className={`infoBox__cases ${isGreen && 'infoBox__cases--recovered'}`}>
					{cases}
				</h2>

				<Typography className='infoBox__total' color='textSecondary'>
					{total} Total
				</Typography>
			</CardContent>
		</Card>
	);
};

export default InfoBox;
