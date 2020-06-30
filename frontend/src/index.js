"use strict";

import React from 'react'
import { render } from 'react-dom'
import App from './app'

import WebFontLoader from 'webfontloader';
import './Css/react-md.css';



WebFontLoader.load({
    google: {
        families: ['Roboto:300,400,500,700', 'Material Icons'],
    },
});

render(<App />, document.getElementById('app'));
