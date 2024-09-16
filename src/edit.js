/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */

import { useBlockProps, InspectorControls } from '@wordpress/block-editor';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */

import { PanelBody, TextControl, Button, SearchControl, PanelRow } from '@wordpress/components';
import { react, useState, useEffect } from 'react';
import apiFetch from '@wordpress/api-fetch';


export default function Edit({ attributes, setAttributes }) {
	//$new = new Fnugg_API();
	const { data, resort } = attributes;
	const [searchTerm, setSearchTerm] = useState('');
	const [mySuggession, setMySuggestions] = useState([]);
	const [loading, setLoading] = useState(false);

	const autoCoplete = () => {
		setLoading(true);
		apiFetch({ path: `/fnugg/v1/search?q=${searchTerm}` })
			.then((results) => {
				JSON.stringify(setMySuggestions(results));
				setLoading(false);
			})
			.catch(() => {
				setLoading(false);
			});
	};

	const fetchResortData = (resort) => {
		setLoading(true);
		apiFetch({ path: `/fnugg/v1/search?q=${resort}` })
			.then((data) => {
				setAttributes({ data, resort });
				setLoading(false);
			})
			.catch(() => {
				setLoading(false);
			});
	};

	useEffect(() => {
		if (searchTerm.length > 2) {
			autoCoplete();
		}
	}, [searchTerm]);
	console.log(mySuggession);
	return (
		<>

			<p {...useBlockProps()}>

				<InspectorControls>
					<PanelBody title="Search Ski Resort">
						<SearchControl
							label="Search Resort"
							value={searchTerm}
							onChange={(value) => setSearchTerm(value)}
							help="Type to search for a ski resort."
						/>
						<PanelRow>
							<div style={{ "height": "200px", "width": "100%", "backgroundColor": "#c2c2c2" }}>

								Name:{ JSON.stringify(mySuggession.name)} <br />
								Description: { JSON.stringify(mySuggession.description)}
							</div>
						</PanelRow>
					</PanelBody>
				</InspectorControls>
				<TextControl
					label="Search Resort"
					value={searchTerm}
					onChange={(value) => setSearchTerm(value)}
					help="Type to search for a ski resort."
				/>
				<div style={{ "height": "100px", "width": "100%", "backgroundColor": "#c2c2c2" }}>
					{/* {mySuggession.map((item, index) => {
						return (
							<li key={index}>

								{item.name}

							</li>
						)

					})} */}
				</div>
			</p>
		</>
	);
}
