import React from 'react';
import OutsideAlerter from './OutsideAlerter';
import {Link} from 'react-router-dom'
import './NavDropdown.css'

const NavDropdown = (props) => (
    <OutsideAlerter outside = {props.Outside} className={props.className}>
        <ul className="dropdown">
            <div>
                {props.items.map((item,index)=>(
                    <li className="dropdownText" key = {item} ><Link to={"/"+props.subpath+'/'+item} >{item}</Link></li>
                    )) 
                }  
            </div>   
        </ul> 
    </OutsideAlerter>
)


export default NavDropdown;