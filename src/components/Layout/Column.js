import styled from 'styled-components'

export default styled.div`
	display: flex;
	flex-flow: column nowrap;
	width: ${({ span }) => `${(100 / 12) * span}%`};
	padding: 0 32px;
`
