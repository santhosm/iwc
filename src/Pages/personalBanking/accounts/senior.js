import React from 'react';

const Paccountssenior = (props) => {
    const formFields =["NAME","DOM","ADDRESS","PAN"]
    return (
        <div>
                <h1>Please fill in the form to create account</h1>    
                    <form className="seniorForm">
                    { formFields.map((item)=>(
                    <label>
                        {item}:
                        <input type ="text" id={item}></input>
                    </label>
                    ))}
                    <input type='submit' value='Submit' />                 
                </form>
  
                
        </div>
    )
}
export default Paccountssenior