import React from 'react'

//Returns class for circle based on score and status
function scoreClass(score, betrayed) {
    var className = "";
    if(score >= 10000){
        className = "App-circle-10000";
    }
    else if(score >= 1000){
        className = "App-circle-1000";
    }
    else if(score >= 100){
        className = "App-circle-100";
    }
    else if(score >= 10){
        className = "App-circle-10";
    }
    else{
        className = "App-circle-1";
    }
    return "App-circle " + (betrayed ? "App-circle-betrayed" : className);
}

function Circle(props) {
    return (
        <div className={scoreClass(props.circle.score, props.circle.betrayed)}><a className="App-circle-name" href={"http://www.reddit.com" + props.circle.link} target="_blank">{props.circle.name}</a><span className="App-circle-score">{props.circle.score}</span></div>
    )
}

export default Circle;