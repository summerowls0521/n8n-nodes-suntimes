import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import SunCalc from 'suncalc';
import { DateTime } from 'luxon';

export class SunTimes implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Sun Times',
		name: 'sunTimes',
		icon: 'file:suntimes.svg',
		group: ['transform'],
		version: 1,
		description: 'Gets the sun times for a supplied date, longitude and latitude',
		defaults: {
			name: 'Sun Times',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			// Node properties which the user gets displayed and
			// can change on the node.
			{
				displayName: 'Latitude',
				name: 'latitude',
				type: 'number',
				default: 51.509865,
				placeholder: '51.509865',
				description: 'Latitude to get sun times for',
			},
			{
				displayName: 'Longitude',
				name: 'longitude',
				type: 'number',
				default: -0.118092,
				placeholder: '-0.118092',
				description: 'Longitude to get sun times for',
			},
			{
				displayName: 'Date',
				name: 'date',
				type: 'dateTime',
				default: '={{$today}}',
				description: 'Date to get times for',
			},
		],
	};

	// The function below is responsible for actually doing whatever this node
	// is supposed to do. In this case, we're just appending the `myString` property
	// with whatever the user has entered.
	// You can make async calls and use `await`.
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			try {
				const longitude = this.getNodeParameter('longitude', 0) as number;
				const latitude = this.getNodeParameter('latitude', 0) as number;

				if (isNaN(longitude) || longitude < -180 || longitude > 180) {
					throw new NodeOperationError(this.getNode(), 'Longitude is invalid');
				}

				if (isNaN(latitude) || latitude < -90 || latitude > 90) {
					throw new NodeOperationError(this.getNode(), 'Latitude is invalid');
				}

				const dateString = this.getNodeParameter('date', 0) as string;
				const date = DateTime.fromISO(dateString).set({
					hour: 12,
					minute: 0,
					second: 0,
					millisecond: 0,
				});

				const sunTimes = SunCalc.getTimes(date.toJSDate(), latitude, longitude) as Partial<
					ReturnType<typeof SunCalc.getTimes>
				>;
				const output: {
					[Key in keyof Partial<ReturnType<typeof SunCalc.getTimes>>]: string;
				} = {};
				for (const [key, value] of Object.entries(sunTimes) as [
					keyof typeof sunTimes,
					Date | undefined,
				][]) {
					if (value !== undefined && !isNaN(value.getTime())) {
						output[key] = value.toISOString();
					}
				}
				item.json = { ...item.json, ...output };
			} catch (error) {
				if (this.continueOnFail()) {
					/* Do nothing */
				} else {
					if (error.context) {
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error);
				}
			}
		}
		return [items];
	}
}
