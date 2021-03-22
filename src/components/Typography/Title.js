import styled from 'styled-components'

export default styled.h1`
	margin-top: 8px;
	margin-bottom: 8px;

	color: ${({ black }) => (black ? '#000' : '#f0f3f5')};
	font-size: 48pt;
	font-family: 'Pacifico', cursive;
	text-align: center;
	text-shadow: 4px 4px 0 ${({ black }) => (black ? '#00000000' : '#000')};
`
