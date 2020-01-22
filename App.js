import React, { Component } from 'react';

import './progress.css';
import './forums.css';

function Progress() {
  return (
    <div className="progress">
      <h1>Progress</h1>
      <h2>How are you feeling today?</h2>
      <h3>thing1</h3>
      <div id="sliderDiv1">
        <h4>worst</h4>
        <input type="range" min="1" max="100" className="progressSlider" id="progress1" />
        <h4>best</h4>
      </div>
     
     <h3>thing2</h3>
     <div id="sliderDiv2">
        <h4>worst</h4>
        <input type="range" min="1" max="100" className="progressSlider" id="progress2" />
        <h4>best</h4>
      </div>
    </div>
  );
}


class Forums extends Component{

  constructor(props){
    super(props);
    
    this.state = {
      forumItems: [],
      forumPage: 0,
      forumTitle: 'Forums',
      forumTopics: ["Topic1", "Topic2", "Topic3", "Topic4"],
      forumViewIndex: -1,
      username: 'default',
      loggedIn: true,
      createTopic: "Topic"
    }

  }

  topicClick=(topicIndex)=>{
    //function when you click a topic

    //update state from values in db
    let topicName = this.state.forumTopics[topicIndex]
    console.log(topicName)
    fetch(`http://${window.location.hostname}:4000/forums/getposts?topic=${topicName}`)
    .then(response => response.json())
    .then((data)=>{
      console.log(data)
      this.setState({
        forumPage:1,
        forumTitle: topicName,
        forumItems: data
      })
    })
    .catch(err=>{console.log(err)})
  }

  back(){
    this.setState({
    forumPage:0,
    forumTitle:"Forums"  
    })
  }

  createPostShow=()=>{
    if(this.state.loggedIn){
      this.setState({
        createTopic: this.state.forumTitle,
        forumPage:2,
        forumTitle: "Create A Post"
      })
    }else{
      alert('not logged in')
    }

  }

  createPost=()=>{
    //set variables
    let title = document.getElementsByClassName('createpostInput')[0].value;
    let content = document.getElementsByClassName('createpostContent')[0].value;
    let username = this.state.username;
    let topic = this.state.createTopic;
    let date = Date.now();
    content = content.replace(/\n/g,'╝');
  
 

    //send to backend to store in database
    //user,contents, topic
    fetch(`http://${window.location.hostname}:4000/forums/createpost?user=${username}&contents=${content}&topic=${topic}&date=${date}&title=${title}`)
    
    //put them back to forum main page
    this.setState({
      forumPage:0,
      forumTitle: "Forums"
    })

  }

  viewPost=(index)=>{
    //get post from uid
    console.log(index)
   this.setState({
     forumPage:3,
     forumTitle: '',
     forumViewIndex: index
   })
  }

  render(){
    return(
      <div className="forums">
        {(this.state.forumPage != 0) && (
          <button onClick={this.back.bind(this)} className="forumsBack">Back</button>
        )}
        
        <h1>{this.state.forumTitle}</h1>
        {(this.state.forumPage==0 && (
                  <div className="topicsContainer">
                  <Topics text={this.state.forumTopics[0]} click={this.topicClick.bind(this,0)}></Topics>
                  <Topics text={this.state.forumTopics[1]} click={this.topicClick.bind(this,1)}></Topics>
                  <Topics text={this.state.forumTopics[2]} click={this.topicClick.bind(this,2)}></Topics>
                  <Topics text={this.state.forumTopics[3]} click={this.topicClick.bind(this,3)}></Topics>
                  </div>
        )) || (this.state.forumPage==1 && (
          <ForumItem viewPost={this.viewPost.bind(this)} list={this.state.forumItems} create={this.createPostShow.bind(this)}/>
        )) ||
        (this.state.forumPage==2 && (
          <CreatePost post={this.createPost}/>
        ))  ||
        (this.state.forumPage==3 && (
          <ViewPost post={this.state.forumItems[this.state.forumViewIndex]}/>
        ))
        }
        

        
      </div>
    )
  }
}

function ViewPost(props){
  return(
    <div id="viewPost">
  <p id="viewUsername">by {props.post.name} posted {new Date(parseInt(props.post.date)).getDate()}/{new Date(parseInt(props.post.date)).getMonth()+1}/{new Date(parseInt(props.post.date)).getFullYear()}</p>
  <h1 id="viewTitle">{props.post.title}</h1>
  <p id="viewContent" >{props.post.contents.replace(/╝/g,'\n')}</p>
    </div>
  )
}

function CreatePost(props){
  return(
    <div className="createpost">
        <h3 className="createpostTitle">Title</h3>
        <input type="text" placeholder='title' className="createpostInput"></input>
        <h3 className="createpostDesc">Share your story: </h3>
        <div><textarea type="textarea" placeholder='Write here' className="createpostContent" /></div>
        
        <button className="createpostButton" onClick={props.post}>Post</button>
    </div>
  )
}

function ForumItem(props){
  return(
    <ul className="forumItem">
        <li>
        <p className="forumTitle" onClick={props.create}>Create A Post</p>
       </li>
      {props.list.map((item, index) => (
       <li key={item.UID} onClick={()=>{props.viewPost(index)}}>
        <p className="forumTitle">{item.title}</p>
        <p className="forumUsername">by {item.name}</p>
        <p className="forumDate">{new Date(parseInt(item.date)).getDate()}/{new Date(parseInt(item.date)).getMonth()+1}/{new Date(parseInt(item.date)).getFullYear()}</p>

       </li>
      ))}
    </ul>
  )
}

function Topics(props){
  return(
    <div className="topic" onClick={props.click}>
      <p>{props.text}</p>
    </div>
  )
}



export default Forums;