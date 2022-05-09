/**
 * PermissionsModal component tests.
 *
 * Site Kit by Google, Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Internal dependencies
 */
import PermissionsModal from './';
import {
	render,
	createTestRegistry,
	provideUserAuthentication,
} from '../../../../tests/js/test-utils';
import { CORE_USER } from '../../googlesitekit/datastore/user/constants';

describe( 'PermissionsModal', () => {
	let registry;

	beforeEach( () => {
		registry = createTestRegistry();
		registry.dispatch( CORE_USER ).receiveConnectURL( 'test-url' );
		registry.dispatch( CORE_USER ).setPermissionScopeError( {
			status: 500,
			message: 'Bad',
			data: {
				scopes: [
					'https://www.googleapis.com/auth/analytics.readonly',
				],
			},
		} );
	} );

	it( 'does not render AuthenticatedPermissionsModal when user is not authenticated', () => {
		provideUserAuthentication( registry, { authenticated: false } );
		const { baseElement } = render( <PermissionsModal />, { registry } );

		expect( baseElement ).not.toHaveTextContent(
			'Additional Permissions Required'
		);
	} );

	it( 'renders AuthenticatedPermissionsModal when user is authenticated', () => {
		provideUserAuthentication( registry );
		const { baseElement } = render( <PermissionsModal />, { registry } );

		expect( baseElement ).toHaveTextContent(
			'Additional Permissions Required'
		);
	} );
} );
