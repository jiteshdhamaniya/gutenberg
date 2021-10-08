/**
 * Internal dependencies
 */
import stripHTML from '../strip-html';

describe( 'stripHTML', () => {
	it( 'should strip basic HTML', () => {
		const input =
			'<strong>Here is some text</strong> that contains <em>HTML markup</em>.';
		const output = 'Here is some text that contains HTML markup.';
		expect( stripHTML( input ) ).toBe( output );
	} );

	it( 'should strip invalid HTML', () => {
		const input =
			'<strong>Here is some text</em> <p></div>that contains HTML markup</p>.';
		const output = 'Here is some text that contains HTML markup.';
		expect( stripHTML( input ) ).toBe( output );
	} );

	it( 'should preserve leading spaces', () => {
		const input =
			'       <strong>Here is some text</strong> with <em>leading spaces</em>.';
		const output = '       Here is some text with leading spaces.';
		expect( stripHTML( input ) ).toBe( output );
	} );

	it( 'should preserve leading spaces with HTML', () => {
		const input =
			'<strong>      Here is some text</strong> with <em>leading spaces</em>.';
		const output = '      Here is some text with leading spaces.';
		expect( stripHTML( input ) ).toBe( output );
	} );
} );