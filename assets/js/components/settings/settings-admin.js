/**
 * SettingsOverview component.
 *
 * Site Kit by Google, Copyright 2019 Google LLC
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
 * WordPress dependencies
 */
import { Fragment, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { STORE_NAME as CORE_USER } from '../../googlesitekit/datastore/user/constants';
import Layout from '../layout/layout';
import { Cell } from '../../material-components';
import OptIn from '../optin';
import VisuallyHidden from '../VisuallyHidden';
import ResetButton from '../ResetButton';
import UserInputPreview from '../user-input/UserInputPreview';
import {
	USER_INPUT_QUESTION_GOALS,
	USER_INPUT_QUESTION_HELP_NEEDED,
	USER_INPUT_QUESTION_POST_FREQUENCY,
	USER_INPUT_QUESTION_ROLE,
	USER_INPUT_QUESTION_SEARCH_TERMS,
} from '../user-input/util/constants';
import { STORE_NAME as CORE_SITE } from '../../googlesitekit/datastore/site/constants';
import UserInputSettings from '../notifications/UserInputSettings';
const { useSelect } = Data;

const questions = [
	USER_INPUT_QUESTION_ROLE,
	USER_INPUT_QUESTION_POST_FREQUENCY,
	USER_INPUT_QUESTION_GOALS,
	USER_INPUT_QUESTION_HELP_NEEDED,
	USER_INPUT_QUESTION_SEARCH_TERMS,
];

const SettingsAdmin = () => {
	const { isUserInputCompleted, userInputURL } = useSelect( ( select ) => ( {
		isUserInputCompleted: select( CORE_USER ).getUserInputState() === 'completed',
		userInputURL: select( CORE_SITE ).getAdminURL( 'googlesitekit-user-input' ),
	} ) );

	const goTo = useCallback( ( num = 1 ) => {
		global.location.assign( addQueryArgs( userInputURL, {
			question: questions[ num - 1 ],
			redirect_url: global.location.href,
		} ) );
	}, [ userInputURL ] );

	return (
		<Fragment>
			{ featureFlags.userInput.enabled && (
				<Cell size={ 12 }>
					<Layout>
						{ isUserInputCompleted ? (
							<div className="googlesitekit-module-page googlesitekit-settings-user-input">
								<UserInputPreview noFooter goTo={ goTo } />
							</div>
						) : (
							<UserInputSettings isNotDismissable />
						) }
					</Layout>
				</Cell>
			) }
			<div className="
				mdc-layout-grid__cell
				mdc-layout-grid__cell--span-12
			">
				<Layout>
					<div className="
						googlesitekit-settings-module
						googlesitekit-settings-module--active
					">
						<div className="mdc-layout-grid">
							<div className="mdc-layout-grid__inner">
								<div className="
									mdc-layout-grid__cell
									mdc-layout-grid__cell--span-6-desktop
									mdc-layout-grid__cell--span-4-tablet
									mdc-layout-grid__cell--span-4-phone
								">
									<h3 className="
										googlesitekit-heading-4
										googlesitekit-settings-module__title
									">
										{ __( 'Plugin Status', 'google-site-kit' ) }
									</h3>
								</div>
								<div className="
									mdc-layout-grid__cell
									mdc-layout-grid__cell--span-6-desktop
									mdc-layout-grid__cell--span-4-tablet
									mdc-layout-grid__cell--span-4-phone
									mdc-layout-grid__cell--align-middle
									mdc-layout-grid__cell--align-right-tablet
								">
								</div>
								<div className="
									mdc-layout-grid__cell
									mdc-layout-grid__cell--span-12
								">
									<div className="googlesitekit-settings-module__meta-items">
										<p className="googlesitekit-settings-module__status">
											{ __( 'Site Kit is connected', 'google-site-kit' ) }
											<span className="
												googlesitekit-settings-module__status-icon
												googlesitekit-settings-module__status-icon--connected
											">
												<VisuallyHidden>
													{ __( 'Connected', 'google-site-kit' ) }
												</VisuallyHidden>
											</span>
										</p>
									</div>
								</div>
							</div>
						</div>
						<footer className="googlesitekit-settings-module__footer">
							<div className="mdc-layout-grid">
								<div className="mdc-layout-grid__inner">
									<div className="
										mdc-layout-grid__cell
										mdc-layout-grid__cell--span-12
										mdc-layout-grid__cell--span-8-tablet
										mdc-layout-grid__cell--span-4-phone
									">
										<ResetButton />
									</div>
								</div>
							</div>
						</footer>
					</div>
				</Layout>
			</div>
			<div className="
				mdc-layout-grid__cell
				mdc-layout-grid__cell--span-12
			">
				<Layout
					header
					title={ __( 'Tracking', 'google-site-kit' ) }
					className="googlesitekit-settings-meta"
					fill
				>
					<div className="
						googlesitekit-settings-module
						googlesitekit-settings-module--active
					">
						<div className="mdc-layout-grid">
							<div className="mdc-layout-grid__inner">
								<div className="
									mdc-layout-grid__cell
									mdc-layout-grid__cell--span-12
								">
									<div className="googlesitekit-settings-module__meta-items">
										<div className="
											googlesitekit-settings-module__meta-item
											googlesitekit-settings-module__meta-item--nomargin
										">
											<OptIn optinAction="analytics_optin_settings_page" />
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Layout>
			</div>
		</Fragment>
	);
};

export default SettingsAdmin;
