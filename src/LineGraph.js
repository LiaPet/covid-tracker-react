import React, { useEffect, useState } from 'react';
import { Line } from '@reactchartjs/react-chart.js';
import axios from 'axios';
import numeral from 'numeral';
import './LineGraph.css';

const options = {
	legend: {
		display: false,
	},
	elements: {
		point: {
			radius: 0,
		},
	},
	maintainAspectRatio: false,
	tooltips: {
		mode: 'index',
		intersect: false,
		callbacks: {
			label: function (tooltipItem) {
				return numeral(tooltipItem.value).format('+0,0');
			},
		},
	},
	scales: {
		xAxes: [
			{
				type: 'time',
				time: {
					format: 'MM/DD/YY',
					tooltipFormat: 'll',
				},
			},
		],
		yAxes: [
			{
				gridLines: {
					display: false,
				},
				ticks: {
					callback: function (value, index, values) {
						return numeral(value).format('0a');
					},
				},
			},
		],
	},
};

const buildChartData = (data, casesType = 'cases') => {
	let chartData = [];
	let lastDataPoint;

	for (let date in data.cases) {
		if (lastDataPoint) {
			let newDataPoint = {
				x: date,
				y: data[casesType][date] - lastDataPoint,
			};
			chartData.push(newDataPoint);
		}
		lastDataPoint = data[casesType][date];
	}
	return chartData;
};

const LineGraph = ({ casesType }) => {
	const [data, setData] = useState({});

	useEffect(() => {
		const fetchChartData = async () => {
			const { data } = await axios.get(
				'https://disease.sh/v3/covid-19/historical/all?lastdays=120'
			);
			let chartData = buildChartData(data, casesType);
			setData(chartData);
		};
		fetchChartData();
	}, [casesType]);

	return (
		<div className='lineGraph'>
			<h3>Graph</h3>
			{data?.length > 0 && (
				<Line
					data={{
						datasets: [
							{
								backgroundColor: 'rgba(204,16,52,0.4)',
								borderColor: '#cc1034',
								data: data,
							},
						],
					}}
					options={options}
				/>
			)}
		</div>
	);
};

export default LineGraph;
