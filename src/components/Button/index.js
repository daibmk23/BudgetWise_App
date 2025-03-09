import React from 'react'
import './styles.css'
function Button({text, onClick, blue, disabled}) {
  return (
    <div 
    className={blue? 'bttn bttn-blue':'bttn'}
    onClick={onClick}
    disabled={disabled}
    >
    {text}
    </div>
  )
}

export default Button