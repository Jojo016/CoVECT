//import React from 'react';
//import ReactDOM from 'react-dom';
import Editor from "./Editor";
import './styles/index.css';
//import { createRoot } from 'react-dom/client';

// ========================================

document.body.innerHTML = '<div id="app"></div>';

const root = createRoot(document.getElementById('app'));

root.render('<h1>Hello world!<h1>');

/*
ReactDOM.render(
    Editor,
    document.getElementById('root')
);*/
