import "./CircularButton.scss"
import React from 'react'
import FaIcon from "/src/components/generic/FaIcon.jsx"

function CircularButton({options, type, onOptionClicked}) {
    type = type || 'default'

    const _onOptionClicked = (option, e) => {
        if(onOptionClicked) {
            onOptionClicked(option)
        }
    }

    return (
            
        <button data-tooltip={options.tooltip}
                aria-label={options.aria}
                className={`circular-button circular-button-${type}`}
                onClick={(e) => {_onOptionClicked(options, e)}}>
            <FaIcon iconName={options.faIcon}/>
        </button>
                
    )
}

export default CircularButton