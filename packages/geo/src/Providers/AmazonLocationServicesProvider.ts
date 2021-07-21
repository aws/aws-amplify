/*
 * Copyright 2017-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

import { ConsoleLogger as Logger, Credentials } from '@aws-amplify/core';
import {
	LocationClient,
	SearchPlaceIndexForTextCommand,
	SearchPlaceIndexForPositionCommand,
} from '@aws-sdk/client-location';

import {
	convertPlaceCamelToPascal,
	convertPlaceArrayPascalToCamel,
} from '../utils';
import {
	GeoConfig,
	Coordinates,
	SearchByTextOptions,
	GeoProvider,
	Place,
	SearchByCoordinatesOptions,
} from '../types';

const logger = new Logger('AmazonLocationServicesProvider');

export class AmazonLocationServicesProvider implements GeoProvider {
	static CATEGORY = 'Geo';
	static PROVIDER_NAME = 'AmazonLocationServices';

	/**
	 * @private
	 */
	private _config;

	/**
	 * Initialize Geo with AWS configurations
	 * @param {Object} config - Configuration object for Geo
	 */
	constructor(config?: GeoConfig) {
		this._config = config ? config : {};
		logger.debug('Geo Options', this._config);

		this.getAvailableMaps.bind(this);
		this.getDefaultMap.bind(this);
		this.searchByText.bind(this);
		this.searchByCoordinates.bind(this);
	}

	/**
	 * get the category of the plugin
	 */
	public getCategory(): string {
		return AmazonLocationServicesProvider.CATEGORY;
	}

	/**
	 * get provider name of the plugin
	 */
	public getProviderName(): string {
		return AmazonLocationServicesProvider.PROVIDER_NAME;
	}

	/**
	 * Configure Geo part with aws configuration
	 * @param {Object} config - Configuration of the Geo
	 * @return {Object} - Current configuration
	 */
	public configure(config?): object {
		logger.debug('configure Amazon Location Services Provider', config);
		if (!config) return this._config;
		this._config = Object.assign({}, this._config, config);
		return this._config;
	}

	public getAvailableMaps() {
		if (!this._config.maps) {
			return "No map resources found, run 'amplify add geo' to create them";
		}

		const maps = [];
		const availableMaps = this._config.maps.items;

		for (const mapName in availableMaps) {
			const style = availableMaps[mapName].style;
			maps.push({ mapName, style });
		}

		return maps;
	}

	public getDefaultMap() {
		if (!this._config.maps || !this._config.maps.default) {
			return "No default map resource found, run 'amplify add geo' to create one";
		}

		const mapName = this._config.maps.default;
		const style = this._config.maps.items[mapName].style;

		return { mapName, style };
	}

	public async searchByText(
		text: string,
		options?: SearchByTextOptions
	): Promise<Place[]> {
		const credentialsOK = await this._getCredentials();
		if (!credentialsOK) {
			return Promise.reject('No credentials');
		}

		let searchInput = {
			Text: text,
			IndexName: this._config.place_indexes.default,
		};
		if (options) {
			const PascalOptions = convertPlaceCamelToPascal(options);
			searchInput = {
				...searchInput,
				...PascalOptions,
			};
		}
		const client = new LocationClient({
			credentials: this._config.credentials,
			region: this._config.region,
		});
		const command = new SearchPlaceIndexForTextCommand(searchInput);

		const response = await client.send(command);

		const PascalResults = response.Results.map(result => result.Place);
		const results = convertPlaceArrayPascalToCamel(PascalResults);

		return results;
	}

	public async searchByCoordinates(
		coordinates: Coordinates,
		options?: SearchByCoordinatesOptions
	) {
		const credentialsOK = await this._getCredentials();
		if (!credentialsOK) {
			return Promise.reject('No credentials');
		}
		let searchInput = {
			Position: coordinates,
			IndexName: this._config.place_indexes.default,
		};
		if (options) {
			const PascalOptions = convertPlaceCamelToPascal(options);
			searchInput = {
				...searchInput,
				...PascalOptions,
			};
		}

		const client = new LocationClient({
			credentials: this._config.credentials,
			region: this._config.region,
		});
		const command = new SearchPlaceIndexForPositionCommand(searchInput);

		const response = await client.send(command);

		const PascalResults = response.Results.map(result => result.Place);
		const results = convertPlaceArrayPascalToCamel(PascalResults);

		return results;
	}

	/**
	 * @private
	 */
	private _getCredentials() {
		return Credentials.get()
			.then(credentials => {
				if (!credentials) return false;
				const cred = Credentials.shear(credentials);
				logger.debug('get credentials for Location Services', cred);
				this._config.credentials = cred;

				return true;
			})
			.catch(error => {
				logger.warn('get credentials error', error);
				return false;
			});
	}
}
