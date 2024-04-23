/**
 * `modules/analytics-4` data store: audiences.
 *
 * Site Kit by Google, Copyright 2024 Google LLC
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
import API from 'googlesitekit-api';
import Data from 'googlesitekit-data';
import { MODULES_ANALYTICS_4 } from './constants';
import { createFetchStore } from '../../../googlesitekit/data/create-fetch-store';
import { createValidatedAction } from '../../../googlesitekit/data/utils';
import { validateAudience } from '../utils/validation';

const fetchCreateAudienceStore = createFetchStore( {
	baseName: 'createAudience',
	controlCallback: ( { audience } ) =>
		API.set( 'modules', 'analytics-4', 'create-audience', {
			audience,
		} ),
	argsToParams: ( audience ) => ( {
		audience,
	} ),
	validateParams: ( { audience } ) => {
		validateAudience( audience );
	},
} );

const fetchSyncAvailableAudiencesStore = createFetchStore( {
	baseName: 'syncAvailableAudiences',
	controlCallback: () =>
		API.set( 'modules', 'analytics-4', 'sync-audiences' ),
	reducerCallback: ( state, audiences ) => {
		return {
			...state,
			settings: {
				...state.settings,
				availableAudiences: [ ...audiences ],
			},
		};
	},
} );

const baseActions = {
	/**
	 * Creates new property audience.
	 *
	 * @since 1.120.0
	 *
	 * @param {Object} audience                             The property audience parameters.
	 * @param {string} [audience.displayName]               Required. The display name of the Audience.
	 * @param {string} [audience.description]               Required. The description of the Audience.
	 * @param {number} [audience.membershipDurationDays]    Required. The duration a user should stay in an Audience. Cannot be more than 540 days.
	 * @param {Array}  [audience.filterClauses]             Required. Filter clauses array of <AudienceFilterClause> objects that define the Audience.
	 * @param {Object} [audience.eventTrigger]              Optional. Specifies an event to log when a user joins the Audience.
	 * @param {string} [audience.eventTrigger.eventName]    Required if `eventTrigger` is provided. The event name that will be logged.
	 * @param {string} [audience.eventTrigger.logCondition] Required if `eventTrigger` is provided. When to log the event. Acceptable values:
	 *                                                      - 'LOG_CONDITION_UNSPECIFIED': Log condition is not specified.
	 *                                                      - 'AUDIENCE_JOINED': The event should be logged only when a user is joined.
	 *                                                      - 'AUDIENCE_MEMBERSHIP_RENEWED': The event should be logged whenever the Audience condition is met, even if the user is already a member of the Audience.
	 * @param {string} [audience.exclusionDurationMode]     Optional. Specifies how long an exclusion lasts for users that meet the exclusion filter. Acceptable values:
	 *                                                      - 'AUDIENCE_EXCLUSION_DURATION_MODE_UNSPECIFIED': Not specified.
	 *                                                      - 'EXCLUDE_TEMPORARILY': Exclude users from the Audience during periods when they meet the filter clause.
	 *                                                      - 'EXCLUDE_PERMANENTLY': Exclude users from the Audience if they've ever met the filter clause.
	 * @return {Object} Object with `response` and `error`.
	 */
	createAudience: createValidatedAction(
		validateAudience,
		function* ( audience ) {
			const { response, error } =
				yield fetchCreateAudienceStore.actions.fetchCreateAudience(
					audience
				);

			// Sync available audiences in the state.
			if ( error === undefined ) {
				yield fetchSyncAvailableAudiencesStore.actions.fetchSyncAvailableAudiences();
			}

			return { response, error };
		}
	),

	/**
	 * Syncs available audiences from the Analytics service.
	 *
	 * @since n.e.x.t
	 *
	 * @return {Object} Object with `response` and `error`.
	 */
	*syncAvailableAudiences() {
		const { response, error } =
			yield fetchSyncAvailableAudiencesStore.actions.fetchSyncAvailableAudiences();

		return { response, error };
	},
};

const baseReducer = ( state, { type } ) => {
	switch ( type ) {
		default: {
			return state;
		}
	}
};

const baseResolvers = {
	*getAvailableAudiences() {
		const registry = yield Data.commonActions.getRegistry();

		const audiences = registry
			.select( MODULES_ANALYTICS_4 )
			.getAvailableAudiences();

		// If available audiences not present, sync the audience in state.
		if ( audiences === undefined ) {
			yield fetchSyncAvailableAudiencesStore.actions.fetchSyncAvailableAudiences();
		}
	},
};

const store = Data.combineStores(
	fetchCreateAudienceStore,
	fetchSyncAvailableAudiencesStore,
	{
		initialState: {},
		actions: baseActions,
		controls: {},
		reducer: baseReducer,
		resolvers: baseResolvers,
		selectors: {},
	}
);

export const initialState = store.initialState;
export const actions = store.actions;
export const controls = store.controls;
export const reducer = store.reducer;
export const resolvers = store.resolvers;
export const selectors = store.selectors;

export default store;
