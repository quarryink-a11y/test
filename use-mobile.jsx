/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import AboutMe from './pages/AboutMe';
import Admins from './pages/Admins';
import Analytics from './pages/Analytics';
import Catalog from './pages/Catalog';
import Dashboard from './pages/Dashboard';
import Designs from './pages/Designs';
import Events from './pages/Events';
import Faq from './pages/Faq';
import HowToBook from './pages/HowToBook';
import Portfolio from './pages/Portfolio';
import Reviews from './pages/Reviews';
import Settings from './pages/Settings';
import Shop from './pages/Shop';
import TemplatePreview from './pages/TemplatePreview';
import Templates from './pages/Templates';
import Onboarding from './pages/Onboarding';
import PublicSite from './pages/PublicSite';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AboutMe": AboutMe,
    "Admins": Admins,
    "Analytics": Analytics,
    "Catalog": Catalog,
    "Dashboard": Dashboard,
    "Designs": Designs,
    "Events": Events,
    "Faq": Faq,
    "HowToBook": HowToBook,
    "Portfolio": Portfolio,
    "Reviews": Reviews,
    "Settings": Settings,
    "Shop": Shop,
    "TemplatePreview": TemplatePreview,
    "Templates": Templates,
    "Onboarding": Onboarding,
    "PublicSite": PublicSite,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};