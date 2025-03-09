import React from 'react'
import "./styles.css"
function Header() {
  const logoutFnc = () => {
    alert('logout')
  }
  return (
    <div className="navbar">
      <p className='navbar-heading'>BudgetWise</p>
      <p className='navbar-link' onClick={logoutFnc}>Logout</p>
      </div>
  )
}

export default Header