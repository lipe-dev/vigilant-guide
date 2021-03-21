import styled from 'styled-components'

const DropArea = styled.div`
	border: 8px dashed #b6c4ce;
	width: 100%;
	text-align: center;
	padding-top: 32px;
	padding-bottom: 32px;
`

const Text = styled.p`
	font-size: 14pt;
`

DropArea.Text = Text

export default DropArea
