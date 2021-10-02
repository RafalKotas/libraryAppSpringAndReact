import React, { useState, useEffect } from 'react';
import { Switch, Route, Link} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faHome, faGlasses, faUser, faSignOutAlt} from "@fortawesome/free-solid-svg-icons";
import "./App.css";


//services
import AuthService from "./services/auth.service";

//subcomponents
import Login from "./components/AuthComponents/Login/Login";
import Register from "./components/AuthComponents/Register/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import ReaderPanel from "./components/ReaderPanel/ReaderPanel";
import LibrarianPanel from "./components/LibrarianPanel/LibrarianPanel";
import BookPage from "./components/LibraryMainSection/BookList/BookPage/BookPage"
import NotLoggedActions from './components/NavbarOptions/NotLoggedActions/NotLoggedActions';
import BookEditPage from './components/LibraryMainSection/BookEditPage';
import BookAddPage from './components/LibraryMainSection/AllBooksSectionHeader/BookAddPage/BookAddPage';
import LibraryMainSection from './components/LibraryMainSection/LibraryMainSection';
import PanelItem from './components/NavbarOptions/PanelItem';
import UserLoggedPanel from './components/NavbarOptions/UserLoggedPanel/UserLoggedPanel';
import userManipulationService from './services/userManipulation.service';

const App = () => {
  const [showLibrarianBoard, setShowLibrarianBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if(user) {
      setCurrentUser(user);
      setShowLibrarianBoard(user.roles.includes("ROLE_LIBRARIAN"));
    }

  }, []);

  const logOut = () => {
    const user = AuthService.getCurrentUser();

    AuthService.logout();
    
    userManipulationService.removeTokenOnLogout(user.id)
      .then((resultToCheck) => {
    })
  }

  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <Link to={"/"} className="navbar-brand">
          Rafał's Library
        </Link>
        <div className="navbar-nav mr-auto">
          <PanelItem 
              linkPath="/home" 
              additionalClasses="vertical-line-right" 
              textContent={"Home"} 
              icon={faHome}
          />

          {showLibrarianBoard && (
            <PanelItem 
                linkPath="/librarian" 
                additionalClasses="vertical-line-right" 
                textContent={"Librarian Panel"} 
                icon={faGlasses}
            />
          )}

          {currentUser && (
            <UserLoggedPanel
              user={currentUser}
            />
          )}
        </div>

        {currentUser ? (
          <div className="navbar-nav ml-auto">
            <PanelItem 
              linkPath="/profile" 
              additionalClasses="vertical-line-right" 
              textContent={currentUser.username} 
              icon={faUser}/>
            <li className="nav-item">
              <a href="/login" className="nav-link" onClick={logOut}>
                Log Out <FontAwesomeIcon icon={faSignOutAlt} />
              </a>
            </li>
          </div>
        ) : (
          <NotLoggedActions/>
        )}
      </nav>

      <div id="mainAppContent" className="container">
          <Switch>
            <Route exact path={"/books"/*"/:currentPage/:resetFilters"*/} //(/:pageSize)
              children={currentUser && <LibraryMainSection user={currentUser}/>} />
            <Route path={"/book/about/:bookId"} 
              children={currentUser && <BookPage user={currentUser}/>
            }/>
            <Route path={"/book/update/:id"} children={<BookEditPage />} />
            <Route exact path={"/book/add"} children={<BookAddPage />} />
            <Route exact path={["/home", "/"]} component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/profile" component={Profile} />
            <Route path={"/reader/:id"}
              children={currentUser && 
                <ReaderPanel
                  user={currentUser} 
                />}
            />
            <Route path="/librarian" component={LibrarianPanel} />
          </Switch>
      </div>
    </div>
  )
}

export default App;
