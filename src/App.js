import React,{Component} from 'react';
import {Route,Switch} from 'react-router-dom';
import Navigator from './components/Navigator';
import Home from './Pages/Home';
import Pcards from './Pages/personalBanking/cards/cards';
import Paccounts from './Pages/personalBanking/personal';
import {Widget, addResponseMessage} from 'react-chat-widget';
import API from './Assets/Axios/api';
import CobrowseAPI from './Assets/Axios/cobrowse';
import './App.css';
import 'react-chat-widget/lib/styles.css';
class App extends Component{
  state = {
    chatId: null,
    restore: false
  }
  chatLauncher= (toggler) => {
    if (!this.state.chatId) {
      API.post('/dialogs')
      .then(res =>{
        this.setState({chatId:res.data.id})
        console.log(this.state)
        toggler()
      })
    } else {
      toggler()
    }    
  }
  timeout = (ms) =>{
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  //<a href="https://www.freeiconspng.com/img/1127" title="Image from freeiconspng.com"><img src="https://www.freeiconspng.com/uploads/cursor-png-ico-icns-free-icon-download--icon100m-20.png" width="350" alt="Cursor PNG/ICO/ICNS Free Icon Download  icon100m" /></a>
  //<a href="https://www.freeiconspng.com/img/30506" title="Image from freeiconspng.com"><img src="https://www.freeiconspng.com/uploads/robot-icon-18.png" width="350" alt="Free Svg Robot" /></a>
  handleNewUserMessage = async(newMessage) => {
    const res = await API.post('/dialogs/'+this.state.chatId,{input: newMessage})
    const elem = document.createElement("img");
        elem.setAttribute("src","https://www.freeiconspng.com/uploads/hand-cursor-clip-art--royalty--14.png");
        elem.setAttribute("height", "25");
        elem.setAttribute("width", "25");
        elem.style.top ="21px";
        elem.style.right = "40px"
        elem.style.position = "relative"
        elem.setAttribute("alt", "Flower");
      if(res.data.actions.continue_prev_session === "YES") {
        console.log("setting restore")
        this.setState({restore:true})
      }
    const click = async(id) =>{
      try {
        document.getElementById(id).appendChild(elem);
        await scrollandhighlight(id);
        await this.timeout(2000);
        document.getElementById(id).click();
        await this.timeout(1000);
        document.getElementById(id).removeChild(elem);
        await this.timeout(2000);
      } catch (e){
        console.log(e)
      }
    }
    const scrollandhighlight = async(id) => {
      try {
        const elem1 = document.getElementById(id);
        elem1.scrollIntoView();
        elem1.style.border = "5px solid red";
        await this.timeout(1000);
        elem1.style.border = "none";

      } catch (e){
        console.log(e)
      }

    }
    const inputEntry = async(id,value) =>{
      let elem = document.getElementById(id)
      elem.classList.add("active-input");      
      await this.timeout(2000);
      elem.setAttribute("value",value);
      await this.timeout(2000);
      elem.classList.remove("active-input")
    }    
      if(Object.keys(res.data.actions).length) { //navigate to senior page
        const cobrowseInit = await CobrowseAPI.post('/intents',res.data.actions)
        if(cobrowseInit.data) {
          for(var i=0;i<cobrowseInit.data.length;i++) {
            if(Object.keys(cobrowseInit.data[i])[0]==="click") {
              await click (cobrowseInit.data[i].click)
            }
            else if(Object.keys(cobrowseInit.data[i])[0]==="inputEntry") {
              let val = cobrowseInit.data[i].inputEntry[1]
              if (res.data.slots.dob) {
                let bday = res.data.slots.dob.split(" ")
                res.data.slots.dob = bday[0]
              }
              await inputEntry (cobrowseInit.data[i].inputEntry[0],res.data.slots[val])
            }
            else if(Object.keys(cobrowseInit.data[i][0]==="scrollandhighlight")) {
              console.log(cobrowseInit.data[i])
              await scrollandhighlight (cobrowseInit.data[i].scrollandhighlight)
            }
          }

        }        
      }
      if(res.data.response) {
        res.data.response.forEach((prompt) => {
          addResponseMessage(prompt)          
        });
      }
 
  }
  render() {
    return (
      <div className="App">
        <Navigator />
        <Widget 
                  handleNewUserMessage={this.handleNewUserMessage}
                  title="Genesys Chat"
                  subtitle=" "
                  launcher={handleToggle => (
                    <button key ="1" className = 'rcw-launcher' onClick={this.chatLauncher.bind(this, handleToggle)}>
                      <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzRweCIgaGVpZ2h0PSIzMnB4IiB2aWV3Qm94PSIwIDAgMzQgMzIiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDQ1LjEgKDQzNTA0KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5pY19idXR0b248L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iRGVza3RvcC1IRCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEyOTkuMDAwMDAwLCAtNzQ4LjAwMDAwMCkiIGZpbGwtcnVsZT0ibm9uemVybyIgZmlsbD0iI0ZGRkZGRiI+CiAgICAgICAgICAgIDxnIGlkPSJHcm91cC0yIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMjg5LjAwMDAwMCwgNzM1LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9ImljX2J1dHRvbiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTAuMjA2OTMzLCAxMy42MDc4MjUpIj4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjUuNzg2NTM5OCw3LjM3MDUxODYzIEMyNS43ODY1Mzk4LDguNDA4MDMxMTggMjUuMDQzMjAyNiw5LjAzOTAxMDkgMjQuNTAwNDE2MSw5LjUwMjA1NjQyIEMyNC4yOTQ4NTE3LDkuNjc3NDQzODggMjMuOTEyMjI3MSw5Ljk5NzQ2MjMgMjMuOTEzMjQ4NCwxMC4xMTY5OTc1IEMyMy45MTY5NjIzLDEwLjU4NTg5MjQgMjMuNTQ1OTQzNiwxMC45NjAzNDc5IDIzLjA4NDM5ODYsMTAuOTYwMzQ3OSBDMjMuMDgyMDc3NSwxMC45NjAzNDc5IDIzLjA3OTc1NjMsMTAuOTYwMzQ3OSAyMy4wNzc0MzUxLDEwLjk2MDM0NzkgQzIyLjYxOTEzOTgsMTAuOTYwMzQ3OSAyMi4yNDU3MDcxLDEwLjU5NzQwMjUgMjIuMjQxOTkzMiwxMC4xMzA4NjYyIEMyMi4yMzQ2NTgyLDkuMjExMjg0OTcgMjIuODk1MDgyNiw4LjY2MDU5Mjg5IDIzLjQyNTc5ODksOC4yMDc4MzA5OCBDMjMuODQyMjIsNy44NTI1Mjc1MSAyNC4xMTUyODQ2LDcuNjAyNTEzMTEgMjQuMTE1Mjg0Niw3LjM3MzcyNjM2IEMyNC4xMTUyODQ2LDYuOTEwNTg2NDkgMjMuNzQ0NDUxNiw2LjUzMzc3MjM1IDIzLjI4ODY2MzIsNi41MzM3NzIzNSBDMjIuODMyNjg5LDYuNTMzNzcyMzUgMjIuNDYxNzYzMiw2LjkxMDU4NjQ5IDIyLjQ2MTc2MzIsNy4zNzM3MjYzNiBDMjIuNDYxNzYzMiw3Ljg0MjcxNTYyIDIyLjA4NzY4MDYsOC4yMjI4MzE4NCAyMS42MjYxMzU2LDguMjIyODMxODQgQzIxLjE2NDU5MDYsOC4yMjI4MzE4NCAyMC43OTA1MDgsNy44NDI3MTU2MiAyMC43OTA1MDgsNy4zNzM3MjYzNiBDMjAuNzkwNTA4LDUuOTc0MjExODMgMjEuOTExMDg0Niw0LjgzNTU2MTM4IDIzLjI4ODQ3NzUsNC44MzU1NjEzOCBDMjQuNjY1OTYzMiw0LjgzNTQ2NzAzIDI1Ljc4NjUzOTgsNS45NzA5MDk3NiAyNS43ODY1Mzk4LDcuMzcwNTE4NjMgWiBNMjMuMTAwNTU0MSwxMS43NDQxNjY2IEMyMi42MzkwMDkxLDExLjc0NDE2NjYgMjIuMjgzNDAzMSwxMi4xMjQyODI4IDIyLjI4MzQwMzEsMTIuNTkzMjcyMSBMMjIuMjgzNDAzMSwxMi41OTk3ODE5IEMyMi4yODM0MDMxLDEzLjA2ODc3MTIgMjIuNjM5MTAyLDEzLjQ0NTY3OTcgMjMuMTAwNTU0MSwxMy40NDU2Nzk3IEMyMy41NjIwMDYzLDEzLjQ0NTY3OTcgMjMuOTM2MTgxNywxMy4wNjIyNjE0IDIzLjkzNjE4MTcsMTIuNTkzMjcyMSBDMjMuOTM2MTgxNywxMi4xMjQyODI4IDIzLjU2MjA5OTEsMTEuNzQ0MTY2NiAyMy4xMDA1NTQxLDExLjc0NDE2NjYgWiBNNi4yNTcxNzk2LDE3LjY1ODk0MTEgQzUuNzk1NjM0NjIsMTcuNjU4OTQxMSA1LjQyMTU1MTk5LDE4LjAzOTA1NzMgNS40MjE1NTE5OSwxOC41MDgwNDY2IEM1LjQyMTU1MTk5LDE4Ljk3NzAzNTggNS43OTU2MzQ2MiwxOS4zNTcxNTIgNi4yNTcxNzk2LDE5LjM1NzE1MiBMNi4zMjY4MTUyNCwxOS4zNTcxNTIgQzYuNzg4MzYwMjMsMTkuMzU3MTUyIDcuMTYyNDQyODYsMTguOTc3MDM1OCA3LjE2MjQ0Mjg2LDE4LjUwODA0NjYgQzcuMTYyNDQyODYsMTguMDM5MDU3MyA2Ljc4ODM2MDIzLDE3LjY1ODk0MTEgNi4zMjY4MTUyNCwxNy42NTg5NDExIEw2LjI1NzE3OTYsMTcuNjU4OTQxMSBaIE05LjE2MTM1Njk3LDE3LjY1ODk0MTEgQzguNjk5ODExOTgsMTcuNjU4OTQxMSA4LjMyNTcyOTM1LDE4LjAzOTA1NzMgOC4zMjU3MjkzNSwxOC41MDgwNDY2IEM4LjMyNTcyOTM1LDE4Ljk3NzAzNTggOC42OTk4MTE5OCwxOS4zNTcxNTIgOS4xNjEzNTY5NywxOS4zNTcxNTIgTDkuMjMwODk5NzUsMTkuMzU3MTUyIEM5LjY5MjQ0NDc0LDE5LjM1NzE1MiAxMC4wNjY1Mjc0LDE4Ljk3NzAzNTggMTAuMDY2NTI3NCwxOC41MDgwNDY2IEMxMC4wNjY1Mjc0LDE4LjAzOTA1NzMgOS42OTI0NDQ3NCwxNy42NTg5NDExIDkuMjMwODk5NzUsMTcuNjU4OTQxMSBMOS4xNjEzNTY5NywxNy42NTg5NDExIFogTTMzLjcwMzY0NzMsNC4wOTY5MzM5NSBMMzMuNzAzNjQ3MywxMy42NTQxODIyIEMzMy43MDM2NDczLDE1LjkxNzA0ODMgMzEuOTE4MDAzOSwxNy43NTMyODYxIDI5LjY5MTA1NjMsMTcuNzUzMjg2MSBMMTguODU0MTczMSwxNy43NTMyODYxIEMxOC42NDIyOTUxLDE3Ljc1MzI4NjEgMTguNDY3ODM0NiwxNy43NTIwNTk2IDE4LjMyMTg3ODMsMTcuNzQ4OTQ2MyBDMTguMTY4OTU4NSwxNy43NDU3Mzg1IDE3Ljk5NjgxOTIsMTcuNzQ0NTEyIDE3LjkyOTY5MDQsMTcuNzUyMDU5NiBDMTcuODU5Nzc2MiwxNy43OTkyMzIyIDE3LjY4ODM3OTcsMTcuOTU4NzY5NyAxNy41MjMyMDQsMTguMTEzNDAxMiBDMTcuNDU3NzQ2NSwxOC4xNzQ2MzExIDE3LjM4MzY1NDIsMTguMjQxOTkzNSAxNy4zMDM3MTI1LDE4LjMxNjE0ODcgTDE0LjIzNzcwMTksMjEuMTU1NzQ2MSBDMTMuOTkzMTQxNSwyMS4zODI0NTczIDEzLjYzMTMxNDgsMjEuNDQxMTM5OSAxMy4zMjg0NDYyLDIxLjMwNTQ3MTcgQzEzLjAyNTU3NzYsMjEuMTY5NzA5MiAxMi44MTI5NTY4LDIwLjg2NDk3NDcgMTIuODEyOTU2OCwyMC41Mjg2MzQ2IEwxMi44MTI5NTY4LDExLjUyNjUxMjYgTDQuMDU5MjkzMjcsMTEuNTI2NTEyNiBDMi43NTM2NzE1NCwxMS41MjY1MTI2IDEuNjcxMjU1MjQsMTIuNjEzNjUwNiAxLjY3MTI1NTI0LDEzLjk0MDE0MjEgTDEuNjcxMjU1MjQsMjMuNDk3MzkwNCBDMS42NzEyNTUyNCwyNC44MjM5NzYyIDIuNzUzNzY0MzksMjUuODY2OTYwNyA0LjA1OTI5MzI3LDI1Ljg2Njk2MDcgTDE2LjE2NDE5NDksMjUuODY2OTYwNyBDMTYuMzcyNjM3NiwyNS44NjY5NjA3IDE2LjU2NzYxNzQsMjUuOTY0MjMwNSAxNi43MjE1NTg2LDI2LjEwNzA2ODkgTDE5LjIxOTQzNTIsMjguNDQ3MjAzNiBMMTkuMjE5NDM1MiwyMC4zNzcwMjIxIEMxOS4yMTk0MzUyLDE5LjkwODAzMjggMTkuNTkzNTE3OCwxOS41Mjc5MTY2IDIwLjA1NTA2MjgsMTkuNTI3OTE2NiBDMjAuNTE2NjA3OCwxOS41Mjc5MTY2IDIwLjg5MDY5MDUsMTkuOTA4MDMyOCAyMC44OTA2OTA1LDIwLjM3NzAyMjEgTDIwLjg5MDY5MDUsMzAuMzcxNzQ4NCBDMjAuODkwNjkwNSwzMC43MDgwODg1IDIwLjcwMTI4MTUsMzEuMDA4Mjk0NCAyMC4zOTgzMjAxLDMxLjE0NDA1NyBDMjAuMjg5OTY3LDMxLjE5MjY0NDcgMjAuMTgxMTQ5OCwzMS4yMTE3OTY3IDIwLjA2NzIyNTksMzEuMjExNzk2NyBDMTkuODYyNTg5OSwzMS4yMTE3OTY3IDE5LjY2MDczOTQsMzEuMTI2NDE0NCAxOS41MDM3MzQzLDMwLjk4MDc0NTcgTDE1Ljg0MDI1LDI3LjU2NTA3NzQgTDQuMDU5MjkzMjcsMjcuNTY1MDc3NCBDMS44MzIyNTI4MiwyNy41NjUwNzc0IDAsMjUuNzYwMjU2NSAwLDIzLjQ5NzI5NiBMMCwxMy45NDAxNDIxIEMwLDExLjY3NzI3NiAxLjgzMjI1MjgyLDkuODI4MzAxNjIgNC4wNTkyOTMyNyw5LjgyODMwMTYyIEwxMi44MTI5NTY4LDkuODI4MzAxNjIgTDEyLjgxMjk1NjgsNC4wOTY5MzM5NSBDMTIuODEyOTU2OCwxLjgzMzk3MzUgMTQuNjU5MjI5NiwwLjAxNjQxNjAzOTMgMTYuODg2MjcwMSwwLjAxNjQxNjAzOTMgTDI5LjY5MTE0OTEsMC4wMTY0MTYwMzkzIEMzMS45MTgwMDM5LDAuMDE2NDE2MDM5MyAzMy43MDM2NDczLDEuODMzOTczNSAzMy43MDM2NDczLDQuMDk2OTMzOTUgWiBNMzIuMDMyMzkyLDQuMDk2OTMzOTUgQzMyLjAzMjM5MiwyLjc3MDM0ODE2IDMwLjk5NjQ5MjMsMS43MTQ2MjcgMjkuNjkxMDU2MywxLjcxNDYyNyBMMTYuODg2MjcwMSwxLjcxNDYyNyBDMTUuNTgwNzQxMiwxLjcxNDYyNyAxNC40ODQyMTIsMi43NzAzNDgxNiAxNC40ODQyMTIsNC4wOTY5MzM5NSBMMTQuNDg0MjEyLDEwLjY4NTMzMjEgTDE0LjQ4NDIxMiwxOC42MDQwODk4IEwxNi4xNjQyODc4LDE3LjA2MTI2NTIgQzE2LjI0MjA5NCwxNi45ODkwOTEyIDE2LjMyOTI3NzgsMTYuOTIzMDQ5NyAxNi4zOTI4Nzg0LDE2Ljg2MzQyMzYgQzE3LjE2MDA3NzQsMTYuMTQ1MDgwMyAxNy4zNTYzNTcsMTYuMDMwMjYyNCAxOC4zNTcwNjc1LDE2LjA1MTIwNyBDMTguNDkzNTUzNCwxNi4wNTQxMzE3IDE4LjY1NjEyOTQsMTYuMDU1MTY5NSAxOC44NTQxNzMxLDE2LjA1NTE2OTUgTDI5LjY5MTA1NjMsMTYuMDU1MTY5NSBDMzAuOTk2NDkyMywxNi4wNTUxNjk1IDMyLjAzMjM5MiwxNC45ODA3NjggMzIuMDMyMzkyLDEzLjY1NDI3NjYgTDMyLjAzMjM5Miw0LjA5NjkzMzk1IFoiIGlkPSJTaGFwZSI+PC9wYXRoPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=" className="rcw-open-launcher" alt="">
                      </img>
                    </button>
                  )}/>
        <Switch>         
          <Route exact path='/' component={Home} />
          <Route exact path='/personal/cards' component={Pcards} />
          
          {this.state.restore 
          ? <Route 
            path='/personal/accounts' 
            render={(props) => <Paccounts {...props} restore={true} />}/>
          :
          <Route path='/personal/accounts' 
          render={(props) => <Paccounts {...props} restore={false} />}/>
          }
          
        </Switch>        
      </div>
    )
  }

}
export default App;
