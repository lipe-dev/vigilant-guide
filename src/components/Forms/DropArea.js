import styled from 'styled-components'

const DropArea = styled.div`
	width: 100%;
	padding-top: 32px;
	padding-bottom: 32px;

	text-align: center;

	border: 8px dashed #b6c4ce;
`

const Text = styled.p`
	font-size: 14pt;
`

DropArea.Text = Text

export default DropArea
