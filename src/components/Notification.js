import React from 'react';

function Notification(props) {
    return (
      <aside style={{backgroundColor: props.success ? 'rgb(172, 211, 172)' : 'rgb(206, 66, 66)'}}>
          { props.message }
        <footer>
          <div>{ props.success ? "✔ Succeeded" : "x Failed" }</div>
          <div>Just now</div>
        </footer>
      </aside>
    )
}

export default Notification;