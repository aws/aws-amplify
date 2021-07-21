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
import { Credentials } from '@aws-amplify/core';
import { GeoClass } from '../src/Geo';
import { AmazonLocationServicesProvider } from '../src/Providers/AmazonLocationServicesProvider';
import { credentials, awsConfig } from './data';

describe('Geo', () => {
	afterEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	describe('constructor', () => {
		test('happy case', () => {
			const geo = new GeoClass();
		});
	});

	describe('getModuleName', () => {
		const geo = new GeoClass();
		const moduleName = geo.getModuleName();

		expect(moduleName).toBe('Geo');
	});

	describe('pluggables', () => {
		test('getPluggable', () => {
			const geo = new GeoClass();
			const provider = new AmazonLocationServicesProvider();
			geo.addPluggable(provider);

			expect(geo.getPluggable(provider.getProviderName())).toBeInstanceOf(
				AmazonLocationServicesProvider
			);
		});

		test('removePluggable', () => {
			const geo = new GeoClass();
			const provider = new AmazonLocationServicesProvider();
			geo.addPluggable(provider);
			geo.removePluggable(provider.getProviderName());

			expect(geo.getPluggable(provider.getProviderName())).toBeNull();
		});
	});

	describe('configure', () => {
		test('configure with aws-exports file', () => {
			const geo = new GeoClass();
			const config = geo.configure(awsConfig);
			expect(config).toEqual(awsConfig.geo);
		});
	});

	describe('get map resources', () => {
		test('should fail if there is no provider', async () => {
			jest.spyOn(Credentials, 'get').mockImplementationOnce(() => {
				return Promise.resolve(credentials);
			});

			const geo = new GeoClass();
			geo.configure(awsConfig);
			geo.removePluggable('AmazonLocationServices');

			expect(geo.getAvailableMaps()).toMatch(
				'No plugin found in Geo for the provider'
			);
			expect(geo.getDefaultMap()).toMatch(
				'No plugin found in Geo for the provider'
			);
		});

		test('should tell you if there are no available map resources', () => {
			const geo = new GeoClass();
			geo.configure({});

			const availableMaps = geo.getAvailableMaps();

			expect(availableMaps).toEqual(
				"No map resources found, run 'amplify add geo' to create them"
			);
		});

		test('should get all available map resources', () => {
			const geo = new GeoClass();
			geo.configure(awsConfig);

			const maps = [];
			const availableMaps = awsConfig.geo.maps.items;
			for (const mapName in availableMaps) {
				const style = availableMaps[mapName].style;
				maps.push({ mapName, style });
			}

			expect(geo.getAvailableMaps()).toEqual(maps);
		});

		test('should tell you if there is no default map resource', () => {
			const geo = new GeoClass();
			geo.configure({});

			const defaultMapsResource = geo.getDefaultMap();

			expect(defaultMapsResource).toEqual(
				"No default map resource found, run 'amplify add geo' to create one"
			);
		});

		test('should get the default map resource', () => {
			const geo = new GeoClass();
			geo.configure(awsConfig);

			const mapName = awsConfig.geo.maps.default;
			const style = awsConfig.geo.maps.items[mapName].style;
			const testMap = { mapName, style };

			const defaultMapsResource = geo.getDefaultMap();
			expect(defaultMapsResource).toEqual(testMap);
		});
	});
});
