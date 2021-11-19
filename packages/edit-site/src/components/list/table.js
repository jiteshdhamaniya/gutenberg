/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { __, sprintf } from '@wordpress/i18n';
import {
	VisuallyHidden,
	FlexItem,
	__experimentalHStack as HStack,
	__experimentalHeading as Heading,
	DropdownMenu,
	MenuGroup,
	MenuItem,
} from '@wordpress/components';
import { moreVertical } from '@wordpress/icons';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies
 */
import { store as editSiteStore } from '../../store';
import isTemplateRemovable from '../../utils/is-template-removable';
import isTemplateRevertable from '../../utils/is-template-revertable';

function Actions( { template } ) {
	const { removeTemplate, revertTemplate } = useDispatch( editSiteStore );

	const isRemovable = isTemplateRemovable( template );
	const isRevertable = isTemplateRevertable( template );

	if ( ! isRemovable && ! isRevertable ) {
		return null;
	}

	return (
		<DropdownMenu
			icon={ moreVertical }
			label={ __( 'Actions' ) }
			className="edit-site-list-table__actions"
		>
			{ ( { onClose } ) => (
				<MenuGroup>
					{ isRemovable && (
						<MenuItem
							onClick={ () => {
								removeTemplate( template );
								onClose();
							} }
						>
							{ __( 'Remove template' ) }
						</MenuItem>
					) }
					{ isRevertable && (
						<MenuItem
							info={ __( 'Restore template to theme default' ) }
							onClick={ () => {
								revertTemplate( template );
								onClose();
							} }
						>
							{ __( 'Clear customizations' ) }
						</MenuItem>
					) }
				</MenuGroup>
			) }
		</DropdownMenu>
	);
}

export default function Table( { templateType } ) {
	const { templates, isLoading, postType } = useSelect(
		( select ) => {
			const {
				getEntityRecords,
				hasFinishedResolution,
				getPostType,
			} = select( coreStore );

			return {
				templates: getEntityRecords( 'postType', templateType ),
				isLoading: ! hasFinishedResolution( 'getEntityRecords', [
					'postType',
					templateType,
				] ),
				postType: getPostType( templateType ),
			};
		},
		[ templateType ]
	);

	if ( ! templates || isLoading ) {
		return null;
	}

	if ( ! templates.length ) {
		return (
			<div>
				{ sprintf(
					// translators: The template type name, should be either "templates" or "template parts".
					__( 'No %s found.' ),
					postType?.labels?.name?.toLowerCase()
				) }
			</div>
		);
	}

	return (
		<ul className="edit-site-list-table">
			<HStack className="edit-site-list-table-head" as="li">
				<FlexItem className="edit-site-list-table-column">
					<Heading level={ 4 }>{ __( 'Template' ) }</Heading>
				</FlexItem>
				<FlexItem className="edit-site-list-table-column">
					<Heading level={ 4 }>{ __( 'Added by' ) }</Heading>
				</FlexItem>
				<FlexItem className="edit-site-list-table-column">
					<VisuallyHidden>{ __( 'Actions' ) }</VisuallyHidden>
				</FlexItem>
			</HStack>

			{ templates.map( ( template ) => (
				<li key={ template.id }>
					<HStack className="edit-site-list-table-row">
						<FlexItem className="edit-site-list-table-column">
							<a
								href={ addQueryArgs( '', {
									page: 'gutenberg-edit-site',
									postId: template.id,
									postType: template.type,
								} ) }
							>
								{ template.title.rendered }
							</a>
							{ template.description }
						</FlexItem>

						<FlexItem className="edit-site-list-table-column">
							{ template.theme }
						</FlexItem>
						<FlexItem className="edit-site-list-table-column">
							<Actions template={ template } />
						</FlexItem>
					</HStack>
				</li>
			) ) }
		</ul>
	);
}
