import React from 'react'
import { Global, css } from '@emotion/react'

const GlobalStyles = () => {
    return <Global styles={
        css`
          font-family: Nunito sans-serif;
        `} />
}

GlobalStyles.propTypes = {}
GlobalStyles.defaultProps = {}

export default GlobalStyles